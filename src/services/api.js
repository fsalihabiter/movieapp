import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // For sending HTTP-Only cookies
});

// Request interceptor to attach access token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['token'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for automatic refresh token handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, {
          withCredentials: true
        });
        
        localStorage.setItem('accessToken', res.data.accessToken);

        // Update authorization header
        api.defaults.headers.common['token'] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or invalid
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
