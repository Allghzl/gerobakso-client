import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gerobakso.pinat.my.id/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Standard error reporting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
