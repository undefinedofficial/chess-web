<template>
  <nav
    class="bg-l-grey-light-3 text-c-grey dark:bg-d-black-2 dark:text-white fixed w-full z-20 top-0 pb-1 shadow"
  >
    <div class="md:container md:flex justify-between mx-auto px-2">
      <div class="mx-auto flex justify-between items-center py-1 md:pb-0">
        <router-link
          rel="noopener noreferrer"
          to="/"
          class="h-full px-3 flex flex-wrap justify-end"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 0 495 154">
            <path
              d="M71.729 14.623A17.429 17.429 0 0181.74 8.349a17.413 17.413 0 01-.131 11.972 17.424 17.424 0 0111.296-3.469 17.415 17.415 0 01-3.226 11.529 17.43 17.43 0 0111.809-.427 17.412 17.412 0 01-6.1 10.302c4.119-.502 8.173.5 11.517 2.643a17.408 17.408 0 01-8.559 8.373 17.427 17.427 0 0110.44 5.535 17.408 17.408 0 01-10.434 5.871 17.43 17.43 0 018.653 8.05 17.416 17.416 0 01-11.598 2.97 17.438 17.438 0 016.277 10.013 17.416 17.416 0 01-11.973-.131 17.437 17.437 0 013.47 11.297l-.165.01c-3.073-3.107-6.827-4.933-10.879-4.933a13 13 0 00-1.245.059v.001c-.292.027-.585.064-.874.11l-.031.005h-.004l-.036.006-.034.007-.036.005-.007.002-.028.005c-3.48.604-6.668 2.563-9.297 5.498v-.001c-.416.463-.817.95-1.203 1.461l-.07.094-.15.201-.011.016-.093.128-.101.141-.002.003-.022.031-.168.24-.015.02-.157.233-.017.024-.027.04-.1.151-.01.016-.089.135-.097.152c-1.366 2.139-2.494 4.595-3.323 7.28l-.002-.002c-1.028 3.324-1.6 7.002-1.6 10.87 0 10.906 4.54 20.303 11.069 24.536v4.524H35.706v-4.276c6.716-4.097 11.425-13.618 11.425-24.706 0-8.966-3.08-16.903-7.806-21.78h.009l-.087-.09-.006-.006-.006-.006-.002-.001-.004-.003-.013-.014-.026-.026-.015-.017-.008-.007-.006-.006-.006-.006v-.002l-.021-.02-.093-.092-.01-.01h-.001l-.173-.167-.014-.015-.018-.016.001-.003a18.78 18.78 0 00-.335-.314l-.025-.022a18.39 18.39 0 00-1.17-.988l-.003-.001a16.807 16.807 0 00-2.473-1.6l-.023-.012-.051-.026c-.41-.212-.827-.406-1.25-.579l-.043-.016a14.085 14.085 0 00-1.757-.58l-.035-.009-.035-.008a13.813 13.813 0 00-.884-.193l-.056-.01c-.13-.022-.26-.044-.392-.063l-.065-.01-.082-.012-.001.002-.005-.001-.219-.028-.027-.004-.028-.003h-.007l-.021-.003-.113-.013-.029-.002-.003-.001-.3-.027-.226-.015-.04-.003.001-.001a13.535 13.535 0 00-2.201.05l-.082.009c-.62.069-1.23.182-1.831.334l-.01.003c-.307.078-.609.166-.91.265l-.006.002c-.147.049-.293.1-.439.154l-.032.011c-.131.048-.26.099-.39.151l-.038.015-.021.008c-.29.12-.577.246-.861.384l-.01.004c-.137.067-.273.136-.41.208l-.035.017c-.136.072-.27.145-.405.22l-.004.003c-.14.079-.28.16-.417.244l-.015.009c-.133.08-.265.162-.395.247l-.016.01-.02.013c-.127.083-.254.168-.38.253l-.026.019c-.124.085-.248.173-.37.263l-.025.017-.02.015c-.122.09-.242.18-.362.273l-.032.025c-.117.09-.233.183-.348.277l-.098.08-.262.222-.124.108-.285.254-.114.105-.238.224-.16.154-.175.174-.191.194-.007.007-.204-.007c-.31-4.01.763-8.112 3.222-11.528a17.414 17.414 0 01-11.806.425 17.415 17.415 0 016.095-10.3 17.416 17.416 0 01-11.513-2.645 17.417 17.417 0 018.553-8.372 17.413 17.413 0 01-10.435-5.534 17.414 17.414 0 0110.428-5.873 17.41 17.41 0 01-8.648-8.046 17.415 17.415 0 0111.595-2.975 17.414 17.414 0 01-6.272-10.01 17.414 17.414 0 0111.97.127 17.408 17.408 0 01-3.467-11.29c4.01-.311 8.113.762 11.528 3.221a17.41 17.41 0 01-.425-11.804 17.407 17.407 0 0110.301 6.095c-.5-4.122.5-8.175 2.645-11.514a17.413 17.413 0 018.373 8.556A17.408 17.408 0 0154.84 1.247a17.406 17.406 0 015.87 10.429 17.427 17.427 0 018.048-8.65 17.408 17.408 0 012.972 11.597zM35.706 147.199h38.652v7.187H35.706zm.28-57.39h38.146V75.594H65.87v7.026h-6.68v-7.026H50.93v7.026h-6.681v-7.026h-8.262V89.808"
              fill="#66c989"
              fill-rule="evenodd"
            />
            <path
              d="M145.768 95.783v7.928c0 3.964-1.744 5.39-4.519 5.39-2.774 0-4.518-1.426-4.518-5.39V73.745c0-3.964 1.744-5.47 4.518-5.47 2.775 0 4.519 1.506 4.519 5.47v5.946h8.244V74.3c0-8.88-4.439-13.953-13-13.953-8.563 0-13.002 5.074-13.002 13.953v28.856c0 8.878 4.44 13.965 13.002 13.965 8.561 0 13-5.087 13-13.965v-7.373zm22.276-3.091h9.91v23.782h8.878V60.981h-8.879v23.783h-9.909V60.981h-8.72v55.493h8.72zm33.85-23.783h15.062V60.98h-23.783v55.493h23.783v-7.928h-15.061v-16.25h11.969v-7.928h-11.97zm19.343 5.391c0 15.855 17.044 17.995 17.044 29.41 0 3.965-1.744 5.391-4.518 5.391-2.775 0-4.519-1.426-4.519-5.39v-3.964H221v3.409c0 8.878 4.439 13.965 13 13.965 8.563 0 13.001-5.087 13.001-13.965 0-15.855-17.044-17.996-17.044-29.411 0-3.964 1.586-5.47 4.36-5.47 2.775 0 4.36 1.506 4.36 5.47v2.3h8.246V74.3c0-8.88-4.36-13.953-12.843-13.953s-12.843 5.074-12.843 13.953zm29.648 0c0 15.855 17.046 17.995 17.046 29.41 0 3.965-1.746 5.391-4.519 5.391-2.776 0-4.519-1.426-4.519-5.39v-3.964h-8.245v3.409c0 8.878 4.44 13.965 13.001 13.965 8.562 0 13.002-5.087 13.002-13.965 0-15.855-17.044-17.996-17.044-29.411 0-3.964 1.585-5.47 4.36-5.47 2.774 0 4.36 1.506 4.36 5.47v2.3h8.245V74.3c0-8.88-4.361-13.953-12.844-13.953-8.481 0-12.843 5.074-12.843 13.953"
              fill="currentColor"
            />
            <path
              d="M305.903 116.474h11.574l6.184-55.493h-7.61l-4.52 44.077-4.359-44.077h-8.404l-4.201 43.76-4.678-43.76h-8.482l6.184 55.493h11.97l3.171-29.57zm30.124-42.73c0-3.963 1.745-5.47 4.52-5.47 2.774 0 4.518 1.507 4.518 5.47v29.967c0 3.964-1.744 5.47-4.518 5.47-2.775 0-4.52-1.506-4.52-5.47zm-8.72 29.412c0 8.878 4.677 13.965 13.24 13.965 8.561 0 13.238-5.087 13.238-13.965V74.3c0-8.88-4.677-13.953-13.238-13.953-8.563 0-13.24 5.074-13.24 13.953zm40.113-29.411c0-3.964 1.744-5.47 4.519-5.47 2.774 0 4.518 1.506 4.518 5.47v29.966c0 3.964-1.744 5.47-4.518 5.47-2.775 0-4.519-1.506-4.519-5.47zm-8.72 29.41c0 8.88 4.677 13.966 13.239 13.966 8.561 0 13.238-5.087 13.238-13.965V74.3c0-8.88-4.677-13.953-13.238-13.953-8.562 0-13.239 5.074-13.239 13.953zm32.107 13.319H404.6c8.72 0 13.001-4.836 13.001-13.715V74.696c0-8.879-4.281-13.715-13.001-13.715h-13.793zm13.634-47.565c2.775 0 4.44 1.427 4.44 5.391v28.856c0 3.964-1.665 5.39-4.44 5.39h-4.914V68.91z"
              fill="#66c989"
            />
          </svg>
        </router-link>
        <div class="flex relative float-right">
          <div class="relative text-sm text-gray-100">
            <div class="block md:hidden pr-4">
              <button
                @click="isShow = !isShow"
                class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-100 hover:border-teal-500 appearance-none focus:outline-none"
              >
                <svg
                  class="fill-current h-3 w-3"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="container mx-auto w-full justify-end flex flex-col-reverse h-full md:flex-row md:max-h-fit md:overflow-visible transition-max-size"
        :class="isShow ? 'max-h-screen' : 'max-h-0 overflow-hidden'"
      >
        <SearchInput class="w-full pt-2.5 md:mx-5" />
        <div
          class="flex pt-6 mt-3 justify-between md:justify-end justify-self-end items-center space-x-5 py-3 md:py-0"
        >
          <b-button
            class="px-2 text-c-grey dark:text-white hover:text-c-blue dark:hover:text-c-blue"
            @click="question = true"
            title="Поддержка"
          >
            <b-icon class="transition-colors mdi-message-draw" />
          </b-button>
          <b-button
            title="Беззвучный режим"
            class="self-center text-c-grey dark:text-white"
            @click="userStore.SetMute(!userStore.IsMute)"
          >
            <b-icon
              class="transition-colors"
              :class="
                !userStore.IsMute
                  ? 'mdi-volume-high hover:text-c-success'
                  : 'mdi-volume-off hover:text-c-danger'
              "
            />
          </b-button>
          <b-button
            title="Стиль доски"
            class="self-center text-c-grey dark:text-white"
            @click="boardSettings = true"
          >
            <b-icon class="transition-colors mdi-checkerboard" />
          </b-button>
          <b-idropdown
            title="Тема"
            :options="[
              {
                value: 'dark',
                icon: 'mdi-weather-night',
              },
              {
                value: 'light',
                icon: 'mdi-weather-sunny',
              },
            ]"
            :value="userStore.Theme"
            @change="userStore.SwitchTheme"
            class="text-2xl mt-1 h-full w-12 bg-l-grey-light-3 dark:bg-d-black-2 text-c-grey dark:text-white"
            sill="mt-2"
          >
          </b-idropdown>
          <b-button
            title="Полноэкранный режим"
            class="self-center text-c-grey dark:text-white transition-transform hover:scale-110"
            @click="fullscreenStore.SwitchFullscreen"
          >
            <b-icon
              :class="
                !fullscreenStore.isFullscreen ? 'mdi-fullscreen' : 'mdi-fullscreen-exit'
              "
            />
          </b-button>
        </div>
      </div>
    </div>
  </nav>
  <QuestionModal v-model="question" />
  <BoardSettings v-model="boardSettings" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

import SearchInput from "@/components//Navigate/SearchInput.vue";
import QuestionModal from "@/components/Modals/QuestionModal.vue";
import BoardSettings from "@/components/Modals/BoardSettings.vue";

import { useFullscreenStore } from "@/stores/FullscreenStore";
import { useUserStore } from "@/stores/UserStore";

const isShow = ref(false);
const question = ref(false);
const boardSettings = ref(false);

const fullscreenStore = useFullscreenStore();
const userStore = useUserStore();
</script>
