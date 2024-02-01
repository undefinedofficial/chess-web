<template>
  <div class="tooltip" :class="position">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs } from "vue";
import type { Horizontal, Vertical } from "@/models/Directions.model";

const props = defineProps({
  horizontal: { type: String, default: "auto" },
  vertical: { type: String, default: "auto" },
  wrap: { type: Boolean, default: false },
});

const { horizontal, vertical, wrap } = toRefs<{
  horizontal: Horizontal;
  vertical: Vertical;
  wrap: boolean;
}>(props as any);

const position = computed(() => {
  return `${vertical.value} ${horizontal.value} ${wrap.value ? "" : "whitespace-nowrap"}`;
});
</script>

<style lang="scss" scoped>
.tooltip {
  @apply inline-block;
  @apply absolute;
  @apply rounded;
  @apply border-l-4;
  @apply py-1;
  @apply px-3;
  @apply text-xs;
  @apply bg-c-overlay/80;
  @apply w-auto;
  @apply text-l-grey-light;

  pointer-events: none;
  opacity: 0;
  transform: rotateX(-60deg);
  transition: transform 200ms ease-in-out 0.1s, opacity 200ms ease-in-out 0.1s;
  transition-delay: 0.3s;
  z-index: 10;

  :not(:disabled):hover > &,
  &:not(:disabled):hover {
    pointer-events: all;
    opacity: 1;
    transition-delay: 0s;
    transform: scale(1) rotateX(0) translateX(50%);
  }
  &.top {
    bottom: 100%;
    transform-origin: bottom;
    &.auto {
      left: 50%;
      transform: translateX(-50%) rotateX(0);
    }
    &.left {
      left: 0;
      transform: rotateX(0);
    }
    &.right {
      right: 0;
      transform: rotateX(0);
    }
  }
  &.bottom {
    top: 100%;
    transform-origin: top;

    &.auto {
      left: 50%;
      transform: translateX(-50%) rotateX(0);
    }
    &.left {
      left: 0;
      transform: rotateX(0);
    }
    &.right {
      right: 0;
      transform: rotateX(0);
    }
  }
  &.left.auto {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
  }
  &.right.auto {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
  }
}
</style>
