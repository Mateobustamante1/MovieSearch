import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MovieCard } from './MovieCard';
import { MovieSearchItem } from '../types';

// Mock movieService
jest.mock('../domain/movieService', () => ({
  movieService: {
    formatMovieType: jest.fn((type) => {
      switch (type) {
        case 'movie':
          return 'Movie';
        case 'series':
          return 'Series';
        default:
          return type;
      }
    }),
  },
}));

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#bb86fc' },
    secondary: { main: '#03dac6' },
  },
});

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('MovieCard', () => {
  const mockMovie: MovieSearchItem = {
    imdbID: 'tt0120737',
    Title: 'The Lord of the Rings: The Fellowship of the Ring',
    Year: '2001',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
  };

  const mockOnClick = jest.fn();
  const mockOnImageError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders movie information correctly', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    expect(screen.getByText('The Lord of the Rings: The Fellowship of the Ring')).toBeInTheDocument();
    expect(screen.getByText('2001')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'The Lord of the Rings: The Fellowship of the Ring');
  });

  it('handles click events', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith('tt0120737');
  });

  it('handles image error events', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(mockOnImageError).toHaveBeenCalledWith('tt0120737');
  });

  it('renders series type correctly', () => {
    const seriesMovie: MovieSearchItem = {
      ...mockMovie,
      Type: 'series',
    };

    render(
      <MockThemeProvider>
        <MovieCard movie={seriesMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    // Verify that the formatMovieType function was called with 'series'
    const { movieService } = require('../domain/movieService');
    expect(movieService.formatMovieType).toHaveBeenCalledWith('series');
  });

  it('truncates long titles properly', () => {
    const longTitleMovie: MovieSearchItem = {
      ...mockMovie,
      Title: 'This is a very long movie title that should be truncated properly when it exceeds the maximum length allowed for display',
    };

    render(
      <MockThemeProvider>
        <MovieCard movie={longTitleMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const titleElement = screen.getByText(/This is a very long movie title/);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle('overflow: hidden');
  });

  it('renders with N/A poster gracefully', () => {
    const noPosterMovie: MovieSearchItem = {
      ...mockMovie,
      Poster: 'N/A',
    };

    render(
      <MockThemeProvider>
        <MovieCard movie={noPosterMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'N/A');
  });

  it('applies correct styling', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const card = screen.getByRole('button');
    expect(card).toHaveStyle('cursor: pointer');
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('movie-poster');
  });

  it('renders without onImageError callback', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} />
      </MockThemeProvider>
    );

    expect(screen.getByText('The Lord of the Rings: The Fellowship of the Ring')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const card = screen.getByRole('button');
    
    // Should be focusable
    act(() => {
      card.focus();
    });
    expect(card).toHaveFocus();
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('handles image loading and error states', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    const image = screen.getByRole('img');
    
    // Test initial image source
    expect(image).toHaveAttribute('src', 'https://example.com/poster.jpg');
    
    // Test image error handling
    fireEvent.error(image);
    expect(mockOnImageError).toHaveBeenCalledWith('tt0120737');
  });

  it('calls formatMovieType with correct parameter', () => {
    const { movieService } = require('../domain/movieService');
    
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    expect(movieService.formatMovieType).toHaveBeenCalledWith('movie');
  });

  it('renders with correct component structure', () => {
    render(
      <MockThemeProvider>
        <MovieCard movie={mockMovie} onClick={mockOnClick} onImageError={mockOnImageError} />
      </MockThemeProvider>
    );

    // Should have a card with button
    expect(screen.getByRole('button')).toBeInTheDocument();
    
    // Should have an image
    expect(screen.getByRole('img')).toBeInTheDocument();
    
    // Should have title text
    expect(screen.getByText('The Lord of the Rings: The Fellowship of the Ring')).toBeInTheDocument();
    
    // Should have year text
    expect(screen.getByText('2001')).toBeInTheDocument();
  });
}); 