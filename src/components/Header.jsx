import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { debounce } from '../utils/helpers';
import './Header.css';

export default function Header() {
  const { theme, actions } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleTheme = () => {
    actions.setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          🎬 AI Movie Recommender
        </Link>
        
        <form onSubmit={handleSearch} className="header-search">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" aria-label="Search">
            🔍
          </button>
        </form>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/watchlist" className="nav-link">Watchlist</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  );
}

