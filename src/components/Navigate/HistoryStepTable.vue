<template>
  <div class="overflow-hidden h-full pb-[4.5rem]">
    <div class="flex w-full">
      <div class="border-b-[1px] border-b-d-gray-3 gap-0 w-full pb-1">
        <img
          src="@/assets/piece_king_icon.svg"
          class="h-6 mx-auto invert"
          alt="white king piece"
        />
      </div>
      <div class="border-b-[1px] border-b-d-gray-3 gap-0 w-full pb-1 text-center">
        <img
          src="@/assets/piece_king_icon.svg"
          class="h-6 mx-auto"
          alt="black king piece"
        />
      </div>
    </div>
    <div ref="steplist" class="min-h-full max-h-full overflow-auto">
      <transition-group tag="div" name="history" class="relative grid grid-cols-2 px-1">
        <div key="numbers" class="absolute left-0 top-0">
          <div
            v-for="i in Math.round((history ? history.length : 0) / 2)"
            :key="i"
            class="border-b-2 border-transparent h-9 p-2 bg-l-grey-3 dark:bg-d-black"
          >
            {{ i }}.
          </div>
        </div>
        <div
          v-for="(step, i) in history"
          :key="i"
          class="border-b-2 border-l-grey-3 dark:border-d-black hover:bg-c-blue hover:text-l-grey-light gap-0 text-[22px] h-9 text-center transition-colors"
          :class="{
            'bg-c-blue text-l-grey-light': i === activeindex,
          }"
          @click="emit('step-click', step, i)"
          @mouseenter="emit('step-enter', step, i)"
          @mouseleave="emit('step-leave', step, i)"
        >
          <span class="font-chess"> {{ step.san }}</span>
        </div>
        <div
          key="end-status"
          v-if="Status !== undefined"
          class="p-1 min-h-[100px] mt-[20px] text-center transition-colors col-span-2 italic"
        >
          <i class="mdi text-3xl" :class="'mdi-' + Status.icon"></i>
          <p>{{ Status.label }}</p>
          <h6>{{ Status.desc }}</h6>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, toRefs, watch } from "vue";
import { ROOMSTATUS, type Move } from "@/models/Roomdata.model";

const props = defineProps({
  history: { type: Array, required: true },
  status: { type: Number, default: 0 },
  activeindex: { type: Number, default: 0 },
});
const { history, status, activeindex } = toRefs<{
  history: Array<Move>;
  status: ROOMSTATUS;
  activeindex: number;
}>(props as any);
const emit = defineEmits(["step-click", "step-enter", "step-leave"]);

const steplist = ref<HTMLElement | null>(null);

watch(
  history,
  () => {
    /**
     * Auto scroll to down
     */
    nextTick(() => {
      if (steplist.value) steplist.value.scrollTop = steplist.value.scrollHeight + 9999;
      else console.warn("no step list");
    });
  },
  { deep: true }
);

const Status = computed<
  | undefined
  | {
      icon: string;
      label: string;
      desc: string;
    }
>(() => {
  switch (status.value) {
    case ROOMSTATUS.PREMIERE:
      return { icon: "emoticon-sad", label: "Партия", desc: "Не началась" };
    case ROOMSTATUS.PROCESSED:
      return undefined;
    case ROOMSTATUS.WHITE_WIN:
      return { icon: "crown", label: "Победа белых", desc: "1-0" };
    case ROOMSTATUS.BLACK_WIN:
      return { icon: "crown", label: "Победа черных", desc: "0-1" };
    case ROOMSTATUS.WHITE_SURRENDER:
      return { icon: "flag-variant", label: "Белые предпочли сдаться", desc: "0-1" };
    case ROOMSTATUS.BLACK_SURRENDER:
      return { icon: "flag-variant", label: "Черные предпочли сдаться", desc: "1-0" };
    case ROOMSTATUS.STALEMATE:
      return { icon: "handshake", label: "Ничья", desc: "½-½" };
    case ROOMSTATUS.STALEMATE_SURRENDER:
      return { icon: "handshake", label: "Ничья по согласию", desc: "½-½" };
  }
});
</script>

<style scoped>
.history-enter-active {
  animation: slide-up 0.5s;
}
.history-leave-active {
  animation: slide-up 0.5s reverse;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(100%);
    border-bottom-color: rgba(0, 0, 0, 0);
  }
  70% {
    opacity: 0;
    border-bottom-color: rgba(0, 0, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
