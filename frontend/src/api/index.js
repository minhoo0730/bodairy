import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useAuthStore } from '../stores/auth';
import { toasts, useToast } from '@/composables/useToast';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('[axios request error] ', error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const { show } = useToast()
//    const status = error?.response?.status;
    const response = error.response;
    if (response?.status === 401 || response?.status === 403) {
        show(response.data.message, 'error')
    } else {
        return Promise.reject(error);
    }
  },
);

export default axiosInstance;