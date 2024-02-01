<template>
  <b-modal v-model="model" :isClosable="true" :isReturned="false">
    <template #header>
      <div class="mx-2 py-1">
        <slot name="header">
          <h3
            v-if="status === 1"
            class="text-3xl mt-3 text-center text-yellow-500 dark:text-yellow-300"
          >
            Победа!
          </h3>
          <h3 v-else-if="status === 2" class="text-3xl mt-3 text-center text-c-danger">
            Поражение!
          </h3>
          <h3 v-else class="text-3xl mt-3 text-center text-c-success">Ничья!</h3>
        </slot>
      </div>
      <div class="flex flex-col xs:flex-row justify-around" v-if="whiteelo">
        <div class="flex flex-col space-y-5">
          <div class="h-32 w-32 mx-auto text-center space-y-2">
            <SmallProfile :id="whiteid" />
          </div>
          <div class="w-40 flex text-lg pt-4">
            <p>Рейтинг</p>
            <p class="text-right w-full">{{ whiteelo }}</p>
            <span v-if="whitescore < 0" class="text-sm mx-1 text-c-danger">
              {{ whitescore }}
            </span>
            <span v-else-if="whitescore > 0" class="text-sm mx-1 text-c-success">
              +{{ whitescore }}
            </span>
          </div>
        </div>
        <div class="flex flex-col space-y-5">
          <div class="h-32 w-32 mx-auto text-center space-y-2">
            <SmallProfile :id="blackid" />
          </div>
          <div class="w-40 flex text-lg pt-4">
            <p>Рейтинг</p>
            <p class="text-right w-full">{{ blackelo }}</p>

            <span v-if="blackscore < 0" class="text-sm mx-1 text-c-danger">
              {{ blackscore }}
            </span>
            <span v-else-if="blackscore > 0" class="text-sm mx-1 text-c-success">
              +{{ blackscore }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-around py-8">
        <RouterLink
          to="/"
          class="py-2 px-8 rounded-md bg-c-blue-control hover:bg-c-blue text-white transition-colors"
        >
          <b-icon class="mdi-home" />На главную
        </RouterLink>
        <!-- <b-button
          class="py-2 px-8 rounded-md bg-c-danger hover:bg-c-danger2 text-white transition-colors"
        >
          <b-icon class="mdi-refresh" /> Реванш
        </b-button> -->
      </div>
    </template>
  </b-modal>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import SmallProfile from "@/components/profiles/SmallProfile.vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  status: { type: Number, default: 0 },
  whiteid: { type: String, required: true },
  blackid: { type: String, required: true },

  whiteelo: { type: Number, default: 0 },
  blackelo: { type: Number, default: 0 },
  whitescore: { type: Number, default: 0 },
  blackscore: { type: Number, default: 0 },
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
