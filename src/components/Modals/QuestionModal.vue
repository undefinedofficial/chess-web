<template>
  <b-modal v-model="model" :isRequired="false" mode="slide-up">
    <div
      class="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-3 md:py-16 mx-auto rounded-lg md:grid-cols-2 md:px-10 lg:px-12 xl:px-16 dark:bg-gray-800 dark:text-gray-100"
    >
      <div class="flex flex-col justify-between">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold leading-tight lg:text-4xl">Напишите</h2>
          <div class="dark:text-gray-400">Мы ответим!</div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 4106.867 4407.373"
          class="p-6 h-52 md:h-64"
        >
          <path
            d="M2403.756 4407.373c-14.346 0-32.266-7.16-43.04-17.933l-641.786-641.787H965.971c-147.002 0-265.323-118.333-265.323-265.331v-1756.88c0-35.853 28.683-64.55 64.538-64.55l552.169-272.49c0-35.853 28.683-64.55 64.536-64.55h2459.662c146.99 0 265.308 118.342 265.308 265.333v1893.137c0 146.998-118.318 265.33-265.308 265.33h-745.811l-645.385 645.388c-14.333 7.173-28.68 14.333-46.601 14.333"
            fill="#3854f1"
            fill-rule="evenodd"
          />
          <path
            d="M178.15 94.171l80.388-46.399C428.5-50.378 645.876 7.863 742.678 175.558c13.26 22.956 5.491 51.941-17.47 65.19L111.953 594.821c-22.963 13.25-51.956 5.49-65.21-17.467C-50.064 409.687 8.185 192.294 178.15 94.171"
            fill="#3ad642"
            fill-rule="evenodd"
          />
          <path
            d="M1048.158 2216.355l613.257-354.052c22.962-13.247 51.951-5.494 65.23 17.468l76.906 133.237c3.971 6.89 4.332 12.807 4.677 18.708l68.117 818.179c1.068 17.746-7.408 34.893-23.495 44.174-16.072 9.293-35.158 8.051-50.005-1.747l-680.053-461.806c-4.948-3.25-11.222-8.837-15.205-15.711l-78.235-135.528c-13.254-22.962-4.156-49.644 18.806-62.922"
            fill="#fcd599"
            fill-rule="evenodd"
          />
          <path
            d="M1844.2 2463.64l9.907 119.16 22.24 267.093c1.066 17.747-7.414 34.894-23.494 44.174-16.08 9.293-35.16 8.053-50.013-1.747l-222.613-151.173-97.467-66.174c47.16-51.146 102.907-93.68 168.28-131.426 63.307-36.534 128.52-63.654 193.16-79.907M65.537 514.425l74.818-43.207L631.39 187.715l47.402-27.354 41.34-23.87 23.868 41.346 37.652 65.216 891.956 1544.896 51.694 89.534 78.24 135.508-40.798 23.56-.547.32-564.286 325.785-48.977 28.266-41.343 23.867-78.23-135.505-74.909-129.732L122.191 708.029 46.743 577.335l-22.546-39.04 41.34-23.87"
            fill="#4ab641"
            fill-rule="evenodd"
          />
          <path
            d="M599.55 463.359c22.965-13.256 51.948-5.487 65.216 17.48l758.511 1313.789a47.554 47.554 0 01-17.465 65.21c-22.989 13.256-51.962 5.487-65.227-17.48L582.078 528.568c-13.265-22.966-5.501-51.954 17.473-65.21M365.27 598.598c22.968-13.249 51.957-5.487 65.217 17.492L1189 1929.858c13.265 22.979 5.501 51.96-17.476 65.209-22.96 13.271-51.951 5.51-65.209-17.47L347.8 663.808c-10.957-24.293-3.2-53.274 17.472-65.21"
            fill="#219931"
            fill-rule="evenodd"
          />
          <path
            d="M3526.022 3324.558H1281.508c-35.853 0-64.543-28.693-64.543-64.546 0-35.853 28.69-64.533 64.543-64.533h2244.514c35.861 0 64.542 28.68 64.542 64.533s-28.68 64.546-64.542 64.546M3526.022 2844.09h-1122.26c-35.862 0-64.543-28.691-64.543-64.546 0-35.853 28.68-64.533 64.542-64.533l1122.26.013c35.862 0 64.543 28.68 64.543 64.533 0 35.855-28.68 64.533-64.542 64.533M3526.022 2360.051h-1122.26c-35.862 0-64.543-28.693-64.543-64.546 0-35.855 28.68-64.533 64.542-64.533h1122.26c35.862 0 64.543 28.678 64.543 64.533 0 35.853-28.68 64.546-64.542 64.546M3526.022 1879.594h-1122.26c-35.862 0-64.543-28.68-64.543-64.52 0-35.861 28.68-64.564 64.542-64.564h1122.26c35.862 0 64.543 28.703 64.543 64.564 0 35.84-28.68 64.52-64.542 64.52"
            fill="#2b83f5"
            fill-rule="evenodd"
          />
        </svg>
      </div>
      <form
        class="space-y-2 md:space-y-6 ng-untouched ng-pristine ng-valid ng-submitted"
        @submit.prevent="SendQuestion"
      >
        <div v-if="NoAuth">
          <b-itext name="email" type="email" label="Эл.Почта" v-model="email" />
        </div>
        <div>
          <b-idropdown
            :options="Topics"
            :value="topic"
            @change="topic = $event"
            class="w-full border h-10 rounded-md bg-l-grey-light-3 text-c-grey dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 selection:bg-white"
          />
        </div>
        <div class="space-y-1 text-sm">
          <label for="feedback" class="block pl-2 text-sm">Сообщение</label>
          <textarea
            id="feedback"
            rows="5"
            v-model="message"
            :placeholder="CurrentTopic?.description || ''"
            class="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 outline-none dark:text-gray-100 focus:border-blue-400 focus:dark:border-blue-400"
          />
        </div>
        <b-button
          type="submit"
          :loading="sending"
          :disabled="sending"
          class="w-full p-3 text-sm font-bold tracking-wide uppercase rounded bg-c-blue-control2 hover:bg-c-blue text-white"
        >
          Отправить
        </b-button>
      </form>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useQuestionStore } from "@/stores/QuestionStore";

