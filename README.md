# Movie Search Application
# https://moviesearchv1.netlify.app/
A modern React application for searching movies and TV series using the OMDB API. Built with TypeScript, Material-UI, and Clean Architecture principles.


<img width="1440" alt="Captura de pantalla 2025-07-04 a la(s) 12 36 45 a  m" src="https://github.com/user-attachments/assets/7bb60f4f-01f3-47f8-8d04-165861c9018e" />

<img width="462" alt="Captura de pantalla 2025-07-04 a la(s) 12 37 36 a  m" src="https://github.com/user-attachments/assets/d8685417-adf9-425d-b9b9-2049489e5f64" /><img width="906" alt="Captura de pantalla 2025-07-04 a la(s) 12 37 02 a  m" src="https://github.com/user-attachments/assets/ccefe30a-0df3-4473-8f0f-8c2f3564f16e" />

<img width="475" alt="Captura de pantalla 2025-07-04 a la(s) 12 37 30 a  m" src="https://github.com/user-attachments/assets/ad1d65ec-365e-462f-9bf2-4b896a83c927" /><img width="1080" alt="Captura de pantalla 2025-07-04 a la(s) 12 37 10 a  m" src="https://github.com/user-attachments/assets/4d851b63-61f4-46d0-b579-564bb9f6f440" />



## 🎯 Challenge Requirements

This project implements all required technical specifications:

### ✅ Core Requirements
- **React 18** with functional components and hooks
- **TypeScript** for complete type safety
- **OMDB API** integration for movie data
- **Material-UI** for modern UI components
- **Clean Architecture** implementation
- **Error handling** and loading states
- **Responsive design** for all screen sizes

### ✅ Technical Implementation
- **Custom Hooks**: `useMovies`, `useDebounce`
- **State Management**: Context API with useReducer
- **API Layer**: Singleton pattern with caching and retry logic
- **Domain Layer**: Business logic separation
- **Component Architecture**: Reusable, typed components

## 🚀 Features

- **Real-time Search**: Debounced search with 800ms delay
- **Advanced Filtering**: Search by movies, series, or both
- **Smart Pagination**: Limited to 3 pages with exactly 12 items per page
- **Dynamic Image Filtering**: Automatically removes broken images
- **Responsive Design**: Adaptive grid layout for all screen sizes
- **Error Recovery**: Retry mechanism with intelligent error handling
- **Modern UI**: Dark theme with glassmorphism effects

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── SearchBar.tsx  # Search input with filters
│   ├── MovieList.tsx  # Results grid with pagination
│   ├── MovieCard.tsx  # Individual movie cards
│   ├── Pagination.tsx # Custom pagination component
│   ├── Loader.tsx     # Loading spinner
│   └── ErrorMessage.tsx # Error display
├── pages/             # Route components
│   ├── SearchPage.tsx # Main search interface
│   └── DetailPage.tsx # Movie detail view
├── hooks/             # Custom React hooks
│   ├── useMovies.ts   # Movie operations hook
│   └── useDebounce.ts # Search debouncing
├── services/          # External API communication
│   └── omdbApi.ts     # OMDB API service (Singleton)
├── domain/            # Business logic layer
│   └── movieService.ts # Movie domain operations
├── context/           # State management
│   └── AppContext.tsx # Global application state
├── types/             # TypeScript definitions
│   └── index.ts       # All type definitions
└── App.tsx            # Main application component
```

## 🛠️ Installation & Setup

### Quick Start (Demo Mode)
For immediate testing, the app includes a fallback API key:

```bash
git clone <repository-url>
cd omdb-movie-app
npm install
npm start
```

Navigate to: http://localhost:3000

### Professional Setup (Recommended)
For production use or extended testing, get your own API key:

1. **Get your free OMDB API Key**
   - Visit: https://www.omdbapi.com/apikey.aspx
   - Select "FREE! (1,000 daily limit)"
   - Verify your email
   - Copy your API key

2. **Configure Environment**
   ```bash
   # Create .env file in the project root
   echo "REACT_APP_OMDB_API_KEY=your_actual_api_key_here" > .env
   ```

3. **Start Development**
   ```bash
   npm start
   ```

### 🔑 API Key Options

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Your Own Key** | ✅ Full 1,000 daily requests<br/>✅ No shared limits<br/>✅ Production ready | ⏱️ 2 min setup | **Recommended for all users** |
| **Demo Fallback** | ✅ Zero setup<br/>✅ Instant testing | ⚠️ Shared daily limits<br/>⚠️ May hit rate limits | **Quick demos only** |

**💡 Pro Tip**: The free OMDB tier gives you 1,000 requests per day, which is plenty for development and testing.

## 💻 Usage

### Search Movies and Series
- Enter a title in the search field (minimum 2 characters)
- Select content type: All, Movies, or Series
- Results appear automatically with debounced search

### Navigation
- Click any movie/series card to view detailed information
- Use pagination to browse through results (3 pages maximum)
- Responsive design adapts to your screen size

### Features in Detail
- **Auto-search**: Results update as you type (800ms delay)
- **Image Quality**: Only high-quality posters are displayed
- **Smart Grid**: Layout adapts based on number of results
- **Error Recovery**: Retry failed requests automatically

## 🏗️ Architecture

### Clean Architecture Implementation

**Presentation Layer** (`components/`, `pages/`)
- React components with Material-UI
- Responsive design and user interactions
- Loading states and error handling

**Application Layer** (`hooks/`, `context/`)
- Custom hooks for business logic
- State management with Context API
- Data flow coordination

**Domain Layer** (`domain/`)
- Business rules and validation
- Data transformation
- Core application logic

**Data Layer** (`services/`)
- External API communication
- Caching and retry mechanisms
- Error handling and data mapping

### State Management
- **Context API** with `useReducer` for predictable state updates
- **Custom hooks** to encapsulate business logic
- **TypeScript** for complete type safety

### Performance Optimizations
- **Debounced Search**: Reduces API calls
- **Image Filtering**: Improves visual quality
- **Caching**: Prevents duplicate requests
- **Memoized Components**: Optimizes re-renders

## 🎨 Design System

### Theme
- **Dark Mode**: Modern dark theme with custom colors
- **Color Palette**: Purple (#bb86fc) and cyan (#03dac6)
- **Typography**: Roboto with custom weights
- **Spacing**: Consistent 8px grid system

### Components
- **Glassmorphism**: Backdrop blur and transparency effects
- **Smooth Animations**: CSS transitions and Material-UI animations
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Loading States**: Consistent spinner and skeleton patterns

## 🧪 Technical Highlights

### TypeScript Implementation
- Complete type coverage
- Generic types for API responses
- Strict type checking enabled
- Interface-based architecture

### API Integration
- Singleton pattern for service instance
- Intelligent caching system
- Retry logic with exponential backoff
- Comprehensive error handling

### Custom Hooks
- `useMovies`: Encapsulates all movie-related operations
- `useDebounce`: Optimizes search performance
- Separation of concerns
- Reusable business logic

### Responsive Design
- Mobile-first approach
- Adaptive grid system
- Touch-friendly interactions
- Optimized for all devices

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## 🚀 Deployment

### Local Build
```bash
npm run build
```

### Netlify/Vercel Deployment
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable: `REACT_APP_OMDB_API_KEY`

### Environment Variables for Production
For deployment platforms, add:
```
REACT_APP_OMDB_API_KEY=your_production_api_key
```

## 📄 License

This project is licensed under the MIT License.

---

**Built with React, TypeScript, and Material-UI** | Clean Architecture Pattern
