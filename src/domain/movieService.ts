import { omdbApi } from '../services/omdbApi';
import { MovieSearchItem, MovieDetail, FilterType } from '../types';

/**
 * Movie Service - Domain layer for movie operations
 * Implements business logic and data transformation
 */
export class MovieService {
  async searchMovies(
    query: string,
    type: FilterType = 'all',
    page: number = 1
  ): Promise<{ movies: MovieSearchItem[]; totalResults: number }> {
    if (!query.trim()) {
      return { movies: [], totalResults: 0 };
    }

    const response = await omdbApi.searchMovies(query, type, page);
    
    if (response.Response === 'False') {
      const errorMessage = response.Error || 'No results found';
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('too many results')) {
        throw new Error(
          `Too many results for "${query}". ` +
          'Try to be more specific in your search (e.g., add year, director, etc.) ' +
          'or navigate through pages to explore all results.'
        );
      }
      
      if (errorMessage.toLowerCase().includes('movie not found') || 
          errorMessage.toLowerCase().includes('not found')) {
        throw new Error(
          `No results found for "${query}". ` +
          'Check the spelling or try different search terms.'
        );
      }
      
      throw new Error(errorMessage);
    }

    return {
      movies: response.Search || [],
      totalResults: parseInt(response.totalResults || '0', 10),
    };
  }

  async getMovieDetail(imdbID: string): Promise<MovieDetail> {
    const response = await omdbApi.getMovieDetail(imdbID);
    
    if (response.Response === 'False') {
      const errorMessage = response.Error || 'Movie details not found';
      
      if (errorMessage.toLowerCase().includes('not found')) {
        throw new Error(
          'This movie or series is no longer available in the database. ' +
          'Try searching for a different version or check the title.'
        );
      }
      
      throw new Error(errorMessage);
    }

    return response;
  }

  validateSearchQuery(query: string): boolean {
    return query.trim().length >= 2;
  }

  formatMovieType(type: string): string {
    switch (type) {
      case 'movie':
        return 'Movie';
      case 'series':
        return 'Series';
      case 'episode':
        return 'Episode';
      default:
        return type;
    }
  }

  formatRuntime(runtime: string): string {
    if (!runtime || runtime === 'N/A') {
      return 'Not available';
    }
    return runtime;
  }

  formatRating(rating: string): string {
    if (!rating || rating === 'N/A') {
      return 'Not available';
    }
    return rating;
  }
}

export const movieService = new MovieService(); 