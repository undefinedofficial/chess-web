<template>
  <MainHeader />
  <div class="min-h-full min-w-full pt-16">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import MainHeader from "@/components/headers/MainHeader.vue";
</script>
