import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '/api/v1'
);

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Centralized response & error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorEnvelope = error.response?.data?.error;
    const message = errorEnvelope?.message || error.message || 'An unexpected error occurred';
    console.error('[API Error Interceptor]:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message,
      details: errorEnvelope?.details,
    });
    return Promise.reject(error);
  }
);
