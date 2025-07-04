import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';

/**
 * Material-UI Dark Theme Configuration
 * Challenge requirement: Modern UI with Material-UI components
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
      light: '#d7b4ff',
      dark: '#985eff',
    },
    secondary: {
      main: '#03dac6',
      light: '#66fff9',
      dark: '#00a895',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0a0a0a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#bb86fc',
            borderRadius: '4px',
            '&:hover': {
              background: '#d7b4ff',
            },
          },
        },
        '*': {
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          border: '1px solid rgba(187, 134, 252, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(187, 134, 252, 0.3)',
            boxShadow: '0 12px 48px rgba(187, 134, 252, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
          border: '1px solid rgba(187, 134, 252, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 16px rgba(187, 134, 252, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(187, 134, 252, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #bb86fc, #985eff)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d7b4ff, #bb86fc)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 0 2px rgba(187, 134, 252, 0.3)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-focused': {
            background: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 0 2px rgba(187, 134, 252, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          background: 'linear-gradient(135deg, rgba(187, 134, 252, 0.8), rgba(152, 94, 255, 0.8))',
          color: '#ffffff',
        },
      },
    },
  },
});

/**
 * Global styles for smooth scrolling and animations
 * Responsive design implementation
 */
const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        scrollBehavior: 'smooth !important',
      },
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      },
      // Smooth entrance animations
      '@keyframes fadeInUp': {
        from: {
          opacity: 0,
          transform: 'translateY(30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '@keyframes slideInLeft': {
        from: {
          opacity: 0,
          transform: 'translateX(-30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateX(0)',
        },
      },
      // Scroll improvements
      '.smooth-scroll': {
        scrollBehavior: 'smooth',
        transition: 'all 0.3s ease',
      },
    }}
  />
);

/**
 * Main App Component
 * Implements React Router for navigation and Material-UI theming
 * Clean Architecture: Separates routing, theming, and state management
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <AppProvider>
        <Router>
          <div className="smooth-scroll">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/movie/:imdbID" element={<DetailPage />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App; 