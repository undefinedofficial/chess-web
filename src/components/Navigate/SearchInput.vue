<template>
  <fieldset class="relative w-full md:w-fit dark:text-gray-100">
    <div class="relative">
      <span class="absolute inset-y-0 left-0 flex items-center pl-1 pt-1">
        <button
          type="button"
          title="Поиск"
          class="p-1 dark:text-gray-100 hover:text-blue-400 dark:hover:text-blue-400"
          @click="onFocus"
        >
          <b-icon class="mdi-magnify" />
        </button>
      </span>
      <input
        type="search"
        ref="searchinput"
        name="Search"
        :value="value"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="transition-size py-2 w-full duration-500 pl-10 text-sm rounded-md outline-none dark:text-gray-100 bg-l-grey-light dark:bg-gray-900"
        :class="
          Focused
            ? 'md:w-80 border-blue-400 dark:border-blue-400'
            : 'md:w-0 md:bg-transparent md:dark:bg-transparent'
        "
        @focus="focused = true"
        @blur="focused = false"
        @input="UpdateValue"
      />
    </div>
    <div
      v-if="value.length > 2"
      class="absolute left-0 right-0 top-[101%] md:top-full min-h-[3rem] rounded-md flex flex-col bg-gray-200 dark:bg-gray-900 dark:text-gray-100 focus:dark:bg-gray-900"
    >
      <b-loader v-if="loading" />
      <div class="mx-auto my-auto" v-else-if="founds.length === 0">Не найдено</div>
      <div v-else>
        <div
          class="flex justify-between bg-l-grey-light-3 dark:bg-d-black-2 mx-1 my-2 rounded-md p-1 border border-transparent hover:border-blue-400 hover:dark:border-blue-400"
          v-for="f in founds"
          :key="f.nickname"
          @click="OpenProfile(f)"
        >
          <img :src="f.avatar" class="h-8 w-8 rounded-full mx-1" />
          <p class="w-full mt-auto">{{ f.nickname }}</p>
          <span
            class="w-2 h-2 rounded-full my-auto mx-3"
            :class="f.lastOnline === true ? 'bg-c-success' : 'bg-c-danger'"
          ></span>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, toRefs, computed } from "vue";
import { useRouter } from "vue-router";

import type { Profile } from "@/models/Profile.model";
import { useProfiles } from "@/hooks/profiles.hook";

const props = defineProps({
  placeholder: { type: String, default: "Что ищем?" },
  autocomplete: { type: String, required: false },
});
const { placeholder, autocomplete } = toRefs(props);

const searchinput = ref<HTMLInputElement | null>(null);
const value = ref("");
const focused = ref(false);
const Focused = computed(() => focused.value || value.value.length > 0);
const onFocus = () => {
  focused.value = !focused.value;
  if (focused.value && searchinput.value) searchinput.value.focus();
};

const findProfiles = useProfiles();

const founds = ref<Array<Profile>>([]);

const loading = ref(false);

let hTimerDos: any;
const UpdateValue = (event: Event) => {
  value.value = (event.target as any).value;
  if (hTimerDos) clearTimeout(hTimerDos);
  loading.value = true;
  founds.value.splice(0);
  hTimerDos = setTimeout(async () => {
    const response = await findProfiles.FindByNickName(value.value);
    if (response) founds.value.push(...response);
    loading.value = false;
  }, 500);
};

const router = useRouter();
const OpenProfile = (user: { nickname: string }) => {
  value.value = "";
  router.push(user.nickname);
};
</script>
