import { useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { movieService } from '../domain/movieService';
import { FilterType } from '../types';

/**
 * Custom hook for movie operations
 * Implements Clean Architecture pattern for movie search and detail fetching
 */
export const useMovies = () => {
  const { state, dispatch } = useAppContext();
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSearchRef = useRef<string>('');

  const searchMovies = useCallback(
    async (query: string, type: FilterType = 'all', page: number = 1) => {
      if (!movieService.validateSearchQuery(query)) {
        dispatch({ type: 'SET_ERROR', payload: 'Please enter at least 2 characters to search' });
        return;
      }

      // Prevent duplicate searches
      const searchKey = `${query}-${type}-${page}`;
      if (lastSearchRef.current === searchKey) {
        return;
      }

      // Cancel previous search if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for proper cleanup
      abortControllerRef.current = new AbortController();
      lastSearchRef.current = searchKey;

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        // Challenge requirement: Limit pagination to 3 pages maximum
        const maxLogicalPages = 3;
        
        if (page > maxLogicalPages) {
          throw new Error(`Search limited to ${maxLogicalPages} pages. Try a more specific search.`);
        }

        // Load multiple API pages to ensure consistent 12 items per logical page
        const allMovies = [];
        let currentApiPage = (page - 1) * 2 + 1;
        let attempts = 0;
        const maxAttempts = 5;
        let originalTotal = 0;

        while (allMovies.length < 12 && attempts < maxAttempts) {
          try {
            const result = await movieService.searchMovies(query, type, currentApiPage);
            
            if (result.movies.length === 0) {
              break;
            }
            
            allMovies.push(...result.movies);
            currentApiPage++;
            attempts++;
            
            if (attempts === 1) {
              originalTotal = result.totalResults;
            }
            
          } catch (error) {
            break;
          }
        }

        // Take exactly 12 elements per page
        const moviesForPage = allMovies.slice(0, 12);
        
        // Check if search wasn't cancelled
        if (!abortControllerRef.current?.signal.aborted) {
          // Fixed limit to 3 pages = 36 results maximum
          const maxResults = 36;
          const adjustedTotalResults = Math.min(originalTotal, maxResults);

          dispatch({ 
            type: 'SET_MOVIES', 
            payload: { 
              movies: moviesForPage, 
              totalResults: adjustedTotalResults 
            } 
          });
          dispatch({ 
            type: 'SET_SEARCH_FILTERS', 
            payload: { query, type, page } 
          });
        }
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    },
    [dispatch]
  );

  const getMovieDetail = useCallback(
    async (imdbID: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const movieDetail = await movieService.getMovieDetail(imdbID);
        dispatch({ type: 'SET_SELECTED_MOVIE', payload: movieDetail });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Unknown error' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [dispatch]
  );

  const clearMovies = useCallback(() => {
    // Cancel ongoing search if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    lastSearchRef.current = '';
    dispatch({ type: 'CLEAR_MOVIES' });
  }, [dispatch]);

  const clearSelectedMovie = useCallback(() => {
    dispatch({ type: 'SET_SELECTED_MOVIE', payload: null });
  }, [dispatch]);

  const setSearchFilters = useCallback(
    (filters: Partial<{ query: string; type: FilterType; page: number }>) => {
      dispatch({ type: 'SET_SEARCH_FILTERS', payload: filters });
    },
    [dispatch]
  );

  return {
    // State
    movies: state.movies,
    loading: state.loading,
    error: state.error,
    selectedMovie: state.selectedMovie,
    searchFilters: state.searchFilters,
    totalResults: state.totalResults,
    
    // Actions
    searchMovies,
    getMovieDetail,
    clearMovies,
    clearSelectedMovie,
    setSearchFilters,
  };
}; 