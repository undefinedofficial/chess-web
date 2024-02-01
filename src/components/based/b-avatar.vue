<template>
  <div class="relative rounded-full aspect-square min-w-8 min-h-8">
    <img
      :alt="user.nickname"
      :src="user.avatar"
      class="object-cover rounded-full h-full w-full aspect-square"
    />
    <div v-if="user.location" class="absolute bottom-0 -right-2 h-6">
      <i class="block flag scale-75" :class="'flag-' + user.location.toLowerCase()"></i>
    </div>

    <b-tooltip v-if="tooltip" class="mx-2 border-c-blue" vertical="bottom" :wrap="false"
      >{{ user.firstname ? user.firstname : user.nickname }}
      <span class="text-sm" v-if="user.elo"> ({{ user.elo }})</span>
    </b-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from "vue";
import { useProfiles } from "@/hooks/profiles.hook";
import type { Profile } from "@/models/Profile.model";

const props = defineProps({
  nickname: { type: String, required: true },
  tooltip: { type: Boolean, default: false },
});
const { tooltip, nickname } = toRefs(props);

const emit = defineEmits(["onload"]);
const user = ref<Partial<Profile>>({
  nickname: "",
  firstname: "Гость",
  avatar: "/res/defaultman.png",
});
const LoadUser = async () => {
  if (nickname.value.indexOf("Guest") > -1) {
    emit("onload", user.value);
    return;
  }
  const profile = await useProfiles().LoadByNickName(nickname.value);
  if (profile) {
    user.value = profile;
    emit("onload", user.value);
  }
};

watch(nickname, LoadUser);
onMounted(LoadUser);
</script>
