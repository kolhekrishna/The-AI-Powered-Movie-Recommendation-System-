# AI Movie Recommender (React)

## Overview

AI Movie Recommender is a React web app that fetches movie data from TMDB and recommends films based on user watch history and genre similarity. It features a hybrid recommendation engine that combines content-based filtering with user behavior analysis.

## Features

- **Search Movies** - Real-time search using TMDB API with live suggestions
- **Movie Details** - Comprehensive movie information with cast, similar movies, and ratings
- **Persistent Watchlist** - Save movies to watch later, stored in localStorage
- **User History Tracking** - Automatically tracks viewed movies and user ratings
- **Hybrid Recommendation Engine** - AI-powered recommendations based on:
  - Genre similarity (content-based filtering)
  - User watch history and ratings
  - Movie popularity and trending status
- **Analytics Dashboard** - Visual insights including:
  - Top genres watched
  - Ratings distribution
  - Watch history over time
  - Statistics cards
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Clean UI/UX** - Modern, polished interface with smooth animations

## Tech Stack

- **Frontend Framework**: React.js (functional components + hooks)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS with CSS Variables for theming
- **Routing**: React Router v6
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: React Context API + useReducer
- **Persistence**: localStorage
- **API**: TMDB (The Movie Database) API
- **Build Tool**: Vite
- **Linter**: ESLint

## Setup (Local Development)

> 📖 **For detailed setup instructions, see [SETUP.md](SETUP.md)**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-movie-recommender
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get TMDB API Key** (Free - takes 2 minutes)
   - Visit [TMDB](https://www.themoviedb.org/) and create a free account
   - Go to **Settings → API** and request an API key
   - Copy your API key

4. **Create environment file**
   - Create a `.env` file in the root directory
   - Add your TMDB API key:
     ```
     VITE_TMDB_KEY=your_tmdb_api_key_here
     ```
   - ⚠️ **Important**: No spaces around `=`, no quotes, and restart the dev server after creating the file

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - The app will open at `http://localhost:3000`
   - If you see "API Key Required", check your `.env` file and restart the server

## Deployment

### Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable in Netlify dashboard:
     - Key: `VITE_TMDB_KEY`
     - Value: Your TMDB API key
   - Deploy!

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   "homepage": "https://yourusername.github.io/ai-movie-recommender",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

**Note**: For GitHub Pages, you'll need to handle environment variables differently (consider using a proxy or serverless function to protect your API key).

## Recommendation Algorithm

The recommendation engine uses a hybrid approach combining multiple signals:

### 1. Content-Based Filtering (70% weight)
- Builds genre vectors for each movie
- Creates a user profile vector from watched/liked movies
- Calculates cosine similarity between user profile and candidate movies
- Weighted by user ratings (1-5 stars)

### 2. Popularity Boost (20% weight)
- Normalizes movie popularity scores
- Gives preference to trending and popular movies

### 3. Rating Boost (10% weight)
- Considers TMDB average ratings
- Promotes highly-rated movies

### Pipeline:
1. User watches/rates movies → updates history
2. System builds user profile vector from genre preferences
3. Scores all candidate movies (excluding already watched)
4. Returns top N recommendations sorted by score

### Example:
If a user watches and rates "Action" and "Sci-Fi" movies highly, the system will recommend similar movies in those genres, boosted by popularity and ratings.

## Project Structure

```
src/
  /api
    tmdb.js              # TMDB API service with caching
  /components
    Header.jsx           # Navigation and search
    Footer.jsx           # Footer component
    MovieCard.jsx        # Movie card with poster and actions
    MovieGrid.jsx        # Grid layout for movies
    Loader.jsx           # Loading spinner
    Error.jsx            # Error display
  /contexts
    AppContext.jsx       # Global state management
  /hooks
    useLocalStorage.js   # localStorage hook
    useFetch.js          # Data fetching hook
  /pages
    HomePage.jsx         # Landing page with recommendations
    SearchPage.jsx       # Movie search
    MoviePage.jsx        # Movie details
    WatchlistPage.jsx    # User watchlist
    AnalyticsPage.jsx    # Analytics dashboard
    NotFoundPage.jsx     # 404 page
  /utils
    recommender.js       # Recommendation engine
    helpers.js           # Utility functions
  App.jsx                # Main app component
  main.jsx               # Entry point
  index.css              # Global styles
```

## Key Features Explained

### Watchlist
- Add/remove movies from watchlist
- Persisted to localStorage
- Quick access from header navigation

### User History
- Automatically tracks when you view a movie
- Stores ratings (1-5 stars)
- Used for generating personalized recommendations

### Analytics
- Visual charts showing:
  - Genre preferences (pie chart)
  - Rating distribution (bar chart)
  - Watch activity over time (line chart)
- Statistics cards with key metrics

### Search
- Real-time search with debouncing
- Results from TMDB API
- Direct navigation to movie details

## API Usage

The app uses the following TMDB endpoints:
- `/search/movie` - Search movies
- `/trending/movie/week` - Get trending movies
- `/movie/top_rated` - Get top rated movies
- `/movie/{id}` - Get movie details
- `/movie/{id}/similar` - Get similar movies
- `/genre/movie/list` - Get genre list

All API calls are cached for 5 minutes to reduce API usage.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or portfolio purposes.

## Notes

- This is a frontend-only project using local persistence (localStorage)
- API key must not be committed to version control
- For production, consider adding error boundaries and more robust error handling
- The recommendation engine runs client-side and is suitable for moderate dataset sizes

## Screenshots

(Add screenshots or demo GIF here)

## Demo

[Live Demo](https://your-netlify-app.netlify.app) (Update with your deployment URL)

## Author

Built as a portfolio project demonstrating React skills, API integration, and machine learning concepts.

