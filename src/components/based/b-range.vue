<template>
  <fieldset class="space-y-1 dark:text-gray-100">
    <slot />
    <input
      type="range"
      class="w-full accent-blue-400"
      :min="min"
      :max="max"
      :step="step"
      v-model.number="modelValue"
    />
  </fieldset>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";

defineEmits(["update:modelValue"]);

const props = defineProps({
  min: { type: Number },
  max: { type: Number },
  step: { type: Number },

  modelValue: { type: Number, required: true },
});
const { min, max, step, modelValue } = toRefs(props);
</script>
