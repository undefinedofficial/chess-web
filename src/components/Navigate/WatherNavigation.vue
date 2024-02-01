<template>
  <div class="flex justify-center h-8 bg-l-grey-light-3 dark:bg-d-black-2 space-x-4">
    <b-button class="relative px-1 hover:bg-c-danger2" @click="emit('exit')">
      <b-tooltip class="border-x-c-danger" vertical="top">Выход</b-tooltip>
      <i class="mdi mdi-location-exit mdi-flip-h text-2xl"></i>
    </b-button>
    <b-button class="relative px-1 hover:bg-c-success" @click="emit('rotate')">
      <b-tooltip class="border-x-c-success" vertical="top">Развернуть доску</b-tooltip>
      <i class="mdi mdi-rotate-3d-variant text-2xl"></i>
    </b-button>
    <b-button class="relative px-1 hover:bg-c-success" @click="emit('analyse')">
      <b-tooltip class="border-x-c-success" vertical="top">Анализ партии</b-tooltip>
      <i class="mdi mdi-microscope text-2xl"></i>
    </b-button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["exit", "rotate", "analyse"]);
</script>
