import axios, { AxiosError } from 'axios';
import { MovieSearchResponse, MovieDetail, FilterType } from '../types';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY || 'trilogy';
const BASE_URL = 'http://www.omdbapi.com/';
const REQUEST_TIMEOUT = 8000;
const MAX_RETRIES = 2;

/**
 * OMDB API Service - Implements Singleton pattern for API communication
 * Handles caching and error management for movie data retrieval
 */
export class OMDBApiService {
  private static instance: OMDBApiService;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): OMDBApiService {
    if (!OMDBApiService.instance) {
      OMDBApiService.instance = new OMDBApiService();
    }
    return OMDBApiService.instance;
  }

  private getCacheKey(params: Record<string, any>): string {
    return Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  private async makeRequest<T>(url: string, params: Record<string, any>, retries = 0): Promise<T> {
    try {
      const response = await axios.get<T>(url, {
        params,
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Retry logic for network errors and server errors
      const responseStatus = axiosError.response?.status;
      if (retries < MAX_RETRIES && (
        axiosError.code === 'ECONNABORTED' || 
        responseStatus === undefined ||
        (responseStatus && responseStatus >= 500)
      )) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        return this.makeRequest(url, params, retries + 1);
      }

      // Handle different error types
      if (axiosError.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please verify your connection and try again.');
      }

      if (responseStatus === 401) {
        throw new Error('Authentication error with the API. Please check your configuration.');
      }

      if (responseStatus && responseStatus >= 500) {
        throw new Error('Server is experiencing issues. Please try again in a few moments.');
      }

      throw new Error('Connection error. Please check your internet and try again.');
    }
  }

  async searchMovies(
    query: string,
    type: FilterType = 'all',
    page: number = 1
  ): Promise<MovieSearchResponse> {
    const cacheKey = this.getCacheKey({ s: query, type, page });
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const params: Record<string, any> = {
      apikey: API_KEY,
      s: query,
      page,
    };

    if (type !== 'all') {
      params.type = type;
    }

    try {
      const response = await this.makeRequest<MovieSearchResponse>(BASE_URL, params);
      
      if (response.Response === 'True') {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getMovieDetail(imdbID: string): Promise<MovieDetail> {
    const cacheKey = this.getCacheKey({ i: imdbID });
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.makeRequest<MovieDetail>(BASE_URL, {
        apikey: API_KEY,
        i: imdbID,
      });

      if (response.Response === 'True') {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const omdbApi = OMDBApiService.getInstance(); 