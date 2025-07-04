import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MovieList } from './MovieList';
import { MovieSearchItem } from '../types';

// Mock MovieCard component
jest.mock('./MovieCard', () => ({
  MovieCard: ({ movie, onClick, onImageError }: any) => (
    <div 
      data-testid={`movie-card-${movie.imdbID}`}
      onClick={() => onClick(movie.imdbID)}
    >
      <img 
        src={movie.Poster} 
        alt={movie.Title}
        onError={() => onImageError && onImageError(movie.imdbID)}
      />
      <div>{movie.Title}</div>
      <div>{movie.Year}</div>
    </div>
  ),
}));

// Mock Pagination component
jest.mock('./Pagination', () => ({
  Pagination: ({ currentPage, totalResults, onPageChange }: any) => (
    <div data-testid="pagination">
      <span>Page {currentPage}</span>
      <span>Total: {totalResults}</span>
      <button onClick={() => onPageChange(2)}>Next</button>
    </div>
  ),
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

describe('MovieList', () => {
  const mockMovies: MovieSearchItem[] = [
    {
      imdbID: 'tt0120737',
      Title: 'The Lord of the Rings: The Fellowship of the Ring',
      Year: '2001',
      Type: 'movie',
      Poster: 'https://example.com/poster1.jpg',
    },
    {
      imdbID: 'tt0944947',
      Title: 'Game of Thrones',
      Year: '2011',
      Type: 'series',
      Poster: 'https://example.com/poster2.jpg',
    },
  ];

  const mockOnMovieClick = jest.fn();
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows welcome message when no search query', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={[]}
          onMovieClick={mockOnMovieClick}
          totalResults={0}
          searchQuery=""
        />
      </MockThemeProvider>
    );

    expect(screen.getByText('Start your search!')).toBeInTheDocument();
    expect(screen.getByText('Discover amazing movies and series')).toBeInTheDocument();
  });

  it('shows loading state when searching', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={[]}
          onMovieClick={mockOnMovieClick}
          totalResults={0}
          searchQuery="Batman"
          loading={true}
        />
      </MockThemeProvider>
    );

    expect(screen.getByText('Searching movies and series...')).toBeInTheDocument();
    expect(screen.getByText('Preparing amazing results')).toBeInTheDocument();
  });

  it('renders movie cards when movies are provided', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={mockMovies}
          onMovieClick={mockOnMovieClick}
          totalResults={2}
          searchQuery="Lord"
        />
      </MockThemeProvider>
    );

    expect(screen.getByTestId('movie-card-tt0120737')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-tt0944947')).toBeInTheDocument();
    expect(screen.getByText('The Lord of the Rings: The Fellowship of the Ring')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
  });

  it('shows no results message when no movies found', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={[]}
          onMovieClick={mockOnMovieClick}
          totalResults={0}
          searchQuery="nonexistent movie"
          loading={false}
        />
      </MockThemeProvider>
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText(/No results found for/)).toBeInTheDocument();
    expect(screen.getByText(/Try different terms/)).toBeInTheDocument();
  });

  it('displays search results header with movie and series count', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={mockMovies}
          onMovieClick={mockOnMovieClick}
          totalResults={2}
          searchQuery="test"
        />
      </MockThemeProvider>
    );

    expect(screen.getByText(/Results for/)).toBeInTheDocument();
    expect(screen.getByText('1 movies')).toBeInTheDocument();
    expect(screen.getByText('1 series')).toBeInTheDocument();
  });

  it('calls onMovieClick when movie card is clicked', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={mockMovies}
          onMovieClick={mockOnMovieClick}
          totalResults={2}
          searchQuery="test"
        />
      </MockThemeProvider>
    );

    const movieCard = screen.getByTestId('movie-card-tt0120737');
    fireEvent.click(movieCard);

    expect(mockOnMovieClick).toHaveBeenCalledWith('tt0120737');
  });

  it('renders pagination when totalResults > 12', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={mockMovies}
          onMovieClick={mockOnMovieClick}
          totalResults={20}
          searchQuery="test"
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      </MockThemeProvider>
    );

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Total: 20')).toBeInTheDocument();
  });

  it('does not render pagination when totalResults <= 12', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={mockMovies}
          onMovieClick={mockOnMovieClick}
          totalResults={5}
          searchQuery="test"
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      </MockThemeProvider>
    );

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('filters out movies with invalid posters', () => {
    const moviesWithInvalidPoster: MovieSearchItem[] = [
      {
        imdbID: 'tt0001',
        Title: 'Valid Movie',
        Year: '2020',
        Type: 'movie',
        Poster: 'https://example.com/valid.jpg',
      },
      {
        imdbID: 'tt0002',
        Title: 'Invalid Movie',
        Year: '2020',
        Type: 'movie',
        Poster: 'N/A',
      },
    ];

    render(
      <MockThemeProvider>
        <MovieList
          movies={moviesWithInvalidPoster}
          onMovieClick={mockOnMovieClick}
          totalResults={2}
          searchQuery="test"
        />
      </MockThemeProvider>
    );

    expect(screen.getByTestId('movie-card-tt0001')).toBeInTheDocument();
    expect(screen.queryByTestId('movie-card-tt0002')).not.toBeInTheDocument();
  });

  it('shows results summary when total results exceed displayed results', () => {
    render(
      <MockThemeProvider>
        <MovieList
          movies={mockMovies}
          onMovieClick={mockOnMovieClick}
          totalResults={10}
          searchQuery="test"
        />
      </MockThemeProvider>
    );

    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText(/results/)).toBeInTheDocument();
  });
}); 