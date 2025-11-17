import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { getYear } from '../utils/helpers';
import MovieGrid from '../components/MovieGrid';
import './WatchlistPage.css';

export default function WatchlistPage() {
  const { watchlist } = useApp();
  const [sortBy, setSortBy] = useState('added');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');

  // Filter and sort watchlist
  const filteredAndSortedWatchlist = useMemo(() => {
    // Create array with original indices for "added" sorting
    let filtered = watchlist.map((movie, index) => ({ movie, originalIndex: index }));

    // Filter by year
    if (filterYear) {
      const year = parseInt(filterYear);
      filtered = filtered.filter(({ movie }) => {
        const movieYear = getYear(movie.release_date);
        return movieYear === year;
      });
    }

    // Filter by minimum rating
    if (filterRating) {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(
        ({ movie }) => (movie.vote_average || 0) >= minRating
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          const yearA = getYear(a.movie.release_date) || 0;
          const yearB = getYear(b.movie.release_date) || 0;
          return yearB - yearA; // Newest first
        case 'rating':
          return (b.movie.vote_average || 0) - (a.movie.vote_average || 0);
        case 'title':
          return (a.movie.title || '').localeCompare(b.movie.title || '');
        case 'added':
        default:
          // Most recently added first (reverse order of original index)
          return b.originalIndex - a.originalIndex;
      }
    });

    // Extract just the movies
    return filtered.map(({ movie }) => movie);
  }, [watchlist, sortBy, filterYear, filterRating]);

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {watchlist.length > 0 ? (
        <>
          <p className="watchlist-count">
            {filteredAndSortedWatchlist.length !== watchlist.length
              ? `Showing ${filteredAndSortedWatchlist.length} of ${watchlist.length} movie${
                  watchlist.length !== 1 ? 's' : ''
                }`
              : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} in your watchlist`}
          </p>

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
                  <option value="added">Recently Added</option>
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

          <MovieGrid movies={filteredAndSortedWatchlist} showRemoveButton={true} />
        </>
      ) : (
        <div className="watchlist-empty">
          <p>Your watchlist is empty.</p>
          <p>Start adding movies to your watchlist!</p>
        </div>
      )}
    </div>
  );
}

