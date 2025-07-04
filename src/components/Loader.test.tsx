import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Loader } from './Loader';

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

describe('Loader', () => {
  it('renders with default message', () => {
    render(
      <MockThemeProvider>
        <Loader />
      </MockThemeProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Please wait a moment')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(
      <MockThemeProvider>
        <Loader message="Searching movies..." />
      </MockThemeProvider>
    );

    expect(screen.getByText('Searching movies...')).toBeInTheDocument();
    expect(screen.getByText('Please wait a moment')).toBeInTheDocument();
  });

  it('renders circular progress indicator', () => {
    render(
      <MockThemeProvider>
        <Loader />
      </MockThemeProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with different custom messages', () => {
    const { rerender } = render(
      <MockThemeProvider>
        <Loader message="Loading movies..." />
      </MockThemeProvider>
    );

    expect(screen.getByText('Loading movies...')).toBeInTheDocument();

    rerender(
      <MockThemeProvider>
        <Loader message="Fetching details..." />
      </MockThemeProvider>
    );

    expect(screen.getByText('Fetching details...')).toBeInTheDocument();
    expect(screen.queryByText('Loading movies...')).not.toBeInTheDocument();
  });
}); 