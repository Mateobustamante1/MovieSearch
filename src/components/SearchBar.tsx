import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  InputAdornment,
  Fade,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { FilterType } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string, type: FilterType) => void;
  loading?: boolean;
  initialQuery?: string;
  initialType?: FilterType;
}

/**
 * SearchBar Component - Implements search functionality with debounced input
 * Features auto-search with 800ms debounce for better UX
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading = false,
  initialQuery = '',
  initialType = 'all',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<FilterType>(initialType);
  const [isTyping, setIsTyping] = useState(false);

  // Debounce with 800ms delay for auto-search
  const debouncedQuery = useDebounce(query, 800);

  // Auto-search effect when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setIsTyping(false);
      onSearch(debouncedQuery.trim(), type);
    }
  }, [debouncedQuery, type, onSearch]);

  // Effect to detect when user is typing
  useEffect(() => {
    if (query.trim().length >= 2 && query !== debouncedQuery) {
      setIsTyping(true);
    }
  }, [query, debouncedQuery]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setIsTyping(false);
        onSearch(query.trim(), type);
      }
    },
    [query, type, onSearch]
  );

  const handleTypeChange = useCallback(
    (newType: FilterType) => {
      setType(newType);
      if (query.trim().length >= 2) {
        onSearch(query.trim(), newType);
      }
    },
    [query, onSearch]
  );

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setIsTyping(false);
  }, []);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const isSearching = loading || isTyping;
  const showClearButton = query.length > 0;

  return (
    <Fade in timeout={600}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.9))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(187, 134, 252, 0.1)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #bb86fc, #03dac6, #bb86fc)',
            opacity: 0.6,
          }
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #bb86fc, #03dac6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            MovieSearch
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              opacity: 0.8,
            }}
          >
            Discover your next cinematic obsession
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Box
            display="flex"
            gap={2}
            alignItems="flex-start"
            flexDirection={{ xs: 'column', md: 'row' }}
            sx={{
              '& > *': {
                animation: 'slideInLeft 0.6s ease-out',
              }
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Search movies or series..."
              value={query}
              onChange={handleQueryChange}
              disabled={loading}
              placeholder="e.g., Avengers, Breaking Bad, Star Wars..."
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                  fontSize: '1.1rem',
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {isSearching ? (
                      <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                    ) : (
                      <SearchIcon sx={{ color: 'primary.main' }} />
                    )}
                  </InputAdornment>
                ),
                endAdornment: showClearButton && (
                  <InputAdornment position="end">
                    <ClearIcon
                      sx={{ 
                        cursor: 'pointer', 
                        color: 'text.secondary',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'scale(1.1)',
                        }
                      }}
                      onClick={handleClearSearch}
                    />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ minWidth: { xs: '100%', md: 160 } }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => handleTypeChange(e.target.value as FilterType)}
                disabled={loading}
                sx={{ 
                  height: '56px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="movie">Movies</MenuItem>
                <MenuItem value="series">Series</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !query.trim() || query.trim().length < 2}
              sx={{ 
                minWidth: { xs: '100%', md: 140 }, 
                height: 56,
                fontWeight: 700,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s ease',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </Box>

          {/* Minimum character indicator */}
          {query.trim().length > 0 && query.trim().length < 2 && (
            <Fade in timeout={300}>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 500 }}>
                  Minimum 2 characters required
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>
    </Fade>
  );
}; 