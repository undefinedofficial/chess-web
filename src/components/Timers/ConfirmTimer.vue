<template>
  <div
    v-if="count > 0"
    class="flex w-full justify-end px-5"
    :class="isDoubleDigit ? 'bg-c-success' : 'bg-c-danger'"
  >
    <span class="font-bold self-end mx-1 text-xl">
      {{ formatTime }}
    </span>
    <span class="self-center">сек. на первый ход</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  count: { type: Number, required: true },
});
const { count } = toRefs(props);

const isDoubleDigit = computed((): boolean => {
  return count.value > 9999;
});
/**
 * format count to 10 format 0.0
 */
const formatTime = computed((): string => {
  if (isDoubleDigit.value) return (count.value / 1000).toString().substring(0, 2);
  return (count.value / 1000).toFixed(1).toString();
});
</script>
