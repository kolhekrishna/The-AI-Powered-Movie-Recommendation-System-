const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Check if API key is configured
export function isAPIKeyConfigured() {
  return API_KEY && API_KEY !== 'your_tmdb_api_key_here' && API_KEY.trim() !== '';
}

// In-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url) {
  return url;
}

function getCached(url) {
  const key = getCacheKey(url);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(url, data) {
  const key = getCacheKey(url);
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchFromAPI(endpoint, params = {}) {
  // Check if API key is configured
  if (!isAPIKeyConfigured()) {
    throw new Error('API_KEY_MISSING');
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  const url = `${API_BASE_URL}${endpoint}?${queryParams}`;

  // Check cache
  const cached = getCached(url);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        throw new Error('API_KEY_INVALID');
      }
      throw new Error(`API error: ${response.status} - ${errorData.status_message || 'Unknown error'}`);
    }
    const data = await response.json();
    setCache(url, data);
    return data;
  } catch (error) {
    console.error('TMDB API Error:', error);
    // Re-throw our custom errors
    if (error.message === 'API_KEY_MISSING' || error.message === 'API_KEY_INVALID') {
      throw error;
    }
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}

export const tmdbAPI = {
  // Search movies
  searchMovies: (query, page = 1) => {
    return fetchFromAPI('/search/movie', { query, page });
  },

  // Get trending movies
  getTrending: (timeWindow = 'week', page = 1) => {
    return fetchFromAPI(`/trending/movie/${timeWindow}`, { page });
  },

  // Get top rated movies
  getTopRated: (page = 1) => {
    return fetchFromAPI('/movie/top_rated', { page });
  },

  // Get popular movies
  getPopular: (page = 1) => {
    return fetchFromAPI('/movie/popular', { page });
  },

  // Get movie details
  getMovieDetails: (movieId) => {
    return fetchFromAPI(`/movie/${movieId}`, {
      append_to_response: 'credits,similar',
    });
  },

  // Get similar movies
  getSimilarMovies: (movieId, page = 1) => {
    return fetchFromAPI(`/movie/${movieId}/similar`, { page });
  },

  // Get movies by genre
  discoverMovies: (params = {}) => {
    return fetchFromAPI('/discover/movie', params);
  },

  // Get genre list
  getGenres: async () => {
    const cached = getCached('genres');
    if (cached) return cached;
    const data = await fetchFromAPI('/genre/movie/list');
    setCache('genres', data);
    return data;
  },
};

// Helper to get full image URL
export function getImageUrl(path, size = 'w500') {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Helper to format date
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

