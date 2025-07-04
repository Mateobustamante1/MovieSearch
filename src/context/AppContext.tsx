import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, MovieSearchItem, MovieDetail, FilterType } from '../types';

/**
 * Application Context - Implements Context API for global state management
 * Follows Clean Architecture principles for state management
 */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MOVIES'; payload: { movies: MovieSearchItem[]; totalResults: number } }
  | { type: 'SET_SELECTED_MOVIE'; payload: MovieDetail | null }
  | { type: 'SET_SEARCH_FILTERS'; payload: Partial<{ query: string; type: FilterType; page: number }> }
  | { type: 'CLEAR_MOVIES' }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  movies: [],
  loading: false,
  error: null,
  selectedMovie: null,
  searchFilters: {
    query: '',
    type: 'all',
    page: 1,
  },
  totalResults: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Reducer - Manages application state transitions
 * Implements predictable state updates using reducer pattern
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'SET_MOVIES':
      return {
        ...state,
        movies: action.payload.movies,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };
    case 'SET_SELECTED_MOVIE':
      return {
        ...state,
        selectedMovie: action.payload,
      };
    case 'SET_SEARCH_FILTERS':
      return {
        ...state,
        searchFilters: {
          ...state.searchFilters,
          ...action.payload,
        },
      };
    case 'CLEAR_MOVIES':
      return {
        ...state,
        movies: [],
        totalResults: 0,
        error: null,
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 