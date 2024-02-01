<template>
  <div
    v-if="!checkemail"
    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg p-8 space-y-3 rounded-xl bg-l-grey-light-3 text-c-grey dark:bg-d-black-2 dark:text-white"
  >
    <div class="mb-8 text-center">
      <h1 class="my-1 text-3xl font-bold">Регистрация</h1>
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
        class="relative"
        type="text"
        label="Ник"
        name="nickname"
        autocomplete="nickname username"
        v-model="validate.nickname.$model"
        :invalid="validate.nickname.$invalid"
      >
        <p
          v-for="(err, i) in validate.nickname.$errors"
          :key="i"
          class="text-xs text-right text-rose-700"
        >
          {{ err.$message }}
        </p>
      </b-itext>
      <b-itext
        type="email"
        label="Эл.почта"
        placeholder="example@mail.ru"
        name="email"
        autocomplete="username"
        v-model="validate.email.$model"
        :invalid="validate.email.$invalid"
      >
        <p
          v-for="(err, i) in validate.email.$errors"
          :key="i"
          class="text-xs text-right text-rose-700"
        >
          {{ err.$message }}
        </p>
      </b-itext>
      <b-itext
        type="password"
        label="Пароль"
        placeholder="*****"
        name="password"
        autocomplete="new-password"
        v-model="validate.password.$model"
        :invalid="validate.password.$invalid"
      >
        <p
          v-for="(err, i) in validate.password.$errors"
          :key="i"
          class="text-xs text-right text-rose-700"
        >
          {{ err.$message }}
        </p>
      </b-itext>
      <b-itext
        type="password"
        label="Повторите пароль"
        placeholder="*****"
        name="confirmpassword"
        autocomplete="new-password"
        v-model="validate.confirmpassword.$model"
        :invalid="validate.confirmpassword.$invalid"
      >
        <p
          v-for="(err, i) in validate.confirmpassword.$errors"
          :key="i"
          class="text-xs text-right text-rose-700"
        >
          {{ err.$message }}
        </p>
      </b-itext>
      <div>
        <label class="pl-2 text-sm">Страна</label>
        <b-idropdown
          :options="locations"
          :value="state.location"
          @change="state.location = $event"
          class="w-full py-1 border h-full max-h-64 rounded-md bg-l-grey-light-3 text-c-grey dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 selection:bg-white"
        >
        </b-idropdown>
      </div>
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
        type="submit"
        class="block w-full p-3 text-center rounded-sm bg-c-blue hover:bg-c-blue-control border border-transparent focus:border-cyan-300 transition-colors text-white"
        :disabled="loader"
        :loading="loader"
      >
        Далее
      </b-button>
    </form>
    <p class="text-xs text-center sm:px-6 dark:text-gray-400">
      Есть аккаунт?
      <router-link
        rel="noopener noreferrer"
        to="/signin"
        class="underline dark:text-gray-100 hover:text-c-blue dark:hover:text-c-blue"
        >Вход</router-link
      >
    </p>
  </div>
  <IconScreenreen v-else label="Проверьте электронную почту" />
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

import recaptcha from "@/components/reCAPTCHA/recaptcha.vue";

import { useUserStore } from "@/stores/UserStore";

import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  email,
  helpers,
  not,
} from "@vuelidate/validators";
import { useNickname } from "@/hooks/nickname.hook";
import { contries } from "@/country-flag/contries";
import IconScreen from "@/components/IconScreen.vue";

const locations = new Array<Record<string, string>>();
Object.keys(contries).forEach((key) => {
  locations.push({
    value: key,
    icon: "flag flag-" + key,
    label: contries[key],
  });
});

const state = reactive({
  nickname: "",
  email: "",
  password: "",
  confirmpassword: "",
  location: "ru",
  captcha: "",
});
let offdos: any; // interval request for prevent ddos attacks
const validate = useVuelidate(
  {
    nickname: {
      required: helpers.withMessage("Введите ник", required),
      minLength: helpers.withMessage("Минимальная длина 5 символов!", minLength(5)),
      maxLength: helpers.withMessage("Максимальная длина 24 символа!", maxLength(24)),
      blacklist: helpers.withMessage(
        "Занят, выберите другой",
        (value: string) =>
          value.toLowerCase().indexOf("admin") === -1 &&
          value.toLowerCase().indexOf("guest") === -1
      ),
      nick: helpers.withMessage(
        "Ник должен содержать только латинские буквы или цифры",
        helpers.regex(/^[A-Za-z0-9]+$/)
      ),
      check: helpers.withMessage(
        "Занят, выберите другой",
        helpers.withAsync(
          async (value: string) =>
            new Promise((resolve, reject) => {
              if (value === "") resolve(true);
              clearTimeout(offdos);
              offdos = setTimeout(() => {
                useNickname().CheckNickname(value).then(resolve).catch(reject);
              }, 500);
            })
        )
      ),
    },
    email: {
      required: helpers.withMessage("Введите эл.почту", required),
      email: helpers.withMessage("Почта введена не верно", email),
    },
    password: {
      required: helpers.withMessage("Введите пароль", required),
      minLength: helpers.withMessage("Минимальная длина 4 символа!", minLength(4)),
      maxLength: helpers.withMessage("Максимальная длина 32 символа!", maxLength(32)),
    },
    confirmpassword: {
      required: helpers.withMessage("Повторите пароль", required),
      equal: helpers.withMessage(
        "Пароли не совпадают!",
        (value: string, model: { password: string }) => {
          return value === model.password;
        }
      ),
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
  const success = await userStore.SignUp({
    nickname: state.nickname,
    email: state.email,
    password: state.password,
    location: state.location,
    captcha: state.captcha,
  });
  if (success !== 200) {
    if (success === 409) backenderrors.value.push("Эл.почта занята");
    else if (success === 404) backenderrors.value.push("Эл.почта неверная");
    loader.value = false;
    return;
  }
  checkemail.value = true;
};
</script>
