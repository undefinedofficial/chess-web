<template>
  <MainHeader />
  <div class="min-h-full min-w-full pt-14">
    <div class="container relative flex flex-col md:flex-row m-auto">
      <div class="h-full md:sticky top-20 p-3 w-full md:max-w-xs">
        <Profile class="md:flex-col" :user="User"></Profile>
      </div>

      <slot />

      <div class="h-full md:sticky mx-auto top-20 mt-4 p-3">
        <Card class="w-64 pt-4 font-sans text-xl">
          <div class="flex">
            <i class="mdi mdi-account-badge"></i>
            <p class="ml-3 mr-auto">Онлайн</p>
            <span class="text-md">{{ telemetryStore.Users }}</span>
          </div>
          <div class="flex">
            <i class="mdi mdi-checkerboard"></i>
            <p class="ml-3 mr-auto">Партий</p>
            <span class="text-md">{{ telemetryStore.Parts }}</span>
          </div>
          <div class="flex">
            <i class="mdi mdi-account-group"></i>
            <p class="ml-3 mr-auto">Играют</p>
            <span class="text-md">{{ telemetryStore.Players }}</span>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from "vue";
import MainHeader from "@/components/headers/MainHeader.vue";
import Profile from "@/components/profiles/Profile.vue";
import Card from "@/components/Card.vue";
import { useUserStore } from "@/stores/UserStore";

import { useTelemetryStore } from "@/stores/TelemetryStore";

const userStore = useUserStore();
const User = computed(() => userStore.user);

const telemetryStore = useTelemetryStore();

onMounted(() => {
  telemetryStore.Subscribe();
});
onUnmounted(() => {
  telemetryStore.Unsubscribe();
});
</script>
