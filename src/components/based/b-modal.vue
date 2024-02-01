<template>
  <teleport to="#app">
    <transition name="overlay">
      <div
        v-show="modelValue"
        class="fixed top-0 left-0 right-0 bottom-0 bg-c-overlay block z-40"
      ></div>
    </transition>

    <transition
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      :name="mode"
    >
      <section
        v-show="modelValue"
        role="dialog"
        @click.stop="OverlayClick"
        class="overlay-modal"
      >
        <div
          @click.stop
          :class="{ 'shake-animation': isShake }"
          class="flex flex-col w-full sm:max-w-2xl md:max-w-2xl rounded-xl bg-l-grey-light-3 text-c-grey dark:bg-d-black-2 dark:text-white space-x-1"
        >
          <header class="justify-self-start relative">
            <b-button
              v-if="isReturned"
              class="absolute left-3 top-2 px-2 bg-c-blue-15 hover:bg-c-blue rounded-lg h-[30px] transition-colors"
              @click="$emit('return')"
              ><i
                class="mdi mdi-transfer-left"
                style="font-size: 32px; line-height: 28px"
              ></i
            ></b-button>
            <slot name="header" />
            <b-button v-if="isClosable" class="absolute z-10 right-3 top-1" @click="Close"
              ><i class="mdi mdi-close mdi-24px hover:text-c-danger transition-colors"></i
            ></b-button>
          </header>
          <div class="justify-self-stretch h-full overflow-auto">
            <slot />
          </div>
          <footer class="justify-self-end"><slot name="footer" /></footer>
        </div>
      </section>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from "vue";

const props = defineProps({
  mode: { type: String, default: "zoom-in" },
  isReturned: { type: Boolean, default: false },
  isClosable: { type: Boolean, default: true },
  isRequired: { type: Boolean, default: true },

  modelValue: { type: Boolean, required: true },
});
const { isRequired, isClosable, isReturned } = toRefs(props);

const emit = defineEmits(["update:modelValue", "close"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emit("update:modelValue", value);
  },
});

const Close = () => {
  model.value = false;
  emit("close");
};

let isShake = ref(false);
const OverlayClick = () => {
  if (isRequired.value) {
    isShake.value = true;
    setTimeout(() => {
      isShake.value = false;
    }, 500);
  } else {
    Close();
  }
};
</script>

<style lang="scss" scoped>
.overlay-modal {
  @apply fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center;
  z-index: 60;
}

/* Overlay */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.5s;
}
.overlay-enter-from {
  opacity: 0;
}
.overlay-leave-to {
  opacity: 0;
  transition-delay: 0.2s;
}

/* Show Modal */
.bounce-enter-active {
  animation: bounce-in-right 0.5s ease;
}
@keyframes bounce-in-right {
  0% {
    opacity: 0;
    transform: translateY(2000px);
  }
  60% {
    opacity: 1;
    transform: translateY(-30px);
  }
  80% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Close modal */
.bounce-leave-active {
  animation: bounce-out 0.7s ease;
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
}

/* Reqired modal */
.shake-animation {
  animation: shake 0.5s ease;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  50%,
  90% {
    transform: translateX(-10px);
  }
  30%,
  70% {
    transform: translateX(10px);
  }
}

/* base modal transition class */
.modal-enter-active,
.modal-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}

// fade in scale effect
.fade-in-enter-from,
.fade-in-leave-to {
  transform: scale(0.7);
  opacity: 0;
}

// slide in scale effect
.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateY(20%);
  opacity: 0;
}
// slide up scale effect
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-20%);
  opacity: 0;
}
// zoom in scale effect
.zoom-in-enter-from,
.zoom-in-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>
