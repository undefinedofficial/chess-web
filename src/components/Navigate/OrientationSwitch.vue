<template>
  <div class="flex space-x-4 w-full justify-center mb-3">
    <div
      class="rounded-lg my-4 p-2 bg-l-grey-light dark:bg-d-black border border-transparent hover:border-c-blue transition-all"
      :class="{ 'scale-125': 'w' === model }"
      @click="model = 'w'"
    >
      <img src="@/assets/piece_king_icon.svg" height="64" width="64" class="m-1 invert" />
    </div>
    <div
      class="rounded-lg my-4 p-2 bg-l-grey-light dark:bg-d-black border border-transparent hover:border-c-blue transition-all"
      :class="{ 'scale-125': 'wb' === model }"
      @click="model = 'wb'"
    >
      <img
        src="@/assets/piece_king_half.svg"
        height="72"
        width="72"
        class="m-1 scale-125"
      />
    </div>
    <div
      class="rounded-lg my-4 p-2 bg-l-grey-light dark:bg-d-black border border-transparent hover:border-c-blue transition-all"
      :class="{ 'scale-125': 'b' === model }"
      @click="model = 'b'"
    >
      <img src="@/assets/piece_king_icon.svg" height="64" width="64" class="m-1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get(): string {
    return props.modelValue;
  },
  set(value: string) {
    emit("update:modelValue", value);
  },
});
</script>
