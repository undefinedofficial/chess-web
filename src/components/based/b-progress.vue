<template>
  <div class="w-full rounded-full dark:bg-gray-700">
    <div
      class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-size"
      :style="{ width: Persent }"
    >
      {{ Persent }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  value: { type: Number, required: true },
});
const { value } = toRefs(props);

const Persent = computed(() => value.value.toFixed(0) + "%");
</script>
