import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange,
  disabled = false,
}) => {
  const totalPages = Math.min(Math.ceil(totalResults / resultsPerPage), 3); // Máximo 3 páginas
  
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        mt: 4,
        mb: 2,
        flexWrap: 'wrap',
      }}
    >
      {/* Botón Primera Página */}
      <IconButton
        onClick={() => onPageChange(1)}
        disabled={disabled || currentPage === 1}
        sx={{
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(187, 134, 252, 0.1)',
          },
          '&:disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <FirstPage />
      </IconButton>

      {/* Botón Página Anterior */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        sx={{
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(187, 134, 252, 0.1)',
          },
          '&:disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Números de página */}
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <Typography
                sx={{
                  color: 'text.secondary',
                  px: 1,
                  fontSize: '0.875rem',
                }}
              >
                ...
              </Typography>
            ) : (
              <Button
                variant={currentPage === page ? 'contained' : 'outlined'}
                onClick={() => onPageChange(page as number)}
                disabled={disabled}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  ...(currentPage === page
                    ? {
                        background: 'linear-gradient(135deg, #bb86fc, #985eff)',
                        color: 'white',
                        border: '1px solid #bb86fc',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #985eff, #7c4dff)',
                        },
                      }
                    : {
                        color: 'primary.main',
                        borderColor: 'rgba(187, 134, 252, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(187, 134, 252, 0.1)',
                          borderColor: 'primary.main',
                        },
                      }),
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.3)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* Botón Página Siguiente */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        sx={{
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(187, 134, 252, 0.1)',
          },
          '&:disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* Botón Última Página */}
      <IconButton
        onClick={() => onPageChange(totalPages)}
        disabled={disabled || currentPage === totalPages}
        sx={{
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(187, 134, 252, 0.1)',
          },
          '&:disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <LastPage />
      </IconButton>

      {/* Información de página */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          ml: 2,
          fontSize: '0.875rem',
        }}
      >
        Página {currentPage} de {totalPages}
      </Typography>
    </Box>
  );
}; 