const props = defineProps({
  modelValue: Boolean,
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

const userStore = useUserStore();
const NoAuth = computed(() => !userStore.user);

const email = ref("");
const message = ref("");

const Topics = [
  {
    label: "Тема",
    icon: "mdi-message-star",
    value: "",
    isDisabled: true,

    description: "Выберите тему",
  },
  {
    label: "Предложение",
    icon: "mdi-account-multiple-plus",
    value: "Предложение",

    description:
      "Опишите что вы хотите чтобы мы добавили. Мы очень ценим предложения наших пользователей и постараемся сделать его удобнее.",
  },
  {
    label: "Игра была не честной",
    icon: "mdi-controller",
    value: "Не честная игра",

    description:
      "Опишите в чем она была не честна. Скопируйте ссылку и прикрепите её здесь чтобы мы смогли её проверить.",
  },
  {
    label: "Ошибка на сайте.",
    icon: "mdi-alert-circle",
    value: "Ошибка на сайте",
    description: "Опишите что произошло.",
  },
  {
    label: "Другое",
    icon: "mdi-dots-horizontal",
    value: "Другой вопрос",

    description: "Опишите вашу проблему...",
  },
];
const topic = ref(Topics[0].value);
const CurrentTopic = computed(() => Topics.find((t) => t.value === topic.value));

const questionStore = useQuestionStore();

const sending = ref(false);
/**
 * SendQuestion
 */
const SendQuestion = async () => {
  sending.value = true;
  if (userStore.user) {
    email.value = userStore.user.email;
  }
  await questionStore.SendQuestion({
    email: email.value,
    topic: topic.value,
    body: message.value,
  });
  sending.value = false;
  model.value = false;
};
</script>
