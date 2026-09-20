import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_MESSAGEHUB_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
