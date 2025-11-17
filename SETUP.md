# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Get Your TMDB API Key

1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Click **Sign Up** to create a free account (or **Log In** if you already have one)
3. Once logged in, go to **Settings** → **API**
4. Click **Request an API Key**
5. Fill out the form:
   - Select **Developer** as the type
   - Accept the terms of use
   - Provide a brief description (e.g., "Personal movie recommendation app")
6. Copy your API key (it will look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Create .env File

1. In the project root directory, create a new file named `.env`
2. Add the following line (replace with your actual API key):
   ```
   VITE_TMDB_KEY=your_actual_api_key_here
   ```
3. **Important**: 
   - No spaces around the `=` sign
   - No quotes around the API key
   - Make sure the file is named exactly `.env` (not `.env.txt`)

### Step 3: Install Dependencies (if not already done)

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 5: Verify It's Working

- You should see movies on the home page
- If you see an error message about the API key, double-check your `.env` file
- Make sure you restarted the dev server after creating/updating the `.env` file

## 🔧 Troubleshooting

### "API Key Required" Message

- Make sure the `.env` file exists in the project root (same folder as `package.json`)
- Check that the file contains: `VITE_TMDB_KEY=your_key_here`
- Restart the development server after creating/updating `.env`
- In Vite, environment variables must start with `VITE_` to be accessible

### "Invalid API Key" Message

- Verify your API key is correct (no extra spaces or characters)
- Check that your TMDB account is active
- Make sure the API key hasn't been revoked in your TMDB account settings
- Try generating a new API key from [TMDB Settings](https://www.themoviedb.org/settings/api)

### No Movies Showing

- Check the browser console for errors (F12 → Console tab)
- Verify your internet connection
- Make sure the TMDB API is accessible (not blocked by firewall)
- Try refreshing the page

### Environment Variables Not Loading

- Make sure the variable name starts with `VITE_`
- Restart the dev server after changing `.env`
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 📝 Example .env File

```
VITE_TMDB_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Note**: Never commit your `.env` file to version control! It's already in `.gitignore`.

## 🎬 Need Help?

- [TMDB API Documentation](https://developers.themoviedb.org/3/getting-started/introduction)
- [TMDB Support](https://www.themoviedb.org/talk)
- Check the main [README.md](README.md) for more information

