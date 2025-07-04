import { MovieService } from './movieService';
import { omdbApi } from '../services/omdbApi';
import { MovieSearchResponse, MovieDetail } from '../types';

// Mock the API service
jest.mock('../services/omdbApi');
const mockedOmdbApi = omdbApi as jest.Mocked<typeof omdbApi>;

describe('MovieService', () => {
  let movieService: MovieService;

  beforeEach(() => {
    movieService = new MovieService();
    jest.clearAllMocks();
  });

  describe('searchMovies', () => {
    it('should return empty results for empty query', async () => {
      const result = await movieService.searchMovies('');
      expect(result).toEqual({ movies: [], totalResults: 0 });
    });

    it('should return empty results for whitespace query', async () => {
      const result = await movieService.searchMovies('   ');
      expect(result).toEqual({ movies: [], totalResults: 0 });
    });

    it('should return movies when API responds successfully', async () => {
      const mockResponse: MovieSearchResponse = {
        Response: 'True',
        Search: [
          {
            imdbID: 'tt0120737',
            Title: 'The Lord of the Rings',
            Year: '2001',
            Type: 'movie',
            Poster: 'https://example.com/poster.jpg'
          }
        ],
        totalResults: '1'
      };

      mockedOmdbApi.searchMovies.mockResolvedValue(mockResponse);

      const result = await movieService.searchMovies('Lord of the Rings');

      expect(result).toEqual({
        movies: mockResponse.Search,
        totalResults: 1
      });
      expect(mockedOmdbApi.searchMovies).toHaveBeenCalledWith('Lord of the Rings', 'all', 1);
    });

    it('should throw specific error for "Too many results"', async () => {
      const mockResponse: MovieSearchResponse = {
        Response: 'False',
        Error: 'Too many results.',
        Search: [],
        totalResults: '0'
      };

      mockedOmdbApi.searchMovies.mockResolvedValue(mockResponse);

      await expect(movieService.searchMovies('a')).rejects.toThrow(
        'Too many results for "a". Try to be more specific in your search'
      );
    });

    it('should throw specific error for "Movie not found"', async () => {
      const mockResponse: MovieSearchResponse = {
        Response: 'False',
        Error: 'Movie not found!',
        Search: [],
        totalResults: '0'
      };

      mockedOmdbApi.searchMovies.mockResolvedValue(mockResponse);

      await expect(movieService.searchMovies('nonexistent')).rejects.toThrow(
        'No results found for "nonexistent". Check the spelling or try different search terms.'
      );
    });

    it('should handle pagination parameters correctly', async () => {
      const mockResponse: MovieSearchResponse = {
        Response: 'True',
        Search: [],
        totalResults: '0'
      };

      mockedOmdbApi.searchMovies.mockResolvedValue(mockResponse);

      await movieService.searchMovies('test', 'movie', 2);

      expect(mockedOmdbApi.searchMovies).toHaveBeenCalledWith('test', 'movie', 2);
    });
  });

  describe('getMovieDetail', () => {
    it('should return movie details when API responds successfully', async () => {
      const mockResponse: MovieDetail = {
        Response: 'True',
        imdbID: 'tt0120737',
        Title: 'The Lord of the Rings',
        Year: '2001',
        Rated: 'PG-13',
        Released: '19 Dec 2001',
        Runtime: '178 min',
        Genre: 'Adventure, Drama, Fantasy',
        Director: 'Peter Jackson',
        Writer: 'J.R.R. Tolkien, Fran Walsh',
        Actors: 'Elijah Wood, Ian McKellen',
        Plot: 'A meek Hobbit from the Shire...',
        Language: 'English',
        Country: 'New Zealand, USA',
        Awards: 'Won 4 Oscars',
        Poster: 'https://example.com/poster.jpg',
        Ratings: [],
        Metascore: '92',
        imdbRating: '8.8',
        imdbVotes: '1,000,000',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: 'N/A',
        Production: 'N/A',
        Website: 'N/A'
      };

      mockedOmdbApi.getMovieDetail.mockResolvedValue(mockResponse);

      const result = await movieService.getMovieDetail('tt0120737');

      expect(result).toEqual(mockResponse);
      expect(mockedOmdbApi.getMovieDetail).toHaveBeenCalledWith('tt0120737');
    });

    it('should throw error when movie not found', async () => {
      const mockResponse: MovieDetail = {
        Response: 'False',
        Error: 'Incorrect IMDb ID.',
        imdbID: '',
        Title: '',
        Year: '',
        Rated: '',
        Released: '',
        Runtime: '',
        Genre: '',
        Director: '',
        Writer: '',
        Actors: '',
        Plot: '',
        Language: '',
        Country: '',
        Awards: '',
        Poster: '',
        Ratings: [],
        Metascore: '',
        imdbRating: '',
        imdbVotes: '',
        Type: 'movie',
        DVD: '',
        BoxOffice: '',
        Production: '',
        Website: ''
      };

      mockedOmdbApi.getMovieDetail.mockResolvedValue(mockResponse);

      await expect(movieService.getMovieDetail('invalid')).rejects.toThrow(
        'This movie or series is no longer available in the database'
      );
    });
  });

  describe('validateSearchQuery', () => {
    it('should return false for empty string', () => {
      expect(movieService.validateSearchQuery('')).toBe(false);
    });

    it('should return false for single character', () => {
      expect(movieService.validateSearchQuery('a')).toBe(false);
    });

    it('should return false for whitespace only', () => {
      expect(movieService.validateSearchQuery('  ')).toBe(false);
    });

    it('should return true for 2 or more characters', () => {
      expect(movieService.validateSearchQuery('ab')).toBe(true);
      expect(movieService.validateSearchQuery('test')).toBe(true);
    });
  });

  describe('formatMovieType', () => {
    it('should format movie type correctly', () => {
      expect(movieService.formatMovieType('movie')).toBe('Movie');
      expect(movieService.formatMovieType('series')).toBe('Series');
      expect(movieService.formatMovieType('episode')).toBe('Episode');
    });

    it('should return original value for unknown types', () => {
      expect(movieService.formatMovieType('unknown')).toBe('unknown');
    });
  });

  describe('formatRuntime', () => {
    it('should return "Not available" for N/A or empty values', () => {
      expect(movieService.formatRuntime('N/A')).toBe('Not available');
      expect(movieService.formatRuntime('')).toBe('Not available');
      expect(movieService.formatRuntime(undefined as any)).toBe('Not available');
    });

    it('should return original value for valid runtime', () => {
      expect(movieService.formatRuntime('120 min')).toBe('120 min');
    });
  });

  describe('formatRating', () => {
    it('should return "Not available" for N/A or empty values', () => {
      expect(movieService.formatRating('N/A')).toBe('Not available');
      expect(movieService.formatRating('')).toBe('Not available');
      expect(movieService.formatRating(undefined as any)).toBe('Not available');
    });

    it('should return original value for valid rating', () => {
      expect(movieService.formatRating('8.5')).toBe('8.5');
    });
  });
}); 