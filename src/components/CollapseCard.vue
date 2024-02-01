<template>
  <Card
    class="overflow-hidden h-min pb-8 relative transition-size"
    :style="IsOpen ? 'max-height: initial' : ''"
  >
    <slot />
    <div
      class="absolute bottom-0 left-6 right-6 flex bg-l-grey-light-3 dark:bg-d-black-2"
    >
      <b-button class="mx-auto" @click="IsOpen = !IsOpen">{{
        IsOpen ? "Cвернуть" : "Развернуть"
      }}</b-button>
    </div>
  </Card>
</template>
<script lang="ts" setup>
import { computed, ref, toRefs, watch } from "vue";
import Card from "@/components/Card.vue";

const props = defineProps({
  show: { type: Boolean, default: false },
});
const { show } = toRefs(props);

const open = ref(show.value);

const IsOpen = computed({
  get() {
    return open.value;
  },
  set(value) {
    open.value = value;

    emit(value ? "expand" : "collapse");
  },
});

watch(show, (is) => {
  IsOpen.value = is;
});

const emit = defineEmits(["expand", "collapse"]);
</script>
