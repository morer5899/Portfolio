// API Configuration
export const API_BASE_URL = 'https://portfolio-backend-7k3o.onrender.com';

// Check if we're in development mode
export const IS_DEV = process.env.NODE_ENV === 'development';

// Use localhost in development, production URL in production
export const getApiUrl = (path) => {
  const baseUrl = IS_DEV ? 'http://localhost:5000' : API_BASE_URL;
  return `${baseUrl}${path}`;
};
