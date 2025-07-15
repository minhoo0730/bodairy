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
    ],
  },
  {
    path: "/",
    redirect: "/home",
    component: DashPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/pages/home/IndexPage.vue"),
      },
    ],
    // beforeEnter: (to, form, next) => {
    //   const authStore = useAuthStore();
    //   if (to.meta.requiresAuth && !authStore.isLogin) {
    //     authStore.checkSession();
    //     next('/auth');
    //   } else {
    //     next();
    //   }
    // },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.path !== '/auth') {
    await authStore.fetchUser();
  }
  const isLoggedIn = !!authStore.auth;
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/auth');
  }
  if (to.meta.guestOnly && isLoggedIn) {
    return next('/home');
  }
  return next();
});
export default router;
