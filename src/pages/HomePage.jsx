import { useEffect, useState } from 'react';
import { tmdbAPI, isAPIKeyConfigured } from '../api/tmdb';
import { useApp } from '../contexts/AppContext';
import { recommendMovies } from '../utils/recommender';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/Loader';
import Error from '../components/Error';
import './HomePage.css';

export default function HomePage() {
  const { history, genres, actions } = useApp();
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Check API key first
        if (!isAPIKeyConfigured()) {
          setError('API_KEY_MISSING');
          setLoading(false);
          return;
        }

        let genresToUse = genres;
        // Load genres if not already loaded
        if (genresToUse.length === 0) {
          const genresData = await tmdbAPI.getGenres();
          genresToUse = genresData.genres || [];
          actions.setGenres(genresToUse);
        }

        // Load trending and top rated in parallel
        const [trendingData, topRatedData] = await Promise.all([
          tmdbAPI.getTrending('week', 1),
          tmdbAPI.getTopRated(1),
        ]);

        setTrending(trendingData.results || []);
        setTopRated(topRatedData.results || []);

        // Generate recommendations
        const allMovies = [
          ...(trendingData.results || []),
          ...(topRatedData.results || []),
        ];
        const recommendations = recommendMovies(
          history,
          allMovies,
          genresToUse,
          10
        );
        setRecommended(recommendations);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length]); // Re-run when history changes

  if (loading) return <Loader />;
  
  // Show helpful error message for API key issues
  if (error) {
    if (error === 'API_KEY_MISSING' || error.includes('API_KEY_MISSING')) {
      return (
        <div className="home-page">
          <section className="hero-section">
            <h1>Discover Your Next Favorite Movie</h1>
            <p>AI-powered recommendations based on your preferences</p>
          </section>
          <div className="api-setup-message">
            <h2>🔑 API Key Required</h2>
            <p>To start using the app, you need to set up your TMDB API key.</p>
            <div className="setup-steps">
              <h3>Setup Instructions:</h3>
              <ol>
                <li>Visit <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a> and create a free account</li>
                <li>Go to <strong>Settings → API</strong> and request an API key</li>
                <li>Create a <code>.env</code> file in the project root</li>
                <li>Add this line: <code>VITE_TMDB_KEY=your_api_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
              <p className="note">💡 The API key is free and takes just a few minutes to set up!</p>
            </div>
          </div>
        </div>
      );
    }
    if (error === 'API_KEY_INVALID' || error.includes('API_KEY_INVALID')) {
      return (
        <div className="home-page">
          <section className="hero-section">
            <h1>Discover Your Next Favorite Movie</h1>
            <p>AI-powered recommendations based on your preferences</p>
          </section>
          <div className="api-setup-message">
            <h2>⚠️ Invalid API Key</h2>
            <p>Your TMDB API key appears to be invalid or expired.</p>
            <div className="setup-steps">
              <h3>Please check:</h3>
              <ol>
                <li>Verify your API key in the <code>.env</code> file</li>
                <li>Make sure there are no extra spaces or quotes</li>
                <li>Check your TMDB account to ensure the API key is active</li>
                <li>Get a new API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">TMDB Settings</a></li>
                <li>Restart the development server after updating</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }
    return <Error message={error} />;
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Discover Your Next Favorite Movie</h1>
        <p>AI-powered recommendations based on your preferences</p>
      </section>

      {recommended.length > 0 && (
        <section className="section">
          <h2 className="section-title">Recommended for You</h2>
          <p className="section-subtitle">
            Based on your watch history and preferences
          </p>
          <MovieGrid movies={recommended} />
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Trending This Week</h2>
        {trending.length > 0 ? (
          <MovieGrid movies={trending} />
        ) : (
          <p className="no-movies-message">No trending movies available at the moment.</p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Top Rated</h2>
        {topRated.length > 0 ? (
          <MovieGrid movies={topRated} />
        ) : (
          <p className="no-movies-message">No top rated movies available at the moment.</p>
        )}
      </section>
    </div>
  );
}

