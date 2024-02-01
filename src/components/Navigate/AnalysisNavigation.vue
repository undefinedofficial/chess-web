<template>
  <div class="h-16 bg-l-grey-light-3 dark:bg-d-black-2">
    <div class="flex justify-center">
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('backward')">
        <b-tooltip class="border-x-c-success" vertical="top">В начало</b-tooltip>
        <i class="mdi mdi-skip-backward text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('back')">
        <b-tooltip class="border-x-c-success" vertical="top">Назад</b-tooltip>
        <i class="mdi mdi-skip-previous text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('play-back')">
        <b-tooltip class="border-x-c-success" vertical="top">Проиграть назад</b-tooltip>
        <i class="mdi mdi-play mdi-flip-h text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('pause')">
        <b-tooltip class="border-x-c-success" vertical="top">Пауза</b-tooltip>
        <i class="mdi mdi-pause text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('play-next')">
        <b-tooltip class="border-x-c-success" vertical="top">Проиграть вперед</b-tooltip>
        <i class="mdi mdi-play text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('next')">
        <b-tooltip class="border-x-c-success" vertical="top" sticky="right"
          >Вперед</b-tooltip
        >
        <i class="mdi mdi-skip-next text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('forward')">
        <b-tooltip class="border-x-c-success" vertical="top" sticky="right"
          >В конец</b-tooltip
        >
        <i class="mdi mdi-skip-forward text-2xl"></i>
      </b-button>
    </div>
    <div class="flex justify-center border-t space-x-4 border-t-gray-600">
      <b-button class="relative px-1 hover:bg-c-danger2" @click="emit('exit')">
        <b-tooltip class="border-x-c-danger" vertical="top">Выход</b-tooltip>
        <i class="mdi mdi-location-exit mdi-flip-h text-2xl"></i>
      </b-button>
      <b-button class="relative px-1 hover:bg-c-success" @click="emit('rotate')">
        <b-tooltip class="border-x-c-success" vertical="top">Развернуть доску</b-tooltip>
        <i class="mdi mdi-rotate-3d-variant text-2xl"></i>
      </b-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits([
  "exit",
  "rotate",
  "backward",
  "back",
  "play-back",
  "pause",
  "play-next",
  "next",
  "forward",
]);
</script>
