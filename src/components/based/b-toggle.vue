<template>
  <div
    class="relative h-6 cursor-pointer rounded-full aspect-video"
    @click="model = !model"
  >
    <div
      class="absolute top-px left-px bottom-px w-1/2 rounded-full transition-transform"
      :class="model ? 'bg-c-success' : 'bg-c-danger'"
      :style="{
        transform: 'translateX(' + (model ? 100 : 0) + '%)',
      }"
    ></div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
