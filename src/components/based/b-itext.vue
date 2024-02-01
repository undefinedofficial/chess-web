<template>
  <div>
    <label>
      <p class="pl-2 text-sm">{{ label }}</p>
      <input
        :type="type"
        :name="name"
        v-model="model"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :class="{
          'dark:border-rose-700 focus:none': invalid,
        }"
        class="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 outline-none dark:text-gray-100 focus:border-blue-400 focus:dark:border-blue-400"
      />
      <slot />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  name: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  autocomplete: { type: String, required: false },
  invalid: { type: Boolean, default: false },

  modelValue: { required: true },
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
