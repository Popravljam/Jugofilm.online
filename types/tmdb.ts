export interface Movie {
  id: number;
  title: string; // localized to TMDB_LANGUAGE (sr-RS by default)
  original_title: string; // movie's original-language title
  title_en?: string; // English title (en-US)
  title_local?: string; // explicitly keep localized title
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
}

export interface Actor {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export interface CastMember extends Actor {
  character: string;
  order: number;
  cast_id: number;
}

export interface CrewMember {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  known_for_department: string;
  job: string;
  department?: string;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieWithCast extends Movie {
  cast?: CastMember[];
}
