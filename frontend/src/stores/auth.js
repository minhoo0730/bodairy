import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/auth';
import { useToast } from '@/composables/useToast';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const auth = ref(null);
  const token = ref(localStorage.getItem('access_token'));
  const isLoggingOut = ref(false);
  const {show} = useToast();

  const isLogin = computed(() => !!auth.value?.email);

  const login = async user => {
    try {
      // const { token: accessToken, user: loggedInUser } = await api.login(credentials);
      const {data} = await api.login(user);
      const getToken = data.token;
      const authUser = data.user;
      auth.value = authUser;
      token.value = getToken;
      localStorage.setItem('access_token', getToken);
      await router.push('/home');
      show('로그인 성공!', 'success')
    } catch (error) {
      // if (error.status === 401) {
      //   show('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
      // } else {
      //   show('로그인 중 알 수 없는 오류가 발생했습니다.', 'error');
      // }
      throw error;
    }
  };

    const fetchUser = async () => {
      if (!token.value) return;
      try {
        const { data } = await api.fetchUser();
        auth.value = data;
      } catch {
        this.logout(); // 토큰 만료 등 에러 시
      }
    };


  const logout = () => {
    auth.value = null;
    token.value = null;
    localStorage.removeItem('access_token');
    router.push('/auth');
  };

  return {
    auth,
    token,
    isLogin,
    login,
    fetchUser,
    logout,
  };
});