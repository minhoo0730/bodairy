import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/auth';
import axiosInstance from '@/api/index';
import { useToast } from '@/composables/useToast';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref(null);
  const token = ref(localStorage.getItem('access_token'));
  const isLoggingOut = ref(false);
  const booted = ref(false);
  const { show } = useToast();

  const isLogin = computed(() => !!user.value?.email);

  // 앱 시작 시 호출: localStorage 토큰 → 헤더 주입 → /me
  const boot = async () => {
    try {
      const t = localStorage.getItem('access_token');
      if (t) {
        token.value = t;
        axiosInstance.defaults.headers.Authorization = `Bearer ${t}`;
        await fetchUser();
      }
    } catch (_) {
      // /me 실패해도 부트는 진행
    } finally {
      booted.value = true;
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.login(credentials);
      const access_token = data.access_token;
      const refresh_token = data.refresh_token;
      const authUser = data.user;

      // 상태/저장소/헤더 전파
      token.value = access_token;
      user.value = authUser;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      axiosInstance.defaults.headers.Authorization = `Bearer ${access_token}`;

      show('로그인 성공!', 'success');
      return true;
    } catch (error) {
      show('로그인 실패!', 'error');
      throw error;
    }
  };

  const fetchUser = async () => {
    // 부팅 직후에도 헤더 주입 보장
    const t = localStorage.getItem('access_token');
    if (t && !token.value) {
      token.value = t;
      axiosInstance.defaults.headers.Authorization = `Bearer ${t}`;
    }
    if (!token.value) return;

    try {
      const { data } = await api.fetchUser(); // GET /api/me
      user.value = data;
      return data;
    } catch (e) {
      await logout(); // 만료 등
      throw e;
    }
  };

  const logout = async () => {
    if (isLoggingOut.value) return;
    isLoggingOut.value = true;
    try {
      // 서버에 refresh 토큰 전달해 revoke 시도(추가 인자 무시되어도 안전)
      await api.logout(localStorage.getItem('refresh_token')).catch(() => {});
      show('로그아웃 되었습니다.', 'success');
    } finally {
      // 로컬 완전 정리
      user.value = null;
      token.value = null;
      delete axiosInstance.defaults.headers.Authorization;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      await router.push('/auth');
      isLoggingOut.value = false;
    }
  };

  return {
    user,
    token,
    isLogin,
    isLoggingOut,
    booted,
    boot,
    login,
    fetchUser,
    logout,
  };
});
