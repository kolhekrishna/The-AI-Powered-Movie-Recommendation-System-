🎬 AI-Powered Movie Recommendation System

A simple movie discovery web app that recommends movies based on user interests. It uses the TMDB API for real-time movie data and a content-based filtering system to suggest similar movies.

⭐ Features

Search movies

Get similar movie recommendations

View trending & popular titles

Detailed movie pages (overview, rating, cast)

Lightweight, fast UI (built with Vite + React)

🛠 Tech Stack

React + Vite

JavaScript

TMDB API

HTML, CSS

🔧 Setup
1. Install & Run
npm install
npm run dev

2. Add TMDB API Key

Create .env in project root:

VITE_TMDB_KEY=your_api_key_here


Restart dev server after saving.

🤖 How It Works

The recommendation system uses content-based filtering by comparing movie genres, keywords, and descriptions to suggest movies similar to the one selected.

🚀 Future Improvements

User login + personalized recommendations

Dark mode

Better AI/ML-based recommendation model

📄 License

MIT License.
