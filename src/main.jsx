import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
const apiKey = import.meta.env.VITE_TMDB_KEY;
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
