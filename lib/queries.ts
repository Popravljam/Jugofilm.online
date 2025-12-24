import { getDb } from './db';

export interface MovieWithCast {
  id: number;
  tmdb_id: number | null;
  wikidata_id: string | null;
  title: string;
  original_title: string;
  title_local: string | null;
  title_en: string | null;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  budget: number;
  revenue: number;
  runtime: number;
  imdb_id: string | null;
  source: string;
  youtube_key?: string | null;
  genres?: string[];
  cast?: any[];
  directors?: string[];
  writers?: string[];
}

export function getAllMovies(): MovieWithCast[] {
  const db = getDb();
  const movies = db.prepare(`
    SELECT * FROM movies ORDER BY popularity DESC
  `).all() as MovieWithCast[];
  
  return movies;
}

import { __DB_PATH } from './db';

export function getMovieFullById(id: number): MovieWithCast | null {
  const db = getDb();
  const movie = db.prepare(`SELECT * FROM movies WHERE id = ?`).get(id) as MovieWithCast | undefined;
  // Debug log once per call (visible in PM2 logs)
  console.log('[movie]', { id, db: __DB_PATH, found: !!movie });
  if (!movie) return null;
  const cast = db.prepare(`
    SELECT a.id, a.name, a.original_name, a.profile_path, mc.character, mc.cast_order
    FROM movie_cast mc
    JOIN actors a ON mc.actor_id = a.id
    WHERE mc.movie_id = ?
    ORDER BY mc.cast_order
  `).all(id);
  const directors = db.prepare(`
    SELECT d.name
    FROM movie_directors md
    JOIN directors d ON md.director_id = d.id
    WHERE md.movie_id = ?
  `).all(id) as any[];
  const writers = db.prepare(`
    SELECT w.name
    FROM movie_writers mw
    JOIN writers w ON mw.writer_id = w.id
    WHERE mw.movie_id = ?
  `).all(id) as any[];
  const genres = db.prepare(`
    SELECT g.name
    FROM movie_genres mg
    JOIN genres g ON mg.genre_id = g.id
    WHERE mg.movie_id = ?
    ORDER BY g.name COLLATE NOCASE
  `).all(id) as any[];
  movie.cast = cast;
  movie.directors = directors.map(r => r.name);
  movie.writers = writers.map(r => r.name);
  movie.genres = genres.map(r => r.name);
  return movie;
}

export function getMoviesWithCast(): any[] {
  const db = getDb();
  const movies = getAllMovies();
  
  const getCastStmt = db.prepare(`
    SELECT a.id, a.name, a.original_name, a.profile_path, mc.character, mc.cast_order
    FROM movie_cast mc
    JOIN actors a ON mc.actor_id = a.id
    WHERE mc.movie_id = ?
    ORDER BY mc.cast_order
  `);
  
  const getDirectorsStmt = db.prepare(`
    SELECT d.name
    FROM movie_directors md
    JOIN directors d ON md.director_id = d.id
    WHERE md.movie_id = ?
  `);
  
  const getWritersStmt = db.prepare(`
    SELECT w.name
    FROM movie_writers mw
    JOIN writers w ON mw.writer_id = w.id
    WHERE mw.movie_id = ?
  `);
  
  for (const movie of movies) {
    movie.cast = getCastStmt.all(movie.id);
    movie.directors = (getDirectorsStmt.all(movie.id) as any[]).map(r => r.name);
    movie.writers = (getWritersStmt.all(movie.id) as any[]).map(r => r.name);
  }
  
  return movies;
}

export function getSimilarByCast(movieId: number, limit: number = 12) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT m.id, m.title, m.original_title, m.release_date, m.poster_path, COUNT(*) AS shared
    FROM movie_cast mc
    JOIN movie_cast mc2 ON mc.actor_id = mc2.actor_id AND mc2.movie_id = ?
    JOIN movies m ON m.id = mc.movie_id
    WHERE mc.movie_id != ?
    GROUP BY m.id
    ORDER BY shared DESC, m.popularity DESC
    LIMIT ?
  `).all(movieId, movieId, limit) as any[];
  return rows;
}

export function getAllActors(): { name: string; movieCount: number }[] {
  const db = getDb();
  return db.prepare(`
    SELECT a.name, COUNT(DISTINCT mc.movie_id) as movieCount
    FROM actors a
    JOIN movie_cast mc ON a.id = mc.actor_id
    GROUP BY a.id, a.name
    ORDER BY a.name COLLATE NOCASE
  `).all() as { name: string; movieCount: number }[];
}

export function getMoviesByActors(actorNames: string[]): any[] {
  const db = getDb();
  
  // Find actor IDs
  const placeholders = actorNames.map(() => '?').join(',');
  const actors = db.prepare(`
    SELECT id FROM actors WHERE name IN (${placeholders})
  `).all(...actorNames) as { id: number }[];
  
  if (actors.length === 0) return [];
  
  const actorIds = actors.map(a => a.id);
  
  // Find movies that have ALL these actors
  const movieIds = db.prepare(`
    SELECT movie_id, COUNT(DISTINCT actor_id) as actor_count
    FROM movie_cast
    WHERE actor_id IN (${actorIds.map(() => '?').join(',')})
    GROUP BY movie_id
    HAVING actor_count = ?
  `).all(...actorIds, actorIds.length) as { movie_id: number }[];
  
  if (movieIds.length === 0) return [];
  
  // Get full movie data
  const movies = db.prepare(`
    SELECT * FROM movies
    WHERE id IN (${movieIds.map(() => '?').join(',')})
    ORDER BY popularity DESC
  `).all(...movieIds.map(m => m.movie_id)) as MovieWithCast[];
  
  // Attach cast
  const getCastStmt = db.prepare(`
    SELECT a.id, a.name, a.original_name, a.profile_path, mc.character, mc.cast_order
    FROM movie_cast mc
    JOIN actors a ON mc.actor_id = a.id
    WHERE mc.movie_id = ?
    ORDER BY mc.cast_order
  `);
  
  const getDirectorsStmt = db.prepare(`
    SELECT d.name
    FROM movie_directors md
    JOIN directors d ON md.director_id = d.id
    WHERE md.movie_id = ?
  `);
  
  for (const movie of movies) {
    movie.cast = getCastStmt.all(movie.id);
    movie.directors = (getDirectorsStmt.all(movie.id) as any[]).map(r => r.name);
  }
  
  return movies;
}

export function getStats() {
  const db = getDb();
  
  const movieCount = (db.prepare('SELECT COUNT(*) as count FROM movies').get() as any).count;
  const actorCount = (db.prepare('SELECT COUNT(*) as count FROM actors').get() as any).count;
  const roleCount = (db.prepare('SELECT COUNT(*) as count FROM movie_cast').get() as any).count;
  
  return {
    movies: movieCount,
    actors: actorCount,
    roles: roleCount
  };
}
