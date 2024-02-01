<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <div v-show="!isConfimed && !isBadConfimed">
      <b-loader class="min-h-[150px] min-w-[150px] mb-20 text-c-success" />
      <h1 class="text-2xl mx-auto mt-0 mb-auto">Подтверждение аккаунта</h1>
    </div>
    <div class="flex flex-col" v-show="isConfimed">
      <i class="mdi mdi-bookmark-check mx-auto mt-auto text-[150px] text-c-success"></i>
      <h1 class="text-3xl mx-auto mb-auto">Добро пожаловать!</h1>
    </div>
    <div class="flex flex-col" v-show="isBadConfimed">
      <i class="mdi mdi-close-circle mx-auto mb-5 text-[150px] text-c-danger"></i>
      <h1 class="text-3xl mx-auto mb-auto">
        К сожалению ваш аккаунт<br />
        подтвердить не удалось
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isConfimed = ref(false);
const isBadConfimed = ref(false);
onMounted(async () => {
  const hash = route.params.hash as string;
  if (hash) {
    if (await userStore.Confirm(hash)) {
      isConfimed.value = true;
      isBadConfimed.value = false;
    } else {
      isConfimed.value = false;
      isBadConfimed.value = true;
    }
  }
  setTimeout(() => {
    router.push({ name: "home" });
  }, 1000);
});
</script>
