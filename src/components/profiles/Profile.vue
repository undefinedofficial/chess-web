<template>
  <div
    class="flex flex-col relative justify-center p-6 shadow-md rounded-xl sm:px-12 bg-l-grey-light-3 dark:bg-d-black-2 dark:text-white"
  >
    <template v-if="user">
      <div class="w-40 h-40 mx-auto rounded-full dark:bg-gray-500 aspect-square">
        <img
          :src="user.avatar"
          :alt="user.nickname"
          class="object-cover h-full w-full rounded-full"
        />
      </div>

      <div class="space-y-4 text-center divide-y divide-gray-700">
        <div class="my-2 space-y-1">
          <h2
            class="text-xl font-semibold sm:text-xl max-w-[200px] w-max px-3 m-auto relative"
          >
            <template v-if="user.lastname && user.firstname">
              <p>{{ user.firstname }}</p>
              <p>{{ user.lastname }}</p>
            </template>
            <template v-else>
              <p>{{ user.nickname }}</p>
            </template>
            <span
              v-if="user.location"
              class="flag scale-75 block absolute -top-px -right-6"
              :class="'flag-' + user.location.toLowerCase()"
            ></span>
          </h2>
          <p v-if="Online || isSelf" class="px-5 text-xs sm:text-base dark:text-gray-400">
            <span v-if="isSelf">{{ user.email }}</span>
            <template v-else>
              Онлайн
              <span class="w-3 relative top-2">
                <span
                  class="animate-ping absolute h-3 w-3 rounded-full bg-c-success opacity-75"
                ></span>
                <span
                  class="inline-flex relative -top-1.5 rounded-full h-3 w-3 bg-c-success2"
                ></span>
              </span>
            </template>
          </p>
          <p v-else>
            {{ LastOnline }}
          </p>
        </div>
        <div class="mr-4 pt-2 text-left text-base w-full">
          <div class="flex justify-between font-bold text-lg">
            <span>Рейтинг: </span><span>{{ user.elo }}</span>
          </div>
          <div class="flex justify-between">
            <span>Выйграно: </span><span>{{ user.winBattle }}</span>
          </div>
          <div class="flex justify-between">
            <span>Проиграно: </span><span>{{ user.lossBattle }}</span>
          </div>
          <div class="flex justify-between">
            <span>Ничья: </span><span>{{ user.drawBattle }}</span>
          </div>
        </div>
      </div>
      <template v-if="isSelf">
        <b-button class="absolute top-5 left-5" @click="isSettings = true">
          <div class="hover:rotate-45 transition-transform">
            <b-icon class="mdi-cog"></b-icon>
          </div>
          <b-tooltip vertical="bottom">Настройки</b-tooltip>
        </b-button>
        <b-button
          class="absolute top-5 right-5 hover:text-c-danger transition-colors"
          @click="Logout"
        >
          <b-icon class="mdi-location-exit shadow-2xl"></b-icon>
          <b-tooltip class="border-c-danger" vertical="bottom"> Выход </b-tooltip>
        </b-button>
        <SettingsModal v-model="isSettings" />
      </template>
      <slot />
    </template>
    <template v-else>
      <RouterLink
        to="/signin"
        class="w-full text-center py-3 font-semibold rounded-md transition-colors bg-c-blue-control hover:bg-c-blue text-white"
        >Вход</RouterLink
      >
      <h5 class="text-center">Или</h5>
      <RouterLink
        to="/signup"
        class="w-full text-center py-3 font-semibold rounded-md transition-colors bg-c-success hover:bg-c-success2 text-white"
      >
        Регистрация
      </RouterLink>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from "vue";
import { RouterLink, useRouter } from "vue-router";

import SettingsModal from "@/components/Modals/SettingsModal.vue";

import { useUserStore } from "@/stores/UserStore";
import type { User } from "@/models/User.model";

const props = defineProps({
  user: { required: false },
});
const { user } = toRefs<{ user: User | undefined }>(props as any);

const router = useRouter();
const userStore = useUserStore();

const isSettings = ref(false);

const isSelf = computed(
  () => !userStore.user || !user.value || userStore.user.nickname === user.value.nickname
);

const Online = computed(() => {
  if (user.value) return user.value.lastOnline === true;
  return false;
});

const LastOnline = computed(() => {
  if (!user.value) return "";
  const now = new Date();
  const last = new Date(user.value.lastOnline as string);

  const offsetsec = Math.floor((now.getTime() - last.getTime()) / 1000);
  if (offsetsec === 0) return `Был в сети только что`;
  if (offsetsec < 60) return `Был в сети ${offsetsec.toFixed(0)} сек назад`;
  if (offsetsec < 3600)
    return `Был в сети ${Math.floor(offsetsec / 60).toFixed(0)} мин назад`;

  const time = last.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (now.getDay() - last.getDay() === 1) return `Заходил вчера в ${time}`;
  return `Заходил ${last.toLocaleDateString()} в ${time}`;
});

const Logout = () => {
  userStore.SignOut();
  router.push("/");
};
</script>
