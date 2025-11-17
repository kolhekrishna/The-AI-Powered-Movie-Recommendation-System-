import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbAPI, getImageUrl, formatDate } from '../api/tmdb';
import { formatRuntime } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/Loader';
import Error from '../components/Error';
import './MoviePage.css';

export default function MoviePage() {
  const { id } = useParams();
  const { watchlist, history, actions } = useApp();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const isInWatchlist = watchlist.some((m) => m.id === parseInt(id));

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError(null);
        const data = await tmdbAPI.getMovieDetails(id);
        setMovie(data);
        
        // Load similar movies
        const similarData = await tmdbAPI.getSimilarMovies(id);
        setSimilar(similarData.results?.slice(0, 12) || []);

        // Set rating if exists in history
        const currentHistoryItem = history.find((m) => m.id === parseInt(id));
        if (currentHistoryItem) {
          setRating(currentHistoryItem.rating || 0);
        }

        // Add to history
        actions.addToHistory({
          id: data.id,
          title: data.title,
          genres: data.genres || [],
          poster_path: data.poster_path,
          release_date: data.release_date,
          viewedAt: new Date().toISOString(),
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    loadMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToWatchlist = () => {
    if (isInWatchlist) {
      actions.removeFromWatchlist(movie.id);
    } else {
      actions.addToWatchlist(movie);
    }
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    actions.updateRating(movie.id, newRating);
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!movie) return <Error message="Movie not found" />;

  const cast = movie.credits?.cast?.slice(0, 10) || [];

  return (
    <div className="movie-page">
      <div className="movie-page-header">
        <div className="movie-poster-large">
          <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} />
        </div>
        <div className="movie-details">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          
          <div className="movie-meta">
            {movie.release_date && (
              <span>{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
            {movie.vote_average > 0 && (
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="movie-actions">
            <button
              onClick={handleAddToWatchlist}
              className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`}
            >
              {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
          </div>

          <div className="rating-section">
            <p>Rate this movie:</p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`star ${star <= rating ? 'active' : ''}`}
                  aria-label={`Rate ${star} stars`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && <p className="rating-text">You rated: {rating}/5</p>}
          </div>
        </div>
      </div>

      <div className="movie-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'cast' ? 'active' : ''}
          onClick={() => setActiveTab('cast')}
        >
          Cast
        </button>
        <button
          className={activeTab === 'similar' ? 'active' : ''}
          onClick={() => setActiveTab('similar')}
        >
          Similar Movies
        </button>
      </div>

      <div className="movie-tab-content">
        {activeTab === 'overview' && (
          <div className="overview">
            {movie.overview ? (
              <p>{movie.overview}</p>
            ) : (
              <p>No overview available.</p>
            )}
            {movie.release_date && (
              <p>
                <strong>Release Date:</strong> {formatDate(movie.release_date)}
              </p>
            )}
            {movie.budget > 0 && (
              <p>
                <strong>Budget:</strong> ${movie.budget.toLocaleString()}
              </p>
            )}
            {movie.revenue > 0 && (
              <p>
                <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {activeTab === 'cast' && (
          <div className="cast-grid">
            {cast.length > 0 ? (
              cast.map((actor) => (
                <div key={actor.id} className="cast-item">
                  <img
                    src={getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name}
                  />
                  <p className="cast-name">{actor.name}</p>
                  <p className="cast-character">{actor.character}</p>
                </div>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </div>
        )}

        {activeTab === 'similar' && (
          <div>
            {similar.length > 0 ? (
              <MovieGrid movies={similar} />
            ) : (
              <p>No similar movies found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

