import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdbAPI } from '../api/tmdb';
import { debounce, getYear } from '../utils/helpers';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/Loader';
import Error from '../components/Error';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await tmdbAPI.searchMovies(searchQuery);
      setResults(data.results || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = debounce(performSearch, 500);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchInput.trim();
    if (trimmedQuery) {
      setSearchParams({ q: trimmedQuery });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setResults([]);
    }
  };

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Filter by year
    if (filterYear) {
      const year = parseInt(filterYear);
      filtered = filtered.filter((movie) => {
        const movieYear = getYear(movie.release_date);
        return movieYear === year;
      });
    }

    // Filter by minimum rating
    if (filterRating) {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(
        (movie) => movie.vote_average >= minRating
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          const yearA = getYear(a.release_date) || 0;
          const yearB = getYear(b.release_date) || 0;
          return yearB - yearA; // Newest first
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'popularity':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return filtered;
  }, [results, sortBy, filterYear, filterRating]);

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>Search Movies</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchInput}
            onChange={handleInputChange}
            className="search-input-large"
          />
          <button type="submit" className="search-button-large">
            Search
          </button>
        </form>
      </div>

      {loading && <Loader />}
      {error && <Error message={error} onRetry={() => performSearch(query)} />}
      {!loading && !error && results.length > 0 && (
        <div className="filters-section">
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="sort-by">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="year">Year (Newest)</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-year">Year:</label>
              <input
                id="filter-year"
                type="number"
                placeholder="e.g. 2020"
                min="1900"
                max={new Date().getFullYear()}
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filter-rating">Min Rating:</label>
              <input
                id="filter-rating"
                type="number"
                placeholder="e.g. 7.0"
                min="0"
                max="10"
                step="0.1"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-input"
              />
            </div>

            {(filterYear || filterRating) && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setFilterYear('');
                  setFilterRating('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {query && (
            <p className="search-results-count">
              {filteredAndSortedResults.length !== results.length
                ? `Showing ${filteredAndSortedResults.length} of ${results.length} result${
                    results.length !== 1 ? 's' : ''
                  }`
                : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}{' '}
              for "{query}"
            </p>
          )}
          <MovieGrid movies={filteredAndSortedResults} />
        </>
      )}
    </div>
  );
}

