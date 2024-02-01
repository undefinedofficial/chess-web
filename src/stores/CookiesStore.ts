import { ref } from "vue";
import { defineStore } from "pinia";

export const useCookiesStore = defineStore("CookiesStore", () => {
  const cookies = ref(localStorage.getItem("copolicy") ? true : false);
  const EnabledCookies = () => {
    cookies.value = true;
    localStorage.setItem("copolicy", "chesswood");
  };

  return {
    cookies,
    EnabledCookies,
  };
});
