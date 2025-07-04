import { renderHook, act } from '@testing-library/react';
import { useMovies } from './useMovies';
import { useAppContext } from '../context/AppContext';
import { movieService } from '../domain/movieService';

// Mock dependencies
jest.mock('../context/AppContext');
jest.mock('../domain/movieService');

const mockedUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;
const mockedMovieService = movieService as jest.Mocked<typeof movieService>;

describe('useMovies Hook', () => {
  const mockDispatch = jest.fn();
  const mockState = {
    movies: [],
    loading: false,
    error: null,
    selectedMovie: null,
    searchFilters: {
      query: '',
      type: 'all' as const,
      page: 1,
    },
    totalResults: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAppContext.mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });
  });

  describe('searchMovies', () => {
    it('should dispatch loading state and search results', async () => {
      const mockSearchResult = {
        movies: [
          {
            imdbID: 'tt0120737',
            Title: 'The Lord of the Rings',
            Year: '2001',
            Type: 'movie' as const,
            Poster: 'https://example.com/poster.jpg',
          },
        ],
        totalResults: 1,
      };

      mockedMovieService.searchMovies.mockResolvedValue(mockSearchResult);

      const { result } = renderHook(() => useMovies());

      await act(async () => {
        await result.current.searchMovies('Lord of the Rings', 'all', 1);
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_LOADING',
        payload: true,
      });

      expect(mockedMovieService.searchMovies).toHaveBeenCalledWith('Lord of the Rings', 'all', 1);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_SEARCH_FILTERS',
        payload: {
          query: 'Lord of the Rings',
          type: 'all',
          page: 1,
        },
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_MOVIES',
        payload: mockSearchResult,
      });
    });

    it('should handle search errors', async () => {
      const mockError = new Error('API Error');
      mockedMovieService.searchMovies.mockRejectedValue(mockError);

      const { result } = renderHook(() => useMovies());

      await act(async () => {
        await result.current.searchMovies('test', 'all', 1);
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_ERROR',
        payload: 'API Error',
      });
    });

    it('should handle pagination for multiple pages', async () => {
      const mockPage1 = {
        movies: Array.from({ length: 10 }, (_, i) => ({
          imdbID: `tt000${i}`,
          Title: `Movie ${i}`,
          Year: '2001',
          Type: 'movie' as const,
          Poster: 'https://example.com/poster.jpg',
        })),
        totalResults: 10,
      };

      const mockPage2 = {
        movies: Array.from({ length: 5 }, (_, i) => ({
          imdbID: `tt001${i}`,
          Title: `Movie ${i + 10}`,
          Year: '2001',
          Type: 'movie' as const,
          Poster: 'https://example.com/poster.jpg',
        })),
        totalResults: 5,
      };

      mockedMovieService.searchMovies
        .mockResolvedValueOnce(mockPage1)
        .mockResolvedValueOnce(mockPage2);

      const { result } = renderHook(() => useMovies());

      await act(async () => {
        await result.current.searchMovies('test', 'all', 2);
      });

      // Should call API twice for pages 3 and 4 (logical page 2)
      expect(mockedMovieService.searchMovies).toHaveBeenCalledTimes(2);
      expect(mockedMovieService.searchMovies).toHaveBeenNthCalledWith(1, 'test', 'all', 3);
      expect(mockedMovieService.searchMovies).toHaveBeenNthCalledWith(2, 'test', 'all', 4);
    });
  });

  describe('getMovieDetail', () => {
    it('should dispatch loading state and movie detail', async () => {
      const mockMovieDetail = {
        Response: 'True' as const,
        imdbID: 'tt0120737',
        Title: 'The Lord of the Rings',
        Year: '2001',
        Rated: 'PG-13',
        Released: '19 Dec 2001',
        Runtime: '178 min',
        Genre: 'Adventure, Drama, Fantasy',
        Director: 'Peter Jackson',
        Writer: 'J.R.R. Tolkien',
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
        Type: 'movie' as const,
        DVD: 'N/A',
        BoxOffice: 'N/A',
        Production: 'N/A',
        Website: 'N/A',
      };

      mockedMovieService.getMovieDetail.mockResolvedValue(mockMovieDetail);

      const { result } = renderHook(() => useMovies());

      await act(async () => {
        await result.current.getMovieDetail('tt0120737');
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_LOADING',
        payload: true,
      });

      expect(mockedMovieService.getMovieDetail).toHaveBeenCalledWith('tt0120737');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_SELECTED_MOVIE',
        payload: mockMovieDetail,
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_LOADING',
        payload: false,
      });
    });

    it('should handle movie detail errors', async () => {
      const mockError = new Error('Movie not found');
      mockedMovieService.getMovieDetail.mockRejectedValue(mockError);

      const { result } = renderHook(() => useMovies());

      await act(async () => {
        await result.current.getMovieDetail('invalid');
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_ERROR',
        payload: 'Movie not found',
      });
    });
  });

  describe('clearMovies', () => {
    it('should dispatch clear movies action', () => {
      const { result } = renderHook(() => useMovies());

      act(() => {
        result.current.clearMovies();
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CLEAR_MOVIES',
      });
    });
  });

  describe('clearSelectedMovie', () => {
    it('should dispatch clear selected movie action', () => {
      const { result } = renderHook(() => useMovies());

      act(() => {
        result.current.clearSelectedMovie();
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_SELECTED_MOVIE',
        payload: null,
      });
    });
  });

  describe('state access', () => {
    it('should return current state values', () => {
      const { result } = renderHook(() => useMovies());

      expect(result.current.movies).toEqual(mockState.movies);
      expect(result.current.loading).toEqual(mockState.loading);
      expect(result.current.error).toEqual(mockState.error);
      expect(result.current.selectedMovie).toEqual(mockState.selectedMovie);
      expect(result.current.searchFilters).toEqual(mockState.searchFilters);
      expect(result.current.totalResults).toEqual(mockState.totalResults);
    });
  });
}); 