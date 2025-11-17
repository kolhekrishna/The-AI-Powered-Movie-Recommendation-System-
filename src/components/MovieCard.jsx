import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';
import { useApp } from '../contexts/AppContext';
import './MovieCard.css';

export default function MovieCard({ movie, showRemoveButton = false }) {
  const { watchlist, actions } = useApp();
  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      actions.removeFromWatchlist(movie.id);
    } else {
      actions.addToWatchlist(movie);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.removeFromWatchlist(movie.id);
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card-poster">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <button
            className={`watchlist-button ${isInWatchlist ? 'active' : ''}`}
            onClick={handleAddToWatchlist}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isInWatchlist ? '✓' : '+'}
          </button>
          {showRemoveButton && (
            <button
              className="remove-button"
              onClick={handleRemove}
              aria-label="Remove from watchlist"
            >
              ×
            </button>
          )}
        </div>
        {movie.vote_average > 0 && (
          <div className="movie-card-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        {movie.release_date && (
          <p className="movie-card-year">
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
      </div>
    </Link>
  );
}

