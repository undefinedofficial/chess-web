<template>
  <div class="relative group px-3 flex">
    <div class="border-none my-auto w-full">
      <button
        type="button"
        class="flex w-full group border-inherit"
        @mousedown.stop="isOpen = !isOpen"
        @focus="isOpen = true"
        @keypress.esc="isOpen = false"
        @blur="isOpen = false"
      >
        <template v-if="Current">
          <i v-if="Current.icon" class="mdi mr-2" :class="Current.icon"></i>
          <h6 class="my-auto">{{ Current.label }}</h6>
        </template>
      </button>
    </div>
    <div
      class="absolute left-0 right-0 top-full z-10 border-inherit border border-t-0 bg-inherit rounded-b max-h-inherit overflow-auto"
      :class="inner"
      v-show="isOpen"
    >
      <button
        type="button"
        v-for="(item, i) in options"
        :key="i"
        class="flex w-full bg-inherit hover:brightness-95 dark:hover:brightness-150 py-1 text-left"
        :class="{
          'brightness-90 dark:brightness-150': Current
            ? item.value === Current.value
            : false,
        }"
        :disabled="item.isDisabled"
        @mousedown="emit('change', item.value)"
      >
        <i v-if="item.icon" class="mdi ml-3" :class="item.icon"></i>
        <p v-if="item.label" class="my-auto ml-2">{{ item.label }}</p>
      </button>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
export type Option = {
  icon?: string;
  label?: string;
  value: unknown;
  isDisabled?: boolean;
};

import { ref, toRefs, computed } from "vue";
const props = defineProps({
  inner: { type: String, default: "mt-px" },
  options: { type: Array, required: true },
  value: { required: true },
});
const { inner, options, value } = toRefs<{
  inner: string;
  options: Array<Option>;
  value: unknown;
}>(props as any);
const emit = defineEmits(["change"]);

const Current = computed(() => options.value.find((o) => o.value === value.value));

const isOpen = ref(false);
</script>
