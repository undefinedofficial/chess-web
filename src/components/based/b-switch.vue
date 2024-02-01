<template>
  <div class="switch-input relative overflow-hidden">
    <div
      class="absolute top-0 left-0 px-2 h-full bg-c-blue transition-transform"
      :style="{
        width: 100 / values.length + '%',
        transform: 'translateX(' + offset * 100 + '%)',
      }"
    ></div>
    <div class="relative z-10 flex">
      <div
        class="px-1 cursor-pointer w-full text-center"
        v-for="(item, i) in values"
        :key="i"
        @click="onSelect(item)"
      >
        <i v-if="item.icon" :class="item.icon"></i>
        <p v-if="item.label">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

type Status<T extends string | number | object | boolean> = {
  value: T;
  label?: string;
  icon?: string;
};

const props = defineProps({
  values: { type: Array<Status<any>>, required: true },
  modelValue: { required: true },
});
const { values } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const onSelect = (item: Status<any>) => {
  model.value = item.value;
};

const offset = computed(() => {
  return values.value.findIndex((v) => v.value === model.value);
});
</script>
