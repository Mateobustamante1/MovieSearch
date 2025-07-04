// Tipos para la API de OMDB
export interface MovieSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface MovieSearchResponse {
  Search: MovieSearchItem[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export type FilterType = 'all' | 'movie' | 'series';

export interface SearchFilters {
  query: string;
  type: FilterType;
  page?: number;
}

export interface AppState {
  movies: MovieSearchItem[];
  loading: boolean;
  error: string | null;
  selectedMovie: MovieDetail | null;
  searchFilters: SearchFilters;
  totalResults: number;
} 