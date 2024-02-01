<template>
  <b-modal v-model="model" :isRequired="false" mode="slide-up">
    <div class="mr-1 mb-1 lg:p-6">
      <h1 class="text-center text-xl m-1">Настройки шахматной доски</h1>
      <div class="h-px bg-gray-700 my-2"></div>
      <div class="flex flex-col sm:flex-row max-h-96 overflow-y-auto">
        <div class="px-2 h-[340px] w-full md:w-3/4 aspect-square">
          <!-- board -->
          <component
            v-if="model"
            class="w-full h-[340px]"
            :is="ChessBoardComponent"
            ref="chessboard"
            :rects="[]"
            :arrows="[]"
            :circles="[]"
            fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            orientation="w"
            :duration="settings.duration"
            :white="settings.whiteColor"
            :black="settings.blackColor"
            :alphapiece="settings.alphapiece"
          />
        </div>
        <div class="p-1 w-full md:w-1/2 space-y-6">
          <div class="flex space-x-5 items-center justify-between">
            <p>Стиль доски</p>
            <b-switch
              class="dark:bg-d-black rounded-md w-24"
              :values="[
                {
                  icon: 'mdi mdi-video-2d text-2xl',
                  value: 'Plane',
                },
                {
                  icon: 'mdi mdi-video-3d text-2xl',
                  value: 'Perspective',
                },
              ]"
              v-model="settings.type"
            />
          </div>
          <template v-if="settings.type === 'Plane'">
            <div class="flex space-x-5 items-center justify-between">
              <p>Белых клетки</p>
              <b-switch
                class="dark:bg-d-black rounded-md w-24"
                :values="[
                  {
                    icon: 'block mx-auto my-2 h-4 w-4 bg-[#dee3e6]',
                    value: '#dee3e6',
                  },
                  {
                    icon: 'block mx-auto my-2 h-4 w-4 bg-[#f0d9b5]',
                    value: '#f0d9b5',
                  },
                  {
                    icon: 'block mx-auto my-2 h-4 w-4 bg-[#ececec]',
                    value: '#ececec',
                  },
                ]"
                v-model="settings.whiteColor"
              />
            </div>
            <div class="flex space-x-5 items-center justify-between">
              <p>Черные клетки</p>
              <b-switch
                class="dark:bg-d-black rounded-md w-24"
                :values="[
                  {
                    icon: 'block mx-auto my-2 h-4 w-4 bg-[#8ca2ad]',
                    value: '#8ca2ad',
                  },
                  {
                    icon: 'block mx-auto my-2 h-4 w-4 bg-[#b58863]',
                    value: '#b58863',
                  },
                  {
                    icon: 'block mx-auto my-2 h-4 w-4 bg-[#514d4a]',
                    value: '#514d4a',
                  },
                ]"
                v-model="settings.blackColor"
              />
            </div>
          </template>
          <div class="flex space-x-5 items-center">
            <p>Скорость анимации в мс</p>
            <b-switch
              class="dark:bg-d-black rounded-md w-40 h-8 pt-1"
              :values="[
                {
                  label: '0',
                  value: 0,
                },
                {
                  label: '100',
                  value: 100,
                },
                {
                  label: '200',
                  value: 200,
                },
              ]"
              v-model="settings.duration"
            />
          </div>
          <div class="flex space-x-5 items-center">
            <p>Фантомная фигура</p>
            <b-toggle class="dark:bg-d-black rounded-md" v-model="settings.alphapiece" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { useUserStore } from "@/stores/UserStore";
import type { BoardsSettings } from "@/models/BoardsSettings.model";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const { Board, ChangeBoard } = useUserStore();

const settings = ref<BoardsSettings>(Object.assign({}, Board));

const ChessBoardComponent = computed(() => {
  if (settings.value.type === "Perspective") {
    return defineAsyncComponent(() => import(`@/boards/PerspectiveBoard.vue`));
  } else {
    return defineAsyncComponent(() => import(`@/boards/PlaneBoard.vue`));
  }
});

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    if (value === false) ChangeBoard(settings.value);
    emit("update:modelValue", value);
  },
});
</script>
