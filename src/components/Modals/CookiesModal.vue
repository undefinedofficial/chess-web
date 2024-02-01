<template>
  <transition name="slide-down">
    <div
      v-if="!cookiesStore.cookies"
      class="fixed w-full min-h-32 p-4 bottom-0 bg-l-grey-light-3 dark:bg-d-black-2 dark:text-white border-c-success border-t flex flex-col justify-center items-center text-center"
    >
      <p class="text-lg">Мы используем файлы cookies для улучшения работы сайта.</p>
      <p>
        Оставаясь на нашем сайте, вы соглашаетесь с условиями использования файлов
        cookies.
      </p>
      <b-button
        @click="cookiesStore.EnabledCookies"
        class="bg-c-success hover:bg-c-success2 transition-colors mt-2 rounded px-4 py-2"
        >Я согласен</b-button
      >
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useCookiesStore } from "@/stores/CookiesStore";

const cookiesStore = useCookiesStore();
</script>

<style scoped>
.slide-down-enter-active {
  animation: slide-down 0.5s reverse;
}
.slide-down-leave-active {
  animation: slide-down 0.5s;
}

@keyframes slide-down {
  100% {
    transform: translateY(100%);
  }
}
</style>
