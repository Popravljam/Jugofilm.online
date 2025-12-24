import { Movie, MoviesResponse, MovieCredits } from '@/types/tmdb';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_LANGUAGE = process.env.TMDB_LANGUAGE || 'sr-RS';
const TMDB_IMAGE_LANGS = process.env.TMDB_IMAGE_LANGS || 'sr,hr,bs,sl,mk,sq,en,null';

function getHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('TMDB_ACCESS_TOKEN is not defined in environment variables. Make sure .env.local exists.');
  }
  
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getMoviesByCountry(countryCode: string, page: number = 1): Promise<MoviesResponse> {
  const url = `${TMDB_API_BASE}/discover/movie?with_origin_country=${countryCode}&sort_by=popularity.desc&page=${page}&language=${encodeURIComponent(TMDB_LANGUAGE)}&include_image_language=${encodeURIComponent(TMDB_IMAGE_LANGS)}`;
  
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.status}`);
  }

  return response.json();
}

export async function getMoviesByCountryLang(countryCode: string, page: number, language: string): Promise<MoviesResponse> {
  const url = `${TMDB_API_BASE}/discover/movie?with_origin_country=${countryCode}&sort_by=popularity.desc&page=${page}&language=${encodeURIComponent(language)}&include_image_language=${encodeURIComponent(TMDB_IMAGE_LANGS)}`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
  return response.json();
}

export async function getMovieCredits(movieId: number): Promise<MovieCredits> {
  const url = `${TMDB_API_BASE}/movie/${movieId}/credits`;
  
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.status}`);
  }

  return response.json();
}

export async function getMovieDetails(movieId: number): Promise<any> {
  const url = `${TMDB_API_BASE}/movie/${movieId}`;
  
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 }, // Cache for 24 hours
  });
  
  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getMovieVideos(movieId: number): Promise<any> {
  const url = `${TMDB_API_BASE}/movie/${movieId}/videos`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
  return response.json();
}

export async function searchActors(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  // This is a simplified version - in production you'd want to:
  // 1. Fetch and cache all actors from all movies
  // 2. Store in a database or search index
  // 3. Implement proper autocomplete

  return [];
}

async function getMoviesByCompany(companyId: number, page: number = 1): Promise<MoviesResponse> {
  const url = `${TMDB_API_BASE}/discover/movie?with_companies=${companyId}&sort_by=popularity.desc&page=${page}&language=${encodeURIComponent(TMDB_LANGUAGE)}&include_image_language=${encodeURIComponent(TMDB_IMAGE_LANGS)}`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
  return response.json();
}

async function searchMoviesByKeyword(keyword: string, page: number = 1): Promise<MoviesResponse> {
  const url = `${TMDB_API_BASE}/search/movie?query=${encodeURIComponent(keyword)}&page=${page}&language=${encodeURIComponent(TMDB_LANGUAGE)}&include_image_language=${encodeURIComponent(TMDB_IMAGE_LANGS)}`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
  return response.json();
}

async function getMoviesByPerson(personId: number, page: number = 1): Promise<any> {
  const url = `${TMDB_API_BASE}/person/${personId}/movie_credits?language=${encodeURIComponent(TMDB_LANGUAGE)}`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
  return response.json();
}

async function searchPerson(name: string): Promise<any> {
  const url = `${TMDB_API_BASE}/search/person?query=${encodeURIComponent(name)}&page=1`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
  return response.json();
}

