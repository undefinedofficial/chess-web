<template>
  <div class="w-full h-full flex flex-col justify-center">
    <i class="mdi mx-auto -mt-28 mb-5 text-[150px] text-c-success" :class="icon"></i>
    <h1 class="text-2xl mx-auto">{{ label }}</h1>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icon: { type: String, default: "mdi-check-circle" },
  label: { type: String, default: "" },
});
</script>
