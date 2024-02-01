<template>
  <div
    v-if="!successchange"
    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg p-8 space-y-3 rounded-xl bg-l-grey-light-3 text-c-grey dark:bg-d-black-2 dark:text-white"
  >
    <div class="mb-8 text-center">
      <h1 class="my-1 text-3xl font-bold lowercase">Новый пароль</h1>
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
      <b-button
        :loading="loader"
        :disabled="loader"
        class="block w-full p-3 text-center rounded-sm bg-c-blue hover:bg-c-blue-control border border-transparent focus:border-cyan-300 transition-colors text-white"
      >
        Далее
      </b-button>
    </form>
  </div>
  <IconScreen v-else label="Пароль успешно изменен!">
    <RouterLink
      to="/signin"
      class="bg-c-success hover:bg-c-success2 transition-colors w-min mx-auto mt-6 px-16 py-3 rounded-md"
      >Войти</RouterLink
    >
  </IconScreen>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

import { useUserStore } from "@/stores/UserStore";

import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import IconScreen from "@/components/IconScreen.vue";

const state = reactive({
  password: "",
  confirmpassword: "",
});
const validate = useVuelidate(
  {
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
  },
  state,
  {
    $lazy: true,
  }
);
const backenderrors = ref<Array<string>>([]);

const loader = ref(false);
const successchange = ref(false);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const submit = async () => {
  validate.value.$touch();
  backenderrors.value.splice(0);
  if (validate.value.$invalid) return;

  loader.value = true;
  const success = await userStore.ResetPassword({
    password: state.password,
    confirm: route.params.hash as string,
  });
  if (success !== 200) {
    backenderrors.value.push("Сменить пароль не удалось");
    loader.value = false;
    return;
  }
  successchange.value = true;
};

onMounted(() => {
  const hash = route.params.hash as string;
  if (!hash) {
    router.push("/");
  }
});
</script>
