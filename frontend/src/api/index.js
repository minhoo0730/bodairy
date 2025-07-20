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
    const status = error?.response?.status
    if (error.response && status === 401) {
      show('아이디 또는 비밀번호가 올바르지 않습니다.', 'error')
    } else if (error.response && status === 403) {
      show('접근 권한이 없습니다.', 'error')
    } else {
    return Promise.reject(error);
    }
  },
);

export default axiosInstance;