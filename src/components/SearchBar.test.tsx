import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SearchBar } from './SearchBar';

// Mock useDebounce hook
jest.mock('../hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value || ''),
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

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and subtitle', () => {
    render(
      <MockThemeProvider>
        <SearchBar onSearch={mockOnSearch} />
      </MockThemeProvider>
    );

    expect(screen.getByText('MovieSearch')).toBeInTheDocument();
    expect(screen.getByText('Discover your next cinematic obsession')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(
      <MockThemeProvider>
        <SearchBar onSearch={mockOnSearch} />
      </MockThemeProvider>
    );

    expect(screen.getByLabelText(/search movies or series/i)).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(
      <MockThemeProvider>
        <SearchBar onSearch={mockOnSearch} />
      </MockThemeProvider>
    );

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
}); 