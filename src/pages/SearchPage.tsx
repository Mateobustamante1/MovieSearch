import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Fade } from '@mui/material';
import { SearchBar } from '../components/SearchBar';
import { MovieList } from '../components/MovieList';
import { ErrorMessage } from '../components/ErrorMessage';
import { useMovies } from '../hooks/useMovies';
import { FilterType } from '../types';

/**
 * SearchPage Component - Main page for movie and series search
 * Implements the search functionality and displays results
 */
export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    movies,
    loading,
    error,
    searchFilters,
    totalResults,
    searchMovies,
  } = useMovies();

  const handleSearch = useCallback(
    (query: string, type: FilterType) => {
      searchMovies(query, type, 1);
    },
    [searchMovies]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (searchFilters.query && searchFilters.query.length >= 2) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        searchMovies(searchFilters.query, searchFilters.type, page);
      }
    },
    [searchMovies, searchFilters.query, searchFilters.type]
  );

  const handleMovieClick = useCallback(
    (imdbID: string) => {
      navigate(`/movie/${imdbID}`);
    },
    [navigate]
  );

  const handleRetry = useCallback(() => {
    if (searchFilters.query && searchFilters.query.length >= 2) {
      searchMovies(searchFilters.query, searchFilters.type, searchFilters.page || 1);
    }
  }, [searchMovies, searchFilters]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(187, 134, 252, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(3, 218, 198, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Fade in timeout={400}>
          <Box>
            <SearchBar
              onSearch={handleSearch}
              loading={loading}
              initialQuery={searchFilters.query}
              initialType={searchFilters.type}
            />
          </Box>
        </Fade>

        <Box sx={{ flex: 1 }}>          
          {error && (
            <Fade in timeout={300}>
              <Box>
                <ErrorMessage message={error} onRetry={handleRetry} />
              </Box>
            </Fade>
          )}
          
          {!error && (
            <MovieList
              movies={movies}
              onMovieClick={handleMovieClick}
              totalResults={totalResults}
              searchQuery={searchFilters.query}
              currentPage={searchFilters.page || 1}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
}; 