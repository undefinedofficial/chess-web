<template>
  <b-modal v-model="model" @close="emit('close')" :isRequired="false">
    <div class="flex flex-col py-6 items-center text-center">
      <img
        class="p-1 m-auto"
        :class="{ 'dark:brightness-[10]': gamemode.mode < 100 }"
        width="140"
        height="140"
        :src="gamemode.avatar"
        :alt="gamemode.firstname"
      />
      <div class="mb-2">
        <h5 class="font-bold text-xl">
          {{ gamemode.firstname }}
          <span class="text-sm" v-if="gamemode.elo"> ({{ gamemode.elo }})</span>
        </h5>
        <p class="text-md">{{ gamemode.description }}</p>
      </div>
      <template v-if="isStarted">
        <b-chessloader class="mt-6"></b-chessloader>
        <h6 class="mt-3">{{ status }}</h6>
      </template>
      <template v-else>
        <h6 class="text-sm font-bold mt-2">Цвет ваших фигур</h6>
        <OrientationSwitch v-model="orientation" />
        <b-button
          @click="OnStart"
          class="m-auto px-16 py-3 rounded-md border border-c-success hover:bg-c-success transition-colors"
          ><b-icon class="mdi-game"></b-icon>
          <h6>Играть</h6></b-button
        >
      </template>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from "vue";
import OrientationSwitch from "../Navigate/OrientationSwitch.vue";

import type { Orientation } from "@/models/Orientation.model";
import type { GameMode } from "@/models/gamemode.model";

const props = defineProps({
  modelValue: Boolean,
  gamemode: { type: Object, required: true },
  status: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue", "start", "close"]);

const model = computed({
  get(): boolean {
    return props.modelValue;
  },
  set(value: boolean) {
    if (!value) isStarted.value = false;

    emit("update:modelValue", value);
  },
});
const { gamemode, status } = toRefs<{ gamemode: GameMode; status: string }>(props as any);

const orientation = ref<Orientation>("wb");

const isStarted = ref(false);
const OnStart = () => {
  isStarted.value = true;
  emit("start", gamemode.value, orientation.value);
};
</script>
