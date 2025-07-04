import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ErrorMessage } from './ErrorMessage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#bb86fc' },
    secondary: { main: '#03dac6' },
    error: { main: '#f44336' },
  },
});

const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('ErrorMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message correctly', () => {
    render(
      <MockThemeProvider>
        <ErrorMessage message="Something went wrong with the API" />
      </MockThemeProvider>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong with the API')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const mockOnRetry = jest.fn();
    
    render(
      <MockThemeProvider>
        <ErrorMessage message="Network error" onRetry={mockOnRetry} />
      </MockThemeProvider>
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(
      <MockThemeProvider>
        <ErrorMessage message="Network error" />
      </MockThemeProvider>
    );

    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn();
    
    render(
      <MockThemeProvider>
        <ErrorMessage message="Network error" onRetry={mockOnRetry} />
      </MockThemeProvider>
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders error icon', () => {
    render(
      <MockThemeProvider>
        <ErrorMessage message="Test error" />
      </MockThemeProvider>
    );

    // The error icon should be present (MUI icons are rendered as SVG)
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with different error messages', () => {
    const { rerender } = render(
      <MockThemeProvider>
        <ErrorMessage message="First error" />
      </MockThemeProvider>
    );

    expect(screen.getByText('First error')).toBeInTheDocument();

    rerender(
      <MockThemeProvider>
        <ErrorMessage message="Second error" />
      </MockThemeProvider>
    );

    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });
}); 