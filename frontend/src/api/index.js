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
    const { show } = useToast();
    const response = error.response;

    if ([401, 403, 404, 422].includes(response?.status)) {
      const errors = response?.data?.errors;

      if (errors && typeof errors === 'object') {
        Object.values(errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => show(msg, 'error'));
          }
        });
      } else {
        show(response?.data?.message || '에러가 발생했습니다.', 'error');
      }
    }

    return Promise.reject(error); // 항상 Promise.reject 반환
  }
);
export default axiosInstance;