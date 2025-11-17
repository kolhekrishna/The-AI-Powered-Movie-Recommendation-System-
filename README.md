AI-Powered Movie Recommendation System

A smart, interactive web application that recommends movies based on user preferences using TMDB API + Machine Learning.

🚀 Overview

This project is an AI-powered movie recommendation web app built using:

React + Vite (Frontend)

TMDB API for real-time movie data

JavaScript Recommendation Logic (Content-based filtering)

Responsive UI for clean user experience

Users can discover trending movies, search titles, get similar movie recommendations, and explore detailed movie pages.

✨ Features

🔍 Search Movies using TMDB API

🎯 AI-driven Recommendation System (similar movies, genres, keywords)

📈 Trending & Popular Movies

🎞️ Movie Details Page (poster, cast, crew, rating, overview)

⭐ Watchlist / Favorites

📱 Fully Responsive UI

⚡ Fast performance using Vite

🛠️ Tech Stack
Frontend

React.js

Vite

JavaScript (ES6+)

HTML5, CSS3

APIs & Tools

TMDB API (The Movie Database)

Axios / Fetch

🔑 TMDB API Setup

Visit: https://www.themoviedb.org

Create a free account

Go to:
Profile → Settings → API → Request API Key

Copy your TMDB API Key (v3)

Create .env file in project root
VITE_TMDB_KEY=your_api_key_here

Restart the dev server
npm run dev

📦 Installation & Setup
Clone the Repository
git clone https://github.com/your-username/movie-recommendation-system.git
cd movie-recommendation-system

Install Dependencies
npm install

Start Development Server
npm run dev

📁 Project Structure
movie-recommendation-system/
│── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│── public/
│── .env
│── package.json
│── README.md

🤖 How the Recommendation System Works

The AI recommendation engine uses:

✅ Content-Based Filtering

Movie genres

Keywords

Cast

Overview description

User search/past selections

How it works:

Fetch movie metadata from TMDB

Compute similarity score using cosine similarity or keyword matches

Show most similar movies to the selected title

📷 Screenshots

(Add your app screenshots here)

![Home Page](./screenshots/home.png)
![Movie Details](./screenshots/details.png)

🔮 Future Improvements

User login system

AI model using embeddings (BERT/TensorFlow)

Collaborative filtering for personalized recos

Dark mode UI

Trending shows section

🤝 Contributing

Pull requests are welcome. Feel free to open issues for suggestions or bugs.

📄 License

This project is licensed under the MIT License.
