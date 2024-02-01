<template>
  <div
    class="inline-flex flex-col relative border-l-8 max-w-md gap-2 p-6 rounded-md shadow-md z-40 my-1 bg-gray-300 dark:bg-gray-900 dark:text-gray-100"
    :class="Type"
  >
    <button
      v-if="closable"
      class="absolute right-2 top-1 hover:text-c-danger"
      @click="$emit('close')"
    >
      <i class="mdi mdi-close"></i>
    </button>
    <div class="flex">
      <i v-if="icon" class="mdi mdi-36px mr-4" :class="icon"></i>
      <div class="w-full" :class="textAlign">
        <h4 class="gap-2 text-lg font-semibold leading-tight tracking-wide">
          {{ title }}
        </h4>
        <p class="dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-2 flex-row" v-if="feedback">
      <button
        class="px-6 py-2 rounded-lg bg-gray-400 dark:bg-d-black-2 hover:brightness-110 w-full sm:w-auto"
        @click="$emit('reject')"
      >
        Отклонить
      </button>
      <button
        class="px-6 py-2 rounded-lg shadow-sm bg-c-success hover:brightness-110 w-full sm:w-auto"
        @click="$emit('accept')"
      >
        Принять
      </button>
    </div>
    <div
      class="absolute left-0 bottom-0 border-b-2 border-inherit animate-progress"
      :style="{
        'animation-duration': duration + 's',
        'animation-direction': 'reverse',
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  icon: { type: String, required: false },
  textAlign: { type: String, default: "text-center" },
  type: { type: String, default: "none" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  duration: { type: Number, default: 5 },
  closable: { type: Boolean, default: true },
  feedback: { type: Boolean, default: false },
});

const { icon, textAlign, type, title, description, duration, closable, feedback } =
  toRefs(props);

const Type = computed(() => {
  switch (type.value) {
    case "info":
      return "border-c-info";
    case "warn":
      return "border-c-warning";
    case "error":
      return "border-c-danger2";
  }
  return "";
});
</script>
