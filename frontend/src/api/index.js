import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useAuthStore } from '../stores/auth';

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
    // const authStore = useAuthStore();

    // if (!error.response) {
    //   console.warn('서버가 응답이 없습니다.');
    //   return Promise.reject(error); // 또는 return null;
    // }

    // if (error.response.status === 401) {
    //   if (router.currentRoute.value.path !== '/auth') {
    //     authStore.logout();
    //     router.push('/auth');
    //   }
    //   return Promise.resolve(null); // 콘솔 메시지 제거
    // }

    return Promise.reject(error);
  },
);

export default axiosInstance;