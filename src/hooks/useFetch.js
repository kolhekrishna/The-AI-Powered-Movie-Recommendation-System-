import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data with loading and error states
 */
export function useFetch(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'An error occurred');
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
}

