// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock console.error to avoid React warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Custom Jest matchers for better assertions
expect.extend({
  toBeValidSearchQuery(received) {
    const pass = typeof received === 'string' && received.trim().length >= 2;
    if (pass) {
      return {
        message: () => `Expected ${received} not to be a valid search query`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be a valid search query (minimum 2 characters)`,
        pass: false,
      };
    }
  },
  
  toBeValidImdbId(received) {
    const pass = typeof received === 'string' && received.startsWith('tt');
    if (pass) {
      return {
        message: () => `Expected ${received} not to be a valid IMDB ID`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be a valid IMDB ID (should start with 'tt')`,
        pass: false,
      };
    }
  },
});

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidSearchQuery(): R;
      toBeValidImdbId(): R;
    }
  }
}
