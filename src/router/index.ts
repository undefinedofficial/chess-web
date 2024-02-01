import { createRouter, createWebHistory } from "vue-router";

import NotFound from "@/views/NotFoundView.vue";
import { useUserStore } from "@/stores/UserStore";

const title = document.title;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { title, layout: "Profile", ws: true },
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/signin",
      name: "signin",
      meta: { title: "Вход в Chesswood" },
      component: () => import("@/views/Account/SignInView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      meta: { title: "Регистрация на Chesswood" },
      component: () => import("@/views/Account/SignUpView.vue"),
    },
    {
      path: "/forgotpassword",
      name: "forgot",
      meta: { title: "Забыл пароль от Chesswood" },
      component: () => import("@/views/Account/ForgotPassword.vue"),
    },
    {
      path: "/resetpassword/:hash",
      name: "resetpassword",
      meta: { title: "Сброс пароля на Chesswood" },
      component: () => import("@/views/Account/ResetPassword.vue"),
    },
    {
      path: "/confirm/:hash",
      name: "confirm",
      meta: { title: "Подтверждение аккаунта на Chesswood" },
      component: () => import("@/views/Account/ConfirmView.vue"),
    },
    {
      path: "/confirmnew/:hash",
      name: "confirmNewEmail",
      meta: { title: "Смена почты на Chesswood" },
      component: () => import("@/views/Account/ConfirmView.vue"),
    },
    {
      path: "/about",
      name: "about",
      meta: { title: "О Chesswood", ws: true },
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/r/:id",
      name: "chess",
      meta: { title: "Шахматы Chesswood", layout: "Main", ws: true },
      component: () => import("@/views/ChessView.vue"),
    },
    {
      path: "/analyse",
      name: "analyse",
      meta: { title: "Анализировать партию на Chesswood", layout: "Main" },
      component: () => import("@/views/AnalysisView.vue"),
    },
    {
      path: "/me",
      name: "me",
      meta: { title: "Шахматы Chesswood", layout: "Main", isAuth: true, ws: true },
      component: () => import("@/views/Profile/ProfileView.vue"),
    },
    {
      path: "/:nickname",
      name: "profile",
      meta: { title: "Профиль Chesswood", layout: "Main", ws: true },
      component: () => import("@/views/Profile/ProfileView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not found",
      meta: { title: "Не найдено на Chesswood" },
      component: NotFound,
    },
  ],
});
router.beforeEach((to, from, next) => {
  let hasUser = !!useUserStore().token;
  /* Not route auth user to sign in and sign up */
  if ((to.path === "/signin" || to.path === "/signup") && hasUser) {
    return next("/");
  }
  if (to.meta.isAuth && !hasUser) {
    return next("/signin");
  }
  next();
});
router.afterEach((to) => {
  document.title = to.meta.title || title;
});
export default router;
