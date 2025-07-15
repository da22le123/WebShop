import axios from 'axios';

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// make axios set the authorization header with 
// the token from local storage if there is one
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
