import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  UPDATE_RATING: 'UPDATE_RATING',
  SET_THEME: 'SET_THEME',
  SET_GENRES: 'SET_GENRES',
};

// Initial state
const initialState = {
  user: null,
  watchlist: [],
  history: [],
  theme: 'light',
  genres: [],
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTIONS.ADD_TO_WATCHLIST:
      if (state.watchlist.find((m) => m.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    
    case ACTIONS.REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter((m) => m.id !== action.payload),
      };
    
    case ACTIONS.ADD_TO_HISTORY:
      // Check if movie already in history, update it
      const existingIndex = state.history.findIndex(
        (m) => m.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.history];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...action.payload,
        };
        return { ...state, history: updated };
      }
      return {
        ...state,
        history: [...state.history, action.payload],
      };
    
    case ACTIONS.UPDATE_RATING:
      return {
        ...state,
        history: state.history.map((item) =>
          item.id === action.payload.movieId
            ? { ...item, rating: action.payload.rating, liked: action.payload.rating >= 4 }
            : item
        ),
      };
    
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTIONS.SET_GENRES:
      return { ...state, genres: action.payload };
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [storedWatchlist, setStoredWatchlist] = useLocalStorage('watchlist', []);
  const [storedHistory, setStoredHistory] = useLocalStorage('history', []);
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', 'light');
  const [storedUser, setStoredUser] = useLocalStorage('user', null);

  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    watchlist: storedWatchlist,
    history: storedHistory,
    theme: storedTheme,
    user: storedUser,
  });

  // Sync to localStorage when state changes
  useEffect(() => {
    setStoredWatchlist(state.watchlist);
  }, [state.watchlist, setStoredWatchlist]);

  useEffect(() => {
    setStoredHistory(state.history);
  }, [state.history, setStoredHistory]);

  useEffect(() => {
    setStoredTheme(state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme, setStoredTheme]);

  useEffect(() => {
    setStoredUser(state.user);
  }, [state.user, setStoredUser]);

  // Set theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, []);

  const value = {
    ...state,
    dispatch,
    actions: {
      setUser: (user) => dispatch({ type: ACTIONS.SET_USER, payload: user }),
      addToWatchlist: (movie) =>
        dispatch({ type: ACTIONS.ADD_TO_WATCHLIST, payload: movie }),
      removeFromWatchlist: (movieId) =>
        dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: movieId }),
      addToHistory: (movie) =>
        dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: movie }),
      updateRating: (movieId, rating) =>
        dispatch({
          type: ACTIONS.UPDATE_RATING,
          payload: { movieId, rating },
        }),
      setTheme: (theme) => dispatch({ type: ACTIONS.SET_THEME, payload: theme }),
      setGenres: (genres) =>
        dispatch({ type: ACTIONS.SET_GENRES, payload: genres }),
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

