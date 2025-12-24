import 'dotenv/config';
import { resetDatabase, getDb, optimizeDatabase, closeDatabase } from '../lib/db';
import { getAllExYuMovies, getMovieCredits, getMovieDetails, getMovieVideos } from '../lib/tmdb';
import { fetchSerbianMoviesFromWikidata } from '../lib/wikidata';

async function main() {
  console.log('Starting data fetch...');
  console.log('======================');
  
  // Reset database
  console.log('\n1. Resetting database...');
  resetDatabase();
  
  const db = getDb();
  
  // Fetch TMDb movies
  console.log('\n2. Fetching movies from TMDb...');
  const tmdbMovies = await getAllExYuMovies();
  console.log(`   Fetched ${tmdbMovies.length} movies from TMDb`);
  
  // Fetch Wikidata movies
  console.log('\n3. Fetching movies from Wikidata...');
  const wikidataMovies = await fetchSerbianMoviesFromWikidata();
  console.log(`   Fetched ${wikidataMovies.length} movies from Wikidata`);
  
  // Merge movies (avoid duplicates by title)
  const tmdbTitles = new Set(tmdbMovies.map((m: any) => m.title.toLowerCase()));
  const wikidataOnly = wikidataMovies.filter(
    (wm: any) => !tmdbTitles.has(wm.title.toLowerCase())
  );
  const allMovies = [...tmdbMovies, ...wikidataOnly];
  console.log(`   Total unique movies: ${allMovies.length}`);
  
  // Prepare statements
const insertMovieStmt = db.prepare(`
    INSERT OR REPLACE INTO movies (
      id, tmdb_id, wikidata_id, title, original_title, title_local, title_en,
      overview, release_date, poster_path, backdrop_path, vote_average, vote_count,
      popularity, original_language, budget, revenue, runtime, imdb_id, youtube_key, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertGenreStmt = db.prepare(`
    INSERT OR IGNORE INTO genres (id, name) VALUES (?, ?)
  `);
  
  const insertMovieGenreStmt = db.prepare(`
    INSERT OR IGNORE INTO movie_genres (movie_id, genre_id) VALUES (?, ?)
  `);
  
  const insertActorStmt = db.prepare(`
    INSERT OR IGNORE INTO actors (id, name, original_name, profile_path, known_for_department, popularity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const insertDirectorStmt = db.prepare(`
    INSERT OR IGNORE INTO directors (name) VALUES (?)
  `);
  
  const insertWriterStmt = db.prepare(`
    INSERT OR IGNORE INTO writers (name) VALUES (?)
  `);
  
  const getDirectorIdStmt = db.prepare(`SELECT id FROM directors WHERE name = ?`);
  const getWriterIdStmt = db.prepare(`SELECT id FROM writers WHERE name = ?`);
  
  const insertMovieCastStmt = db.prepare(`
    INSERT OR IGNORE INTO movie_cast (movie_id, actor_id, character, cast_order)
    VALUES (?, ?, ?, ?)
  `);
  
  const insertMovieDirectorStmt = db.prepare(`
    INSERT OR IGNORE INTO movie_directors (movie_id, director_id) VALUES (?, ?)
  `);
  
  const insertMovieWriterStmt = db.prepare(`
    INSERT OR IGNORE INTO movie_writers (movie_id, writer_id) VALUES (?, ?)
  `);
  
  // Fetch credits for TMDb movies
  console.log('\n4. Fetching credits and details for TMDb movies...');
  for (let i = 0; i < tmdbMovies.length; i++) {
    const movie: any = tmdbMovies[i];
    
    try {
      const [credits, details, videos] = await Promise.all([
        getMovieCredits(movie.id),
        getMovieDetails(movie.id),
        getMovieVideos(movie.id)
      ]);
      
      movie.cast = credits.cast.slice(0, 20);
      
      // Directors from crew
      const directors = (credits.crew || [])
        .filter((c: any) => c.job === 'Director')
        .map((c: any) => c.name)
        .filter(Boolean);
      movie.directors = directors;
      
      // Writers from crew
      const writers = (credits.crew || [])
        .filter((c: any) => c.job === 'Writer' || c.job === 'Screenplay' || c.department === 'Writing')
        .map((c: any) => c.name)
        .filter(Boolean);
      movie.writers = Array.from(new Set(writers));
      
      // Details
      movie.budget = details.budget || 0;
      movie.revenue = details.revenue || 0;
      movie.runtime = details.runtime || 0;
      // genres
      (movie as any).genres = Array.isArray(details.genres) ? details.genres.map((g: any) => ({ id: g.id, name: g.name })) : [];
      // trailer (YouTube)
      const vids = Array.isArray(videos?.results) ? videos.results : [];
      const pick = vids.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || vids.find((v: any) => v.site === 'YouTube');
      (movie as any).youtube_key = pick?.key || null;
      // Capture production countries (ISO-3166-1 alpha-2)
      const prodCodes = Array.isArray(details.production_countries)
        ? details.production_countries.map((c: any) => c.iso_3166_1).filter(Boolean)
        : [];
      (movie as any)._prod_codes = prodCodes;
      
      if ((i + 1) % 100 === 0) {
        console.log(`   Fetched credits for ${i + 1}/${tmdbMovies.length} movies`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`   Error fetching credits for movie ${movie.id}:`, error);
    }
  }
  
  // Filter to ex-Yu production countries only to avoid false positives
  const ALLOWED = new Set(['RS','HR','BA','ME','MK','SI','XK','YU','CS']);
  const filteredTmdb = tmdbMovies.filter((m: any) => {
    const codes = (m as any)._prod_codes || [];
    return codes.some((code: string) => ALLOWED.has(code));
  });
  const before = tmdbMovies.length;
  const after = filteredTmdb.length;
  console.log(`\n5. Filtering by production countries: kept ${after}/${before} TMDb movies`);

  const allMoviesFiltered = [...filteredTmdb, ...wikidataOnly];

  // Insert all movies into database
  console.log('\n6. Inserting movies into database...');
  
  // Temporarily disable foreign key constraints for bulk insert
  db.pragma('foreign_keys = OFF');
  
  const insertTransaction = db.transaction((movies: any[]) => {
    for (const movie of movies) {
      // Insert movie
      insertMovieStmt.run(
        movie.id,
        movie.source === 'tmdb' ? movie.id : null,
        movie.wikidataId || null,
        movie.title,
        movie.original_title || movie.title,
        (movie as any).title_local || null,
        (movie as any).title_en || null,
        movie.overview || '',
        movie.release_date || '',
        movie.poster_path || null,
        movie.backdrop_path || null,
        movie.vote_average || 0,
        movie.vote_count || 0,
        movie.popularity || 0,
        movie.original_language || '',
        movie.budget || 0,
        movie.revenue || 0,
        movie.runtime || 0,
        movie.imdbId || null,
        (movie as any).youtube_key || null,
        movie.source || 'tmdb'
      );
      
      // Insert genres
      const genres: any[] = (movie as any).genres || [];
      for (const g of genres) {
        insertGenreStmt.run(g.id, g.name);
        insertMovieGenreStmt.run(movie.id, g.id);
      }
      
      // Insert cast
      if (movie.cast && Array.isArray(movie.cast)) {
        for (let j = 0; j < movie.cast.length; j++) {
          const actor = movie.cast[j];
          insertActorStmt.run(
            actor.id,
            actor.name,
            actor.original_name || actor.name,
            actor.profile_path || null,
            actor.known_for_department || 'Acting',
            actor.popularity || 0
          );
          insertMovieCastStmt.run(movie.id, actor.id, actor.character || '', j);
        }
      }
      
      // Insert directors
      if (movie.directors && Array.isArray(movie.directors)) {
        for (const directorName of movie.directors) {
          insertDirectorStmt.run(directorName);
          const result: any = getDirectorIdStmt.get(directorName);
          if (result) {
            insertMovieDirectorStmt.run(movie.id, result.id);
          }
        }
      }
      
      // Insert writers
      if (movie.writers && Array.isArray(movie.writers)) {
        for (const writerName of movie.writers) {
          insertWriterStmt.run(writerName);
          const result: any = getWriterIdStmt.get(writerName);
          if (result) {
            insertMovieWriterStmt.run(movie.id, result.id);
          }
        }
      }
    }
  });
  
  insertTransaction(allMoviesFiltered);
  console.log(`   Inserted ${allMoviesFiltered.length} movies`);
  
  // Re-enable foreign key constraints
  db.pragma('foreign_keys = ON');
  
  // Count actors
  const actorCount: any = db.prepare('SELECT COUNT(*) as count FROM actors').get();
  console.log(`   Total actors: ${actorCount.count}`);
  
  // Optimize database
  console.log('\n6. Optimizing database...');
  optimizeDatabase();
  
  console.log('\n======================');
  console.log('Data fetch complete!');
  console.log('======================\n');
  
  closeDatabase();
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  closeDatabase();
  process.exit(1);
});
