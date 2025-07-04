import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock React Router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactElement }) => element,
}));

describe('App Component', () => {
  test('renders the main MovieSearch title', () => {
    render(<App />);
    const titleElement = screen.getByText(/MovieSearch/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the subtitle', () => {
    render(<App />);
    const subtitleElement = screen.getByText(/Discover your next cinematic obsession/i);
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders search input field', () => {
    render(<App />);
    const searchInput = screen.getByLabelText(/Search movies or series/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders type filter dropdown', () => {
    render(<App />);
    const typeFilter = screen.getByText(/Type/i);
    expect(typeFilter).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<App />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  test('renders initial welcome message', () => {
    render(<App />);
    const welcomeMessage = screen.getByText(/Start your search!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('has proper application structure', () => {
    render(<App />);
    
    // Should have main container
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    
    // Should have dropdown
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    
    // Should have form
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });
});
