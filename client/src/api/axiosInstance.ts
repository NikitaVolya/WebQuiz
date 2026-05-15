/**
 * @file api/axiosInstance.ts
 * Configuration centrale d'Axios pour communiquer avec le PHP
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTEUR DE REQUÊTE
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTEUR DE RÉPONSE
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('quiz_user_session');
    }
    return Promise.reject(error);
  }
);

export default api;