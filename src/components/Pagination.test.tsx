import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Pagination } from './Pagination';

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

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  const defaultProps = {
    currentPage: 1,
    totalResults: 30,
    resultsPerPage: 10,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination when there are multiple pages', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} />
      </MockThemeProvider>
    );

    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not render when there is only one page', () => {
    render(
      <MockThemeProvider>
        <Pagination 
          {...defaultProps} 
          totalResults={5} 
          resultsPerPage={10} 
        />
      </MockThemeProvider>
    );

    expect(screen.queryByText('Página')).not.toBeInTheDocument();
  });

  it('calls onPageChange when page number is clicked', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} />
      </MockThemeProvider>
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when next button is clicked', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} />
      </MockThemeProvider>
    );

    const nextButton = screen.getByTestId('ChevronRightIcon').closest('button');
    fireEvent.click(nextButton!);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={2} />
      </MockThemeProvider>
    );

    const prevButton = screen.getByTestId('ChevronLeftIcon').closest('button');
    fireEvent.click(prevButton!);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when first page button is clicked', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={3} />
      </MockThemeProvider>
    );

    const firstButton = screen.getByTestId('FirstPageIcon').closest('button');
    fireEvent.click(firstButton!);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when last page button is clicked', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={1} />
      </MockThemeProvider>
    );

    const lastButton = screen.getByTestId('LastPageIcon').closest('button');
    fireEvent.click(lastButton!);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables navigation buttons when on first page', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={1} />
      </MockThemeProvider>
    );

    const firstButton = screen.getByTestId('FirstPageIcon').closest('button');
    const prevButton = screen.getByTestId('ChevronLeftIcon').closest('button');

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  it('disables navigation buttons when on last page', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={3} />
      </MockThemeProvider>
    );

    const lastButton = screen.getByTestId('LastPageIcon').closest('button');
    const nextButton = screen.getByTestId('ChevronRightIcon').closest('button');

    expect(lastButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('disables all buttons when disabled prop is true', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} disabled={true} />
      </MockThemeProvider>
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('highlights current page button', () => {
    render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={2} />
      </MockThemeProvider>
    );

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton.closest('button')).toHaveClass('MuiButton-contained');
  });

  it('updates page information text correctly', () => {
    const { rerender } = render(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={1} />
      </MockThemeProvider>
    );

    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();

    rerender(
      <MockThemeProvider>
        <Pagination {...defaultProps} currentPage={2} />
      </MockThemeProvider>
    );

    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  });
}); 