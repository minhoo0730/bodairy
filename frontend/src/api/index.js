import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useToast } from '@/composables/useToast';

// 공용 인스턴스
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: Authorization 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 리프레시 전용(인터셉터 없음) — 무한루프 방지
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue = [];
const enqueue = (p) => refreshQueue.push(p);
const drainQueue = (err, token) => {
  refreshQueue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token)));
  refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const response = error?.response;
    const original = error?.config || {};
    const { show } = useToast();
    const auth = useAuthStore();

    if (!response) return Promise.reject(error);

    const url = (original.url || '').toString();
    const isAuthEndpoint = url.includes('/api/refresh') || url.includes('/api/login');

    // 로그아웃 중에는 리프레시 금지
    if (auth.isLoggingOut) return Promise.reject(error);

    if (response.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      const rt = localStorage.getItem('refresh_token');
      if (!rt) {
        show('세션이 만료되었습니다. 다시 로그인해주세요.', 'error');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          enqueue({ resolve, reject });
        }).then((newToken) => {
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          return axiosInstance(original);
        });
      }

      isRefreshing = true;
      try {
        // 커스텀 방식: body에 refresh_token
        const { data } = await refreshClient.post('/api/refresh', { refresh_token: rt });
        const newToken = data?.access_token;
        const newRefresh = data?.refresh_token;
        if (!newToken || !newRefresh) throw new Error('Invalid refresh response');

        // 저장/전파
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('refresh_token', newRefresh);
        axiosInstance.defaults.headers = {
          ...(axiosInstance.defaults.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        if ('token' in auth) auth.token = newToken;

        drainQueue(null, newToken);

        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
        return axiosInstance(original);
      } catch (e) {
        drainQueue(e);
        show('세션이 만료되었습니다. 다시 로그인해주세요.', 'error');
        // 로컬 정리
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // 그 외 에러 토스트
    if ([403, 404, 422].includes(response.status)) {
      const errors = response?.data?.errors;
      if (errors && typeof errors === 'object') {
        Object.values(errors).forEach((arr) => Array.isArray(arr) && arr.forEach((m) => show(m, 'error')));
      } else {
        show(response?.data?.message || '에러가 발생했습니다.', 'error');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
