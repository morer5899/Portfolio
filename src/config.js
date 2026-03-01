// API Configuration
export const API_BASE_URL = 'https://portfolio-backend-7k3o.onrender.com';

// Check if we're in development mode
export const IS_DEV = process.env.NODE_ENV === 'development';

// Use localhost in development, production URL in production
export const getApiUrl = (path) => {
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${formattedPath}`;
};

export const PLATFORM_URLS = {
  leetcode: (username) => `https://leetcode.com/${username}/`,
  gfg: (username) => `https://auth.geeksforgeeks.org/user/${username}/practice/`,
  hackerrank: (username) => `https://www.hackerrank.com/profile/${username}`,
  codeforces: (username) => `https://codeforces.com/profile/${username}`,
  codechef: (username) => `https://www.codechef.com/users/${username}`
};