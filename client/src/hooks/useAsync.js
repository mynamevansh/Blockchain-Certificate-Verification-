import { useState, useEffect, useCallback } from 'react';

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and handles setting state for pending, resolved, and rejected promises
  const execute = useCallback(
    async (...args) => {
      setStatus('loading');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  // Call execute if we want to fire it right away. Otherwise execute can be called later, such as in an onClick handler
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  };
};
