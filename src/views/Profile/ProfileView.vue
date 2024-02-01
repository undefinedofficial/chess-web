<template>
  <MainHeader />
  <div class="min-h-full min-w-full">
    <div class="container relative flex flex-col md:flex-row m-auto">
      <div class="h-full md:sticky top-20 p-3 w-full md:max-w-xs">
        <vprofile class="md:flex-col" :user="User" v-cloak></vprofile>
      </div>

      <div class="h-full flex items-center justify-center my-auto w-full pt-2 p-6">
        Здесь пока нечего нет.
      </div>

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
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Card from "@/components/Card.vue";
import vprofile from "@/components/profiles/Profile.vue";
import MainHeader from "@/components/headers/MainHeader.vue";

import type { Profile } from "@/models/Profile.model";
import { useUserStore } from "@/stores/UserStore";
import { useProfiles } from "@/hooks/profiles.hook";
import { useTelemetryStore } from "@/stores/TelemetryStore";

const userStore = useUserStore();

const route = useRoute();
const router = useRouter();
const User = ref<Partial<Profile>>({});

const LoadProfile = async () => {
  const from = route.redirectedFrom;
  const to = route;

  if (
    userStore.user &&
    (route.path === "/me" || route.path === "/" + userStore.user?.nickname)
  ) {
    User.value = userStore.user;
    return;
  }

  if (to.params.nickname) {
    if (from && to.params.nickname === from.params.nickname) return;

    const profile = await useProfiles().LoadByNickName(to.params.nickname as string);
    if (profile) {
      User.value = profile;
      return;
    }
    router.push({ name: "not found" });
  }
};
router.afterEach(LoadProfile);
onBeforeMount(LoadProfile);

const telemetryStore = useTelemetryStore();

onMounted(() => {
  telemetryStore.Subscribe();
});
onUnmounted(() => {
  telemetryStore.Unsubscribe();
});
</script>
