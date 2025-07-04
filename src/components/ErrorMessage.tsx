import React from 'react';
import { Box, Button, Typography, Fade } from '@mui/material';
import { Refresh as RefreshIcon, Error as ErrorIcon } from '@mui/icons-material';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage Component - Displays error messages with retry functionality
 * Used throughout the app for error handling
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <Fade in timeout={400}>
      <Box 
        sx={{
          mx: 'auto',
          maxWidth: 600,
          mt: 4,
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(145deg, rgba(220, 38, 127, 0.1), rgba(244, 67, 54, 0.1))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #f44336, #dc004e, #f44336)',
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <ErrorIcon 
              sx={{ 
                fontSize: 48, 
                color: 'error.main',
                filter: 'drop-shadow(0 0 10px rgba(244, 67, 54, 0.5))',
              }} 
            />
          </Box>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Something went wrong
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>
          
          {onRetry && (
            <Button 
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{
                background: 'linear-gradient(135deg, #f44336, #dc004e)',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(244, 67, 54, 0.4)',
                }
              }}
            >
              Retry
            </Button>
          )}
        </Box>
      </Box>
    </Fade>
  );
}; 