<template>
  <div class="flex justify-center h-8 bg-l-grey-light-3 dark:bg-d-black-2 space-x-4">
    <b-button class="relative px-1 hover:bg-c-success" @click="emit('rotate')">
      <b-tooltip class="border-x-c-success" vertical="top">Развернуть доску</b-tooltip>
      <i class="mdi mdi-rotate-3d-variant text-2xl"></i>
    </b-button>
    <b-button
      class="relative px-1 hover:bg-c-warning transition-all"
      :class="{
        'bg-c-warning': confirmBackStep,
        'scale-125 z-10 bg-c-warning rounded-lg': isbackreq,
      }"
      :disabled="!isback || isbackreq"
      @click="BackStep"
    >
      <b-tooltip class="border-x-c-warning" vertical="top">{{
        confirmBackStep ? "Нажмите чтобы подтвердить" : "Попросить вернуть ход"
      }}</b-tooltip>
      <i class="mdi mdi-arrow-u-left-top-bold text-2xl"></i>
    </b-button>
    <b-button
      class="relative px-1 hover:bg-c-danger2"
      :class="{
        'bg-c-danger2': confirmLossing,
      }"
      :disabled="!isloss"
      @click="Lossing"
    >
      <b-tooltip class="border-x-c-danger" vertical="top">{{
        confirmLossing
          ? "Нажмите чтобы подтвердить"
          : "Сдаться.\nПобеда будет засчитана сопернику"
      }}</b-tooltip>
      <i class="mdi mdi-flag text-2xl"></i>
    </b-button>
    <b-button
      class="relative px-2 text-2xl hover:bg-c-warning transition-all"
      :class="{
        'bg-c-warning': confirmDrawing,
        'scale-125 z-10 bg-c-warning rounded-lg': isdrawreq,
      }"
      :disabled="!isdraw || isdrawreq"
      @click="Drawing"
    >
      <b-tooltip class="border-c-warning" vertical="top">{{
        confirmDrawing ? "Нажмите чтобы подтвердить" : "Предложить ничью"
      }}</b-tooltip>
      ½
    </b-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  isback: { type: Boolean, default: true },
  isdraw: { type: Boolean, default: true },
  isloss: { type: Boolean, default: true },

  isbackreq: { type: Boolean, default: false },
  isdrawreq: { type: Boolean, default: false },
});

const emit = defineEmits(["rotate", "back", "loss", "draw"]);

let hConfirm: any;
const Confirmation = (rejectCallback: () => void) => {
  hConfirm = setTimeout(rejectCallback, 5000);
};
const confirmBackStep = ref(false);
const BackStep = () => {
  if (confirmBackStep.value) {
    emit("back");
    confirmBackStep.value = false;
  } else {
    confirmBackStep.value = true;
    Confirmation(() => {
      confirmBackStep.value = false;
    });
  }
};
const confirmLossing = ref(false);
const Lossing = () => {
  if (confirmLossing.value) {
    emit("loss");
    confirmLossing.value = false;
  } else {
    confirmLossing.value = true;
    Confirmation(() => {
      confirmLossing.value = false;
    });
  }
};
const confirmDrawing = ref(false);
const Drawing = () => {
  if (confirmDrawing.value) {
    emit("draw");
    confirmDrawing.value = false;
  } else {
    confirmDrawing.value = true;
    Confirmation(() => {
      confirmDrawing.value = false;
    });
  }
};
</script>
