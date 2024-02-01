<template>
  <div>
    <div ref="captcha" style="height: 100px"></div>
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";

const sitekey = import.meta.env.VITE_VUE_APP_SMARTRECAPTCHA_KEY;
const captcha = ref<HTMLElement | null>(null);

const emit = defineEmits(["change"]);

onMounted(() => {
  const s = document.createElement("script");
  s.setAttribute("src", "https://captcha-api.yandex.ru/captcha.js");
  s.defer = true;
  s.onload = () => {
    const smartCaptcha = (window as any).smartCaptcha;
    if (smartCaptcha) {
      smartCaptcha.render(captcha.value, {
        sitekey,
        callback: (token: string) => {
          emit("change", token);
        },
      });
    }
  };
  document.body.appendChild(s);
});
</script>
