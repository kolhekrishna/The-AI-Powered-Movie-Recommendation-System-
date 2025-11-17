// Debounce function for search
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format runtime (minutes to hours and minutes)
export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Truncate text
export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get year from date string
export function getYear(dateString) {
  if (!dateString) return null;
  return new Date(dateString).getFullYear();
}

// Calculate average rating from array of ratings
export function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
  return (sum / ratings.length).toFixed(1);
}