export async function getAllExYuMovies(): Promise<Movie[]> {
  // Include historical entities: YU (Yugoslavia), CS (Serbia and Montenegro)
  const countries = ['RS', 'HR', 'BA', 'ME', 'MK', 'SI', 'XK', 'YU', 'CS'];
  const allMovies: Movie[] = [];
  const seenIds = new Set<number>();

  // Helper function to add movie if not seen
  const addMovie = (movie: any, titleLocal?: string, titleEn?: string) => {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      (movie as any).title_local = titleLocal || movie.title;
      (movie as any).title_en = titleEn || movie.title;
      allMovies.push(movie);
    }
  };

  // 1. Fetch by countries
  for (const country of countries) {
    console.log(`Fetching movies from ${country}...`);
    try {
      const firstPageLocal = await getMoviesByCountry(country, 1);
      const totalPages = Math.min(firstPageLocal.total_pages, 500);

      // Fetch first page in English too
      const firstPageEN = await getMoviesByCountryLang(country, 1, 'en-US');
      const enTitleById = new Map<number, string>(
        firstPageEN.results.map(m => [m.id, m.title])
      );

      // Add first page
      firstPageLocal.results.forEach(movie => {
        addMovie(movie, movie.title, enTitleById.get(movie.id));
      });

      // Fetch remaining pages
      for (let page = 2; page <= totalPages; page++) {
        try {
          const [pageLocal, pageEN] = await Promise.all([
            getMoviesByCountry(country, page),
            getMoviesByCountryLang(country, page, 'en-US'),
          ]);
          const enMap = new Map<number, string>(
            pageEN.results.map(m => [m.id, m.title])
          );
          pageLocal.results.forEach(movie => {
            addMovie(movie, movie.title, enMap.get(movie.id));
          });
          if (page % 10 === 0) {
            console.log(`  ${country}: Fetched ${page}/${totalPages} pages`);
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error fetching ${country} page ${page}:`, error);
        }
      }
      console.log(`${country}: ${allMovies.length} total movies so far`);
    } catch (error) {
      console.error(`Error fetching movies from ${country}:`, error);
    }
  }

  // 2. Fetch by key Yugoslav directors (to catch historical Yugoslavia films)
  const keyDirectors = [
    'Emir Kusturica', 'Dušan Makavejev', 'Živojin Pavlović', 'Aleksandar Petrović',
    'Slobodan Šijan', 'Goran Paskaljević', 'Srđan Dragojević', 'Goran Marković',
    'Želimir Žilnik', 'Lordan Zafranović', 'Rajko Grlić', 'Krsto Papić',
    'Ante Babaja', 'Vatroslav Mimica', 'Puriša Đorđević', 'Živko Nikolić',
    'Hajrudin Krvavac', 'Zdravko Velimirović', 'Soja Jovanović', 'Jovan Živanović',
    'Fadil Hadžić', 'Branko Bauer', 'France Štiglic', 'Boštjan Hladnik'
  ];

  console.log('\nFetching films by key Yugoslav directors...');
  for (const directorName of keyDirectors) {
    try {
      const personSearch = await searchPerson(directorName);
      if (personSearch.results && personSearch.results.length > 0) {
        const director = personSearch.results[0];
        const credits = await getMoviesByPerson(director.id);
        
        // Add directed films
        if (credits.crew) {
          const directedFilms = credits.crew.filter((c: any) => 
            c.job === 'Director' && c.media_type === 'movie'
          );
          directedFilms.forEach((movie: any) => {
            addMovie(movie);
          });
        }
        
        console.log(`  ${directorName}: Found ${credits.crew?.filter((c: any) => c.job === 'Director').length || 0} films`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`Error fetching films for ${directorName}:`, error);
    }
  }

  // 3. Search by comprehensive regional keywords, endonyms, exonyms, and ISO codes
  const keywords = [
    // Serbia and variants
    'Serbia', 'Republic of Serbia', 'Serbia and Montenegro', 'State Union of Serbia and Montenegro', 'Kingdom of Serbia',
    'Srbija', 'Republika Srbija', 'Srbija i Crna Gora', 'Državna zajednica Srbija i Crna Gora', 'Kraljevina Srbija',
    'Србија', 'Република Србија', 'Србија и Црна Гора', 'Државна заједница Србија и Црна Гора', 'Краљевина Србија',
    // Montenegro
    'Montenegro', 'Republic of Montenegro', 'Crna Gora', 'Republika Crna Gora', 'Црна Гора', 'Република Црна Гора',
    // Croatia
    'Croatia', 'Republic of Croatia', 'Hrvatska', 'Republika Hrvatska', 'Хрватска', 'Република Хрватска',
    // Bosnia and Herzegovina
    'Bosnia', 'Bosnia and Herzegovina', 'Republic of Bosnia and Herzegovina',
    'Bosna', 'Bosna i Hercegovina', 'Republika Bosna i Hercegovina',
    'Босна', 'Босна и Херцеговина', 'Република Босна и Херцеговина',
    // North Macedonia
    'Macedonia', 'North Macedonia', 'Republic of North Macedonia', 'Former Yugoslav Republic of Macedonia', 'FYROM',
    'Makedonija', 'Severna Makedonija', 'Republika Severna Makedonija',
    'Македонија', 'Северна Македонија', 'Република Северна Македонија',
    // Slovenia
    'Slovenia', 'Republic of Slovenia', 'Slovenija', 'Republika Slovenija', 'Словенија', 'Република Словенија',
    // Kosovo
    'Kosovo', 'Republic of Kosovo', 'Kosovo i Metohija', 'Kosmet', 'Kosovo i Metohija', 'Република Косово', 'Косово', 'Космет',
    // Yugoslavia and variants
    'Yugoslavia', 'Federal Republic of Yugoslavia', 'Socialist Federal Republic of Yugoslavia', 'Kingdom of Yugoslavia',
    'Jugoslavija', 'Savezna Republika Jugoslavija', 'Socijalistička Federativna Republika Jugoslavija', 'Kraljevina Jugoslavija',
    'Југославија', 'Савезна Република Југославија', 'Социјалистичка Федеративна Република Југославија', 'Краљевина Југославија',
    // Adjectives
    'Yugoslav', 'Yugoslavian', 'Yugoslavs', 'Jugoslovenski', 'Jugoslovenska', 'Jugoslovensko', 'Jugosloveni', 'Југословенски', 'Југословенска', 'Југословенско', 'Југословени',
    // Region
    'Balkan', 'Balkans', 'Balkan Peninsula', 'Balkansko poluostrvo', 'Балкан', 'Балканско полуострво',
    // ISO codes (alpha-2, alpha-3, numeric)
    'RS', 'SRB', '688', 'ME', 'MNE', '499', 'HR', 'HRV', '191', 'BA', 'BIH', '070', 'MK', 'MKD', '807', 'SI', 'SVN', '705', 'XK', 'XKX', 'YU', 'YUG', '890', 'CS', 'SCG', '891'
  ];
  console.log('\nSearching by regional keywords and codes...');

  for (const keyword of keywords) {
    try {
      const searchResults = await searchMoviesByKeyword(keyword, 1);
      const totalPages = Math.min(searchResults.total_pages || 1, 5); // Limit to 5 pages per keyword

      // Page 1
      (searchResults.results || []).forEach(movie => addMovie(movie));

      // Remaining pages with small delay to avoid rate-limits
      for (let page = 2; page <= totalPages; page++) {
        const pageResults = await searchMoviesByKeyword(keyword, page);
        (pageResults.results || []).forEach(movie => addMovie(movie));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`  "${keyword}": added ${searchResults.results?.length || 0} results (first page)`);
    } catch (error) {
      console.error(`Error searching keyword ${keyword}:`, error);
    }
  }

  console.log(`\nTotal unique movies from all sources: ${allMovies.length}`);
  return allMovies;
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-movie.png';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
