import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './AnalyticsPage.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { history, watchlist } = useApp();

  // Calculate top genres
  const topGenres = useMemo(() => {
    const genreCount = {};
    history.forEach((item) => {
      if (item.genres) {
        item.genres.forEach((genre) => {
          genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [history]);

  // Calculate ratings distribution
  const ratingsDistribution = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    history.forEach((item) => {
      if (item.rating) {
        distribution[item.rating] = (distribution[item.rating] || 0) + 1;
      }
    });
    return distribution;
  }, [history]);

  // Calculate watch history over time
  const watchHistoryOverTime = useMemo(() => {
    const monthlyCount = {};
    history.forEach((item) => {
      if (item.viewedAt) {
        const date = new Date(item.viewedAt);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCount[month] = (monthlyCount[month] || 0) + 1;
      }
    });

    // Sort by date
    const sorted = Object.entries(monthlyCount).sort(([a], [b]) => a.localeCompare(b));
    return sorted.slice(-12); // Last 12 months
  }, [history]);

  const pieData = {
    labels: topGenres.map((g) => g.name),
    datasets: [
      {
        label: 'Movies Watched',
        data: topGenres.map((g) => g.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF6384',
        ],
      },
    ],
  };

  const barData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Movies',
        data: [
          ratingsDistribution[1],
          ratingsDistribution[2],
          ratingsDistribution[3],
          ratingsDistribution[4],
          ratingsDistribution[5],
        ],
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const lineData = {
    labels: watchHistoryOverTime.map(([month]) => month),
    datasets: [
      {
        label: 'Movies Watched',
        data: watchHistoryOverTime.map(([, count]) => count),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const averageRating =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + (item.rating || 0), 0) /
          history.filter((item) => item.rating).length
        ).toFixed(1)
      : 0;

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Watched</h3>
          <p className="stat-value">{history.length}</p>
        </div>
        <div className="stat-card">
          <h3>In Watchlist</h3>
          <p className="stat-value">{watchlist.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-value">{averageRating || 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3>Rated Movies</h3>
          <p className="stat-value">
            {history.filter((item) => item.rating).length}
          </p>
        </div>
      </div>

      <div className="charts-grid">
        {topGenres.length > 0 && (
          <div className="chart-card">
            <h2>Top Genres</h2>
            <div className="chart-container">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        )}

        {history.filter((item) => item.rating).length > 0 && (
          <div className="chart-card">
            <h2>Ratings Distribution</h2>
            <div className="chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        )}

        {watchHistoryOverTime.length > 0 && (
          <div className="chart-card">
            <h2>Watch History Over Time</h2>
            <div className="chart-container">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {history.length === 0 && (
        <div className="analytics-empty">
          <p>No analytics data available yet.</p>
          <p>Start watching and rating movies to see your insights!</p>
        </div>
      )}
    </div>
  );
}

