import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Chip,
  Rating,
  Divider,
} from '@mui/material';
import { ArrowBack, Star } from '@mui/icons-material';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { useMovies } from '../hooks/useMovies';
import { movieService } from '../domain/movieService';

/**
 * DetailPage Component - Displays detailed information about a movie or series
 * Fetches and displays comprehensive movie data from OMDB API
 */
export const DetailPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const navigate = useNavigate();
  const {
    selectedMovie,
    loading,
    error,
    getMovieDetail,
    clearSelectedMovie,
  } = useMovies();

  useEffect(() => {
    if (imdbID) {
      getMovieDetail(imdbID);
    }
    return () => {
      clearSelectedMovie();
    };
  }, [imdbID, getMovieDetail, clearSelectedMovie]);

  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleRetry = useCallback(() => {
    if (imdbID) {
      getMovieDetail(imdbID);
    }
  }, [imdbID, getMovieDetail]);

  const getDefaultPoster = () => {
    return 'https://via.placeholder.com/400x600/cccccc/666666?text=No+Image';
  };

  const getRatingValue = (rating: string) => {
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? 0 : numRating / 2; // Convert to 5-star scale
  };

  // Show loading spinner while fetching data OR when we have imdbID but no movie data yet
  const isLoading = loading || (imdbID && !selectedMovie && !error);
  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to search
        </Button>
        <Loader message="Loading movie details..." />
      </Container>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to search
        </Button>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </Container>
    );
  }

  // Show "not found" only when not loading and no movie data
  if (!isLoading && !selectedMovie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to search
        </Button>
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
            Movie not found
          </Typography>
          <Typography variant="h6" color="text.secondary">
            The requested movie details could not be found
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show movie details
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back to search
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={selectedMovie!.Poster !== 'N/A' ? selectedMovie!.Poster : getDefaultPoster()}
              alt={selectedMovie!.Title}
              sx={{ height: 600, objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultPoster();
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {selectedMovie!.Title}
            </Typography>

            <Box display="flex" gap={1} mb={2}>
              <Chip
                label={movieService.formatMovieType(selectedMovie!.Type)}
                color={selectedMovie!.Type === 'movie' ? 'primary' : 'secondary'}
              />
              <Chip label={selectedMovie!.Year} variant="outlined" />
              <Chip label={selectedMovie!.Rated} variant="outlined" />
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Star color="primary" />
              <Typography variant="h6">
                {movieService.formatRating(selectedMovie!.imdbRating)}
              </Typography>
              <Rating
                value={getRatingValue(selectedMovie!.imdbRating)}
                precision={0.1}
                readOnly
                size="small"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {selectedMovie!.Plot}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Director
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedMovie!.Director}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Runtime
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {movieService.formatRuntime(selectedMovie!.Runtime)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Genre
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedMovie!.Genre}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Actors
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedMovie!.Actors}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Release Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedMovie!.Released}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Country
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedMovie!.Country}
                </Typography>
              </Grid>

              {selectedMovie!.Awards && selectedMovie!.Awards !== 'N/A' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Awards
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedMovie!.Awards}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}; 