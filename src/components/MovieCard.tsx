import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  CardActionArea,
  Fade,
} from '@mui/material';
import { MovieSearchItem } from '../types';
import { movieService } from '../domain/movieService';

interface MovieCardProps {
  movie: MovieSearchItem;
  onClick: (imdbID: string) => void;
  onImageError?: (imdbID: string) => void;
}

/**
 * MovieCard Component - Displays individual movie/series cards
 * Implements consistent styling and responsive design
 */
export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onImageError }) => {
  const handleClick = () => {
    onClick(movie.imdbID);
  };

  const getDefaultPoster = () => {
    const svgContent = `
      <svg width="300" height="450" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <circle cx="150" cy="180" r="40" fill="#bb86fc" opacity="0.3"/>
        <rect x="130" y="160" width="40" height="40" fill="#bb86fc" opacity="0.6"/>
        <text x="50%" y="60%" text-anchor="middle" fill="#bb86fc" font-size="16" font-family="Arial, sans-serif">No Image</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 300,
          height: 520, // Fixed height for consistency
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(42, 42, 42, 0.95))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(187, 134, 252, 0.15)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 16px 40px rgba(187, 134, 252, 0.25), 0 8px 32px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(187, 134, 252, 0.3)',
            '& .movie-poster': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
            },
            '& .movie-title': {
              color: 'primary.main',
            },
            '& .year-badge': {
              background: 'linear-gradient(135deg, #bb86fc, #03dac6)',
              transform: 'scale(1.05)',
            }
          },
        }}
      >
        <CardActionArea 
          onClick={handleClick} 
          sx={{ 
            width: '100%',
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            p: 0,
          }}
        >
          {/* Image Section - Fixed height */}
          <Box 
            sx={{ 
              position: 'relative', 
              overflow: 'hidden', 
              width: '100%',
              height: 350, // Fixed height for image section
              flexShrink: 0,
            }}
          >
            <CardMedia
              component="img"
              image={movie.Poster}
              alt={movie.Title}
              className="movie-poster"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'all 0.3s ease',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultPoster();
                if (onImageError) {
                  onImageError(movie.imdbID);
                }
              }}
            />
            
            {/* Year Badge */}
            <Box
              className="year-badge"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                px: 1.5,
                py: 0.8,
                borderRadius: 2,
                border: '1px solid rgba(187, 134, 252, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
                {movie.Year}
              </Typography>
            </Box>
          </Box>

          {/* Content Section - Fixed height */}
          <CardContent 
            sx={{ 
              width: '100%',
              height: 170, // Fixed height for content section
              p: 2.5,
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 1))',
            }}
          >
            {/* Title Section */}
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'flex-start',
              minHeight: 60, // Minimum space for title
              maxHeight: 90, // Maximum space for title
            }}>
              <Typography
                variant="h6"
                component="h2"
                className="movie-title"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  transition: 'all 0.3s ease',
                  color: 'text.primary',
                  fontSize: '1rem',
                  wordBreak: 'break-word',
                }}
              >
                {movie.Title}
              </Typography>
            </Box>
            
            {/* Type Chip Section - Fixed position */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-start',
              alignItems: 'center',
              height: 40, // Fixed height for chip area
              mt: 'auto',
            }}>
              <Chip
                label={movieService.formatMovieType(movie.Type)}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  ...(movie.Type === 'movie' ? {
                    background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.2), rgba(187, 134, 252, 0.3))',
                    color: 'primary.main',
                    border: '1px solid rgba(187, 134, 252, 0.3)',
                  } : {
                    background: 'linear-gradient(135deg, rgba(3, 218, 198, 0.2), rgba(3, 218, 198, 0.3))',
                    color: 'secondary.main',
                    border: '1px solid rgba(3, 218, 198, 0.3)',
                  }),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    ...(movie.Type === 'movie' ? {
                      background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.3), rgba(187, 134, 252, 0.4))',
                    } : {
                      background: 'linear-gradient(135deg, rgba(3, 218, 198, 0.3), rgba(3, 218, 198, 0.4))',
                    }),
                  }
                }}
              />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Fade>
  );
}; 