<template>
  <div
    v-if="!checkemail"
    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg p-8 space-y-3 rounded-xl bg-l-grey-light-3 text-c-grey dark:bg-d-black-2 dark:text-white"
  >
    <div class="mb-8 text-center">
      <h1 class="my-1 text-3xl font-bold lowercase">Сброс пароля</h1>
    </div>
    <form @submit.prevent="submit" class="space-y-4 ng-untouched ng-pristine ng-valid">
      <p
        v-for="err in backenderrors"
        :key="err"
        class="text-sm text-center text-rose-700"
      >
        {{ err }}
      </p>

      <b-itext
        type="email"
        label="Эл.почта"
        placeholder="example@mail.ru"
        name="email"
        v-model="validate.email.$model"
        :invalid="validate.email.$invalid"
        autocomplete="username"
      >
        <p
          v-for="(err, i) in validate.email.$errors"
          :key="i"
          class="text-xs text-right text-rose-700"
        >
          {{ err.$message }}
        </p>
        <div class="flex justify-end text-xs dark:text-gray-400">
          <RouterLink rel="noopener noreferrer" to="/signin">
            Вспомнил пароль
          </RouterLink>
        </div>
      </b-itext>
      <recaptcha class="my-3" @change="validate.captcha.$model = $event">
        <p
          v-for="(err, i) in validate.captcha.$errors"
          :key="i"
          class="text-xs text-right text-rose-700"
        >
          {{ err.$message }}
        </p>
      </recaptcha>

      <b-button
        :loading="loader"
        :disabled="loader"
        class="block w-full p-3 text-center rounded-sm bg-c-blue hover:bg-c-blue-control border border-transparent focus:border-cyan-300 transition-colors text-white"
      >
        Далее
      </b-button>
    </form>
    <p class="text-xs text-center sm:px-6 dark:text-gray-400">
      Нет аккаунта?
      <RouterLink
        rel="noopener noreferrer"
        to="/signup"
        class="underline dark:text-gray-100"
      >
        Регистрация
      </RouterLink>
    </p>
  </div>
  <IconScreen v-else label="Проверьте электронную почту" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

import recaptcha from "@/components/reCAPTCHA/recaptcha.vue";

import { useUserStore } from "@/stores/UserStore";

import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, email, helpers } from "@vuelidate/validators";
import IconScreen from "@/components/IconScreen.vue";

const state = reactive({
  email: "",
  captcha: "",
});
const validate = useVuelidate(
  {
    email: {
      required: helpers.withMessage("Введите эл.почту", required),
      email: helpers.withMessage("Почта введена не верно", email),
    },
    captcha: {
      required: helpers.withMessage("Заполните поле", required),
    },
  },
  state,
  {
    $lazy: true,
  }
);
const backenderrors = ref<Array<string>>([]);

const loader = ref(false);
const checkemail = ref(false);

const router = useRouter();
const userStore = useUserStore();

const submit = async () => {
  validate.value.$touch();
  backenderrors.value.splice(0);
  if (validate.value.$invalid) return;

  loader.value = true;
  const success = await userStore.ForgotPassword({
    email: state.email,
    captcha: state.captcha,
  });
  if (success !== 200) {
    validate.value.password.$reset();
    backenderrors.value.push("Неверный ввод");
    loader.value = false;
    return;
  }
  checkemail.value = true;
};
</script>
