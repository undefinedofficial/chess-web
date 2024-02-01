<template>
  <b-avatar
    :nickname="id"
    @onload="OnLoadUser"
    :tooltip="false"
    :class="avatarclass"
    class="h-full w-fit"
  />
  <div class="ml-1 mt-auto mb-1 pt-4">
    <h6 class="font-bold leading-3 whitespace-pre">
      <template v-if="user.firstname">
        {{ user.firstname }}
      </template>
      <template v-else>
        {{ user.nickname }}
      </template>
      <span class="text-sm" v-if="user.elo">({{ user.elo }})</span>
    </h6>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import type { Profile } from "@/models/Profile.model";

const props = defineProps({
  id: { type: String, required: true },
  avatarclass: { type: String, default: "" },
});
const { id, avatarclass } = toRefs(props);

const user = ref<Partial<Profile>>({});
const OnLoadUser = (u: Profile) => {
  user.value = u;
};
</script>
