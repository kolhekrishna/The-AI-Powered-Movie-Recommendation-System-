import './Error.css';

export default function Error({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}

