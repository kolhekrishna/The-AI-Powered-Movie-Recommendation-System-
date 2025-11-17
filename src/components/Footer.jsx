import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          Powered by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TMDB
          </a>
        </p>
        <p>© 2024 AI Movie Recommender</p>
      </div>
    </footer>
  );
}

