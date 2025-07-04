import React, { useState, useCallback } from 'react';
import { Typography, Box, Fade, Chip, Grow, CircularProgress } from '@mui/material';
import { MovieCard } from './MovieCard';
import { MovieSearchItem } from '../types';
import { Pagination } from './Pagination';

interface MovieListProps {
  movies: MovieSearchItem[];
  onMovieClick: (imdbID: string) => void;
  totalResults: number;
  searchQuery?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

/**
 * Validates if a movie has a valid image URL
 * Part of the content filtering system for better UX
 */
const hasValidImage = (movie: MovieSearchItem): boolean => {
  if (!movie.Poster || typeof movie.Poster !== 'string') return false;
  
  const poster = movie.Poster.trim();
  
  const invalidValues = ['N/A', '', 'null', 'undefined'];
  if (invalidValues.includes(poster)) {
    return false;
  }
  
  if (!poster.startsWith('http://') && !poster.startsWith('https://')) {
    return false;
  }
  
  try {
    new URL(poster);
    return true;
  } catch {
    return false;
  }
};

/**
 * MovieList Component - Displays movie search results with responsive grid
 * Implements dynamic image filtering and pagination
 */
export const MovieList: React.FC<MovieListProps> = ({
  movies,
  onMovieClick,
  totalResults,
  searchQuery = '',
  currentPage = 1,
  onPageChange,
  loading = false,
}) => {
  // Track failed image loads for dynamic filtering
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((imdbID: string) => {
    setFailedImages(prev => new Set(Array.from(prev).concat(imdbID)));
  }, []);

  // Filter movies with valid images and no failed loads
  const moviesWithValidImages = movies
    .filter(hasValidImage)
    .filter(movie => !failedImages.has(movie.imdbID));

  // Clear failed images on new search
  React.useEffect(() => {
    setFailedImages(new Set());
  }, [movies]);

  // Show loading spinner when loading and there's a search query
  if (loading && searchQuery.length >= 2) {
    return (
      <Fade in timeout={300}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          gap={3}
          sx={{
            background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.6), rgba(42, 42, 42, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(187, 134, 252, 0.1)',
            borderRadius: 3,
            p: 4,
            mx: 'auto',
            maxWidth: 400,
          }}
        >
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
              filter: 'drop-shadow(0 0 10px rgba(187, 134, 252, 0.5))',
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Searching movies and series...
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              opacity: 0.8,
            }}
          >
            Preparing amazing results
          </Typography>
        </Box>
      </Fade>
    );
  }

  // Show no results message only when not loading and no movies found
  if (!loading && movies.length === 0 && searchQuery.length >= 2) {
    return (
      <Fade in timeout={500}>
        <Box 
          textAlign="center" 
          mt={6}
          sx={{
            background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.6), rgba(42, 42, 42, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(187, 134, 252, 0.1)',
            borderRadius: 3,
            p: 6,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #bb86fc, #03dac6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            No results found
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            No results found for <strong>"{searchQuery}"</strong>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Try different terms or check the spelling
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (!loading && moviesWithValidImages.length === 0 && movies.length > 0) {
    return (
      <Fade in timeout={500}>
        <Box 
          textAlign="center" 
          mt={6}
          sx={{
            background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.6), rgba(42, 42, 42, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(187, 134, 252, 0.1)',
            borderRadius: 3,
            p: 6,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #bb86fc, #03dac6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Results filtered
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Found <strong>{movies.length}</strong> results, but filtered for quality
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Only showing content with high-quality images. Try more specific terms.
          </Typography>
          {onPageChange && totalResults > 12 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.6, mt: 2 }}>
              Try navigating to other pages to see more results
            </Typography>
          )}
        </Box>
      </Fade>
    );
  }

  // Show welcome message when no search has been performed
  if (moviesWithValidImages.length === 0 && searchQuery.length < 2) {
    return (
      <Fade in timeout={500}>
        <Box 
          textAlign="center" 
          mt={8}
          sx={{
            background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.4), rgba(42, 42, 42, 0.4))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(187, 134, 252, 0.1)',
            borderRadius: 3,
            p: 6,
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #bb86fc, #03dac6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Start your search!
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Discover amazing movies and series
          </Typography>
        </Box>
      </Fade>
    );
  }

  // Show results
  const movieCount = moviesWithValidImages.filter(m => m.Type === 'movie').length;
  const seriesCount = moviesWithValidImages.filter(m => m.Type === 'series').length;

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Results header with statistics */}
        <Box 
          mb={4}
          sx={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.8))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(187, 134, 252, 0.1)',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Results for <span style={{ 
              background: 'linear-gradient(135deg, #bb86fc, #03dac6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
            }}>"{searchQuery}"</span>
          </Typography>
          
          <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
            {movieCount > 0 && (
              <Grow in timeout={500}>
                <Chip 
                  label={`${movieCount} movies`} 
                  sx={{
                    background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.2), rgba(187, 134, 252, 0.3))',
                    color: 'primary.main',
                    border: '1px solid rgba(187, 134, 252, 0.3)',
                    fontWeight: 600,
                  }}
                />
              </Grow>
            )}
            {seriesCount > 0 && (
              <Grow in timeout={600}>
                <Chip 
                  label={`${seriesCount} series`} 
                  sx={{
                    background: 'linear-gradient(135deg, rgba(3, 218, 198, 0.2), rgba(3, 218, 198, 0.3))',
                    color: 'secondary.main',
                    border: '1px solid rgba(3, 218, 198, 0.3)',
                    fontWeight: 600,
                  }}
                />
              </Grow>
            )}
          </Box>
        </Box>
        
        {/* Responsive grid layout - adapts to number of items */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: moviesWithValidImages.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              md: moviesWithValidImages.length <= 2 ? `repeat(${moviesWithValidImages.length}, 1fr)` : 'repeat(3, 1fr)',
              lg: moviesWithValidImages.length <= 3 ? `repeat(${moviesWithValidImages.length}, 1fr)` : 'repeat(4, 1fr)',
            },
            gap: 3,
            justifyItems: 'center',
            justifyContent: 'center',
            maxWidth: moviesWithValidImages.length <= 4 ? 'fit-content' : '100%',
            margin: '0 auto',
          }}
        >
          {moviesWithValidImages.map((movie, index) => (
            <Grow
              in
              timeout={400 + (index * 100)}
              key={movie.imdbID}
              style={{ transformOrigin: '0 0 0' }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  maxWidth: '300px',
                  height: 'fit-content'
                }}
              >
                <MovieCard 
                  movie={movie} 
                  onClick={onMovieClick}
                  onImageError={handleImageError}
                />
              </Box>
            </Grow>
          ))}
        </Box>

        {/* Pagination component */}
        {onPageChange && totalResults > 12 && (
          <Pagination
            currentPage={currentPage}
            totalResults={totalResults}
            resultsPerPage={12}
            onPageChange={onPageChange}
            disabled={loading}
          />
        )}

        {/* Results summary */}
        {totalResults > moviesWithValidImages.length && (
          <Fade in timeout={800}>
            <Box 
              mt={4} 
              textAlign="center"
              sx={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(187, 134, 252, 0.1)',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Showing <strong>{moviesWithValidImages.length}</strong> results
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Fade>
  );
}; 