/**
 * Hybrid Recommendation Engine
 * Combines content-based filtering (genre similarity) with user history
 */

// Build genre index from all available genres
let genreIndex = null;

function initializeGenreIndex(genres) {
  if (genreIndex) return genreIndex;
  genreIndex = {};
  genres.forEach((genre, idx) => {
    genreIndex[genre.id] = idx;
  });
  return genreIndex;
}

/**
 * Build a genre vector for a movie
 * @param {Array} movieGenres - Array of genre objects {id, name}
 * @param {number} numGenres - Total number of genres
 * @returns {Array} Binary vector representing genres
 */
function buildGenreVector(movieGenres, numGenres) {
  const vector = new Array(numGenres).fill(0);
  if (!movieGenres || movieGenres.length === 0) return vector;
  
  movieGenres.forEach((genre) => {
    const idx = genreIndex[genre.id];
    if (idx !== undefined) {
      vector[idx] = 1;
    }
  });
  
  return vector;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Normalize popularity score (0-1 range)
 */
function normalizePopularity(popularity, minPop = 0, maxPop = 1000) {
  if (popularity === null || popularity === undefined) return 0.5;
  const normalized = (popularity - minPop) / (maxPop - minPop);
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Build user profile vector from watch history
 * @param {Array} history - Array of {id, genres, rating, liked}
 * @param {number} numGenres - Total number of genres
 * @returns {Array} Weighted genre vector representing user preferences
 */
function buildUserProfile(history, numGenres) {
  const userVector = new Array(numGenres).fill(0);
  
  if (!history || history.length === 0) return userVector;
  
  // Calculate weights based on ratings and likes
  history.forEach((item) => {
    if (!item.genres) return;
    
    // Weight: rating (1-5) normalized to 0-1, or 0.5 for liked items
    const weight = item.rating 
      ? (item.rating - 1) / 4  // Normalize 1-5 to 0-1
      : (item.liked ? 0.5 : 0.3);
    
    const movieVector = buildGenreVector(item.genres, numGenres);
    
    // Add weighted vector to user profile
    for (let i = 0; i < numGenres; i++) {
      userVector[i] += movieVector[i] * weight;
    }
  });
  
  // Normalize by number of items
  const count = history.length;
  if (count > 0) {
    for (let i = 0; i < numGenres; i++) {
      userVector[i] /= count;
    }
  }
  
  return userVector;
}

/**
 * Score a movie for recommendation
 * @param {Array} movieVector - Genre vector of the movie
 * @param {Array} userVector - User profile vector
 * @param {number} popularity - Movie popularity score
 * @param {number} rating - Movie average rating
 * @returns {number} Recommendation score
 */
function scoreMovie(movieVector, userVector, popularity, rating) {
  // Content similarity (70% weight)
  const similarity = cosineSimilarity(movieVector, userVector);
  
  // Popularity boost (20% weight)
  const popScore = normalizePopularity(popularity);
  
  // Rating boost (10% weight) - normalize 0-10 to 0-1
  const ratingScore = rating ? rating / 10 : 0.5;
  
  // Weighted combination
  return 0.7 * similarity + 0.2 * popScore + 0.1 * ratingScore;
}

/**
 * Main recommendation function
 * @param {Array} userHistory - User's watch history
 * @param {Array} candidateMovies - All movies to consider
 * @param {Array} allGenres - List of all genres
 * @param {number} topN - Number of recommendations to return
 * @returns {Array} Sorted array of recommended movies with scores
 */
export function recommendMovies(userHistory, candidateMovies, allGenres, topN = 10) {
  if (!candidateMovies || candidateMovies.length === 0) {
    return [];
  }
  
  // Initialize genre index
  const numGenres = allGenres.length;
  initializeGenreIndex(allGenres);
  
  // Get watched movie IDs
  const watchedIds = new Set(
    (userHistory || []).map((item) => item.id)
  );
  
  // Build user profile
  const userVector = buildUserProfile(userHistory, numGenres);
  
  // If user has no history, return popular movies
  if (userHistory.length === 0) {
    return candidateMovies
      .filter((m) => !watchedIds.has(m.id))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, topN)
      .map((m) => ({ ...m, score: normalizePopularity(m.popularity) }));
  }
  
  // Calculate popularity range for normalization
  const popularities = candidateMovies
    .map((m) => m.popularity || 0)
    .filter((p) => p > 0);
  const minPop = popularities.length > 0 ? Math.min(...popularities) : 0;
  const maxPop = popularities.length > 0 ? Math.max(...popularities) : 1000;
  
  // Score all candidate movies
  const scored = candidateMovies
    .filter((m) => !watchedIds.has(m.id))
    .map((movie) => {
      const movieVector = buildGenreVector(movie.genres || [], numGenres);
      const score = scoreMovie(
        movieVector,
        userVector,
        movie.popularity,
        movie.vote_average
      );
      return {
        ...movie,
        score,
        explanation: generateExplanation(movie, userVector, movieVector, score, allGenres),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
  
  return scored;
}

/**
 * Generate explanation for why a movie was recommended
 */
function generateExplanation(movie, userVector, movieVector, score, allGenres) {
  const reasons = [];

  // Check genre overlap
  if (movie.genres && movie.genres.length > 0) {
    const topUserGenres = getTopGenres(userVector, allGenres);
    const movieGenreNames = movie.genres.map((g) => g.name);
    const overlap = topUserGenres.filter((g) => movieGenreNames.includes(g));
    
    if (overlap.length > 0) {
      reasons.push(`Matches your interest in ${overlap.join(', ')}`);
    }
  }

  // Popularity
  if (movie.popularity > 50) {
    reasons.push('Currently trending');
  }

  // Rating
  if (movie.vote_average >= 7.5) {
    reasons.push('Highly rated');
  }

  return reasons.length > 0 ? reasons.join(' • ') : 'Recommended based on your preferences';
}

/**
 * Get top genres from user vector
 */
function getTopGenres(userVector, allGenres) {
  if (!genreIndex || !allGenres) return [];
  
  const genreScores = Object.entries(genreIndex).map(([id, idx]) => {
    const genre = allGenres.find(g => g.id === parseInt(id));
    return {
      id: parseInt(id),
      name: genre ? genre.name : `Genre ${id}`,
      score: userVector[idx],
    };
  });
  
  return genreScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((g) => g.name);
}

