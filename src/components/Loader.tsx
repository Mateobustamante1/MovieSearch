import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoaderProps {
  message?: string;
}

/**
 * Loader Component - Displays loading spinner with message
 * Used throughout the app for loading states
 */
export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <Fade in timeout={400}>
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
          {message}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          Please wait a moment
        </Typography>
      </Box>
    </Fade>
  );
}; 