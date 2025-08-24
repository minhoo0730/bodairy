import { createWebHashHistory, createRouter } from "vue-router";
import DashPage from "@/pages/LayoutPage.vue";
import AuthPage from "@/pages/auth/LayoutPage.vue";

import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    component: () => import("@/pages/ErrorPage.vue"),
  },
  {
    path: "/auth",
    redirect: "/auth/login",
    component: AuthPage,
    meta: { guestOnly: true },
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/pages/auth/LoginPage.vue"),
      },
      {
        path: "reset-password",
        name: "resetPassword",
        component: () => import("@/pages/auth/ResetPasswordPage.vue"),
      },
      {
        path: "find-email",
        name: "findEmail",
        component: () => import("@/pages/auth/FindEmailPage.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/pages/auth/RegisterPage.vue"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/home/workout-summary",
    component: DashPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
        name: "home",
        redirect: "/home/workout-summary",
        component: () => import("@/pages/home/IndexPage.vue"),
        children:[
        {
          path:"workout-summary",
          name:"workout-summary",
          component:() => import("@/pages/home/DailyWorkoutSummary.vue"),
        },
        {
          path:"workout-chart",
          name:"workout-chart",
          component:() => import("@/pages/home/DailyWorkoutChart.vue")
        },
      ]
      },
      {
        path: '/workouts/new',
        name: 'workoutCreate',
        meta: { requiresAuth: true },
        component: () => import('@/pages/workouts/IndexPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // 1) 부트는 딱 1번만(로컬 토큰 주입 → /me 시도)
  if (!auth.booted) {
    await auth.boot(); // 실패해도 라우팅 강제 X (silent)
  }

  const requiresAuth = to.meta?.requiresAuth;
  const guestOnly    = to.meta?.guestOnly;

  // 2) 보호 라우트 접근: 미로그인 → /auth?redirect=...
  if (requiresAuth && !auth.isLogin) {
    return next({ path: '/auth', query: { redirect: to.fullPath } });
  }

  // 3) 게스트 전용: 로그인 상태면 원래 가려던 곳 또는 /home
  if (guestOnly && auth.isLogin) {
    const redirect = (to.query?.redirect) || '/home';
    return next(redirect);
  }

  // 4) 그 외 통과
  return next();
});
export default router;
