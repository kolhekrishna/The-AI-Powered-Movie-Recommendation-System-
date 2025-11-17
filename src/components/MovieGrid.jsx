import MovieCard from './MovieCard';
import './MovieGrid.css';

export default function MovieGrid({ movies, showRemoveButton = false }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <p>No movies found</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          showRemoveButton={showRemoveButton}
        />
      ))}
    </div>
  );
}

