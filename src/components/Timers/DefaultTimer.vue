<template>
  <div class="flex w-full h-full p-1.5 justify-start items-end">
    <slot />
    <h1
      class="mr-3 w-full self-center text-right font-bold text-4xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl"
      :class="timeStyle"
    >
      {{ timeToString }}
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";
const props = defineProps({
  timeStyle: { type: String, default: "" },
  ms: { type: Number, required: true },
});

const { ms, timeStyle } = toRefs(props);

const timeToString = computed(() => {
  if (ms.value < 1000) return "0:00:00";

  const sec_num = Math.floor(ms.value / 1000);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;

  return (
    hours +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
});
</script>
