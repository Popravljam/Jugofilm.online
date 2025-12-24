import { Movie, CastMember } from '@/types/tmdb';

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

interface WikidataMovie {
  movieLabel: string;
  movieId: string;
  year?: string;
  directorLabel?: string;
  castLabel?: string;
  imdbId?: string;
}

export async function fetchSerbianMoviesFromWikidata(): Promise<any[]> {
  const query = `
    SELECT DISTINCT ?movie ?movieLabel ?year ?directorLabel ?castLabel ?imdbId WHERE {
      # Films from all ex-Yugoslav countries
      {
        ?movie wdt:P31 wd:Q11424.        # instance of: film
        ?movie wdt:P495 wd:Q403.         # Serbia
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q224.         # Croatia
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q225.         # Bosnia and Herzegovina
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q236.         # Montenegro
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q221.         # North Macedonia
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q215.         # Slovenia
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q1246.        # Kosovo
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q36704.       # Socialist Federal Republic of Yugoslavia
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q83286.       # Federal Republic of Yugoslavia
      } UNION {
        ?movie wdt:P31 wd:Q11424.
        ?movie wdt:P495 wd:Q37024.       # Serbia and Montenegro
      }
      
      # Get basic info
      OPTIONAL { ?movie wdt:P577 ?publicationDate. BIND(YEAR(?publicationDate) AS ?year) }
      OPTIONAL { ?movie wdt:P57 ?director. }
      OPTIONAL { ?movie wdt:P161 ?cast. }
      OPTIONAL { ?movie wdt:P345 ?imdbId. }
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "sr,en". }
    }
    LIMIT 5000
  `;

  try {
    const response = await fetch(WIKIDATA_SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `query=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Wikidata SPARQL error: ${response.status}`);
    }

    const data = await response.json();
    return processWikidataResults(data.results.bindings);
  } catch (error) {
    console.error('Error fetching from Wikidata:', error);
    return [];
  }
}

function processWikidataResults(bindings: any[]): any[] {
  // Group by movie
  const movieMap = new Map<string, any>();

  bindings.forEach((binding: any) => {
    const movieId = binding.movie.value;
    const movieTitle = binding.movieLabel?.value || 'Unknown';
    const year = binding.year?.value;
    const director = binding.directorLabel?.value;
    const actor = binding.castLabel?.value;
    const imdbId = binding.imdbId?.value;

    if (!movieMap.has(movieId)) {
      const wikidataId = movieId.split('/').pop() || ''; // Extract Wikidata ID (e.g., Q12345)
      // Convert Wikidata ID to numeric (remove Q and convert)
      const numericId = wikidataId.startsWith('Q') ? parseInt(wikidataId.substring(1)) + 10000000 : Math.random() * 1000000;
      
      movieMap.set(movieId, {
        id: numericId,
        wikidataId: wikidataId,
        title: movieTitle,
        original_title: movieTitle,
        release_date: year ? `${year}-01-01` : '',
        overview: '',
        poster_path: null,
        backdrop_path: null,
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        original_language: 'sr',
        genre_ids: [],
        cast: [],
        directors: [],
        imdbId: imdbId,
        source: 'wikidata',
      });
    }

    const movie = movieMap.get(movieId);
    
    if (actor && !movie.cast.find((c: any) => c.name === actor)) {
      // Generate deterministic ID from actor name
      const actorId = actor.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) + 20000000;
      
      movie.cast.push({
        id: actorId,
        name: actor,
        original_name: actor,
        profile_path: null,
        known_for_department: 'Acting',
        popularity: 0,
        character: '',
        order: movie.cast.length,
        cast_id: movie.cast.length,
      });
    }

    if (director && !movie.directors.includes(director)) {
      movie.directors.push(director);
    }
  });

  return Array.from(movieMap.values());
}

export async function mergeWikidataWithTMDb(tmdbMovies: any[]): Promise<any[]> {
  console.log('Fetching ex-Yugoslav movies from Wikidata...');
  const wikidataMovies = await fetchSerbianMoviesFromWikidata();
  
  console.log(`Found ${wikidataMovies.length} ex-Yu movies from Wikidata`);
  
  // Merge: prefer TMDb data, but add Wikidata-only movies
  const tmdbTitles = new Set(tmdbMovies.map(m => m.title.toLowerCase()));
  const wikidataOnly = wikidataMovies.filter(
    wm => !tmdbTitles.has(wm.title.toLowerCase())
  );
  
  console.log(`Adding ${wikidataOnly.length} Wikidata-only movies`);
  
  return [...tmdbMovies, ...wikidataOnly];
}
