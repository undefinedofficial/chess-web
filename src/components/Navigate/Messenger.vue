<template>
  <div class="block relative w-full h-full my-auto p-2 rounded-xl">
    <div
      class="flex items-center p-2 w-full text-center border-b-2 border-b-l-grey-light dark:border-b-d-black"
    >
      <div class="w-full">
        <slot name="header" />
      </div>
      <b-toggle
        class="justify-self-end rounded-lg bg-l-grey-light dark:bg-d-black"
        v-model="isActive"
      >
        <b-tooltip
          class="mx-2"
          :class="isActive ? 'border-c-success' : 'border-c-danger'"
          vertical="bottom"
          :wrap="false"
        >
          {{ isActive ? "От" : "В" }}ключить чат
        </b-tooltip>
      </b-toggle>
    </div>
    <div class="w-full h-full pb-28">
      <transition-group
        v-show="messages.length && isActive"
        ref="history"
        name="list"
        tag="div"
        class="h-full text-base overflow-auto"
      >
        <div
          class="flex w-full my-2 relative"
          v-for="(message, i) in messages"
          :key="i"
          :class="{ 'justify-end': message.isSelf }"
        >
          <div
            class="relative inline-block py-1 px-5 rounded-xl cursor-default"
            :class="
              message.isSelf
                ? 'bg-c-blue text-l-grey-light-3'
                : 'bg-l-grey-light dark:bg-d-black'
            "
            style="overflow-wrap: anywhere"
          >
            {{ message.body }}
          </div>
        </div>
      </transition-group>

      <div
        v-show="!isActive"
        class="w-full h-full flex justify-center items-center text-2xl"
      >
        <h4>Чат отключен</h4>
      </div>
      <div
        v-show="!messages.length && isActive"
        class="w-full h-full flex flex-col justify-center items-center text-xl"
      >
        <h4>Пусто</h4>
        <p>Напишите первым!</p>
      </div>
    </div>
    <div v-if="isActive" class="absolute bottom-1 left-1 right-1 h-10 flex">
      <!-- <Button class="btn-call-video" @click="$emit('video-call')">
        <i class="mdi mdi-camera"></i>
      </Button>
      <Button class="btn-call-audio" @click="$emit('audio-call')">
        <i class="mdi mdi-microphone"></i>
      </Button> -->
      <input
        type="text"
        name="message"
        v-model="msg"
        placeholder="Напишите сообщение..."
        autocomplete="off"
        :disabled="disabled"
        class="bg-l-grey-light dark:bg-d-black p-2 pr-12 w-full rounded-xl outline-none focus:placeholder:text-d-black dark:focus:placeholder:text-white transition-colors disabled:pointer-events-none disabled:brightness-75"
        @keyup.enter="onSend()"
      />
      <b-button
        v-show="msg.trim().length > 0 && !disabled"
        class="absolute right-0 top-[-4px] h-12 w-12 rounded-full p-1 bg-c-blue hover:bg-c-blue-control text-l-grey-light-3 transition-colors disabled:pointer-events-none"
        @click="onSend"
      >
        <i class="mdi text-2xl mdi-send"></i>
      </b-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, toRefs, watch } from "vue";
import type { Message } from "@/models/Roomdata.model";

import PushUpSnd from "@/assets/sounds/push_up.mp3";
import PopUpSnd from "@/assets/sounds/pop_up.mp3";

const PushUp = new Audio(PushUpSnd);
const PopUp = new Audio(PopUpSnd);

const props = defineProps({
  messages: { type: Array, required: true },
  disabled: { type: Boolean, default: false },
});
const { messages, disabled } = toRefs<{
  messages: Array<Message>;
  disabled: boolean;
}>(props as any);
const emit = defineEmits(["send"]);

const history = ref<{ $el: HTMLElement } | null>(null);

const msg = ref("");
const isActive = ref(true);

watch(
  messages,
  (value) => {
    if (!isActive || value.length === 0) return;

    if (!value[value.length - 1].isSelf) PushUp.play();
    else PopUp.play();
    nextTick(() => {
      /**
       * Auto scroll to down
       */
      if (history.value) {
        const container = history.value.$el;
        container.scrollTop = container.scrollHeight + 100;
      }
    });
  },
  { deep: true }
);

const onSend = () => {
  emit("send", msg.value.trim());
  msg.value = "";
};
</script>

<style>
.list-enter-active {
  animation: bounce-in 0.5s;
}
.list-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
