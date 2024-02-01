<template>
  <b-modal v-model="model" :isClosable="true" mode="slide-up">
    <div class="relative mr-1 mb-1 lg:p-6">
      <h1 class="text-center text-xl m-1">Настройки</h1>
      <div class="h-px bg-gray-700 my-2"></div>
      <div class="flex flex-col md:flex-row max-h-96 md:max-h-max overflow-y-auto">
        <div class="p-1 w-full md:w-1/2">
          <div class="flex justify-center space-x-2" v-if="userStore.user">
            <img
              :src="userStore.user.avatar"
              :alt="userStore.user.nickname"
              class="w-40 h-40 rounded-full dark:bg-gray-500 aspect-square object-cover"
            />
            <div class="flex flex-col my-auto space-y-8">
              <form>
                <label
                  class="relative rounded-lg bg-c-success2 hover:bg-c-success text-white p-1 pt-2"
                  :class="{
                    'pointer-events-none brightness-75': isUploadAvatar,
                  }"
                >
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    name="avatar"
                    class="hidden"
                    @change="UploadAvatar"
                  />

                  <b-icon class="mdi-upload" />
                  <b-tooltip class="border-c-success text-center" vertical="bottom"
                    >Загрузить фото.
                    <p>Не более 1 м/байт</p></b-tooltip
                  ></label
                >
              </form>
              <b-button
                :disabled="isRemoveAvatar"
                @click="RemoveAvatar"
                class="relative rounded-lg bg-c-danger2 hover:bg-c-danger text-white py-1"
                ><b-icon class="mdi-delete" />
                <b-tooltip class="border-c-danger" vertical="bottom">Удалить</b-tooltip>
              </b-button>
            </div>
          </div>
          <!-- <p class="text-center" v-if="failedAvatar">Не удалось загрузить</p> -->
        </div>
        <div class="p-1 w-full md:w-1/2">
          <form @submit.prevent="SendSettings" class="space-y-3">
            <b-itext
              class="w-full"
              type="text"
              label="Ник"
              name="nickname"
              autocomplete="lastname nickname username"
              v-model="vnickname.nickname.$model"
              :invalid="vnickname.nickname.$invalid"
            >
              <p
                v-for="err in vnickname.nickname.$errors"
                :key="err.$uid"
                class="text-xs text-right text-rose-700"
              >
                {{ err.$message }}
              </p>
            </b-itext>

            <b-itext
              class="relative w-full"
              type="email"
              label="Эл.почта"
              name="email"
              autocomplete="email"
              v-model="vemail.email.$model"
              :invalid="vemail.email.$invalid"
            >
              <p
                v-for="err in vemail.email.$errors"
                :key="err.$uid"
                class="text-xs text-right text-rose-700"
              >
                {{ err.$message }}
              </p>
            </b-itext>
            <div class="flex space-x-0.5">
              <b-itext
                class="relative w-full"
                type="text"
                label="Фамилия"
                name="lastname"
                autocomplete="lastname username"
                v-model="vname.lastname.$model"
                :invalid="vname.lastname.$invalid"
              >
                <p
                  v-for="err in vname.lastname.$errors"
                  :key="err.$uid"
                  class="text-xs text-right text-rose-700"
                >
                  {{ err.$message }}
                </p>
              </b-itext>
              <b-itext
                class="relative w-full"
                type="text"
                label="Имя"
                name="firstname"
                autocomplete="firstname username"
                v-model="vname.firstname.$model"
                :invalid="vname.firstname.$invalid"
              >
                <p
                  v-for="err in vname.firstname.$errors"
                  :key="err.$uid"
                  class="text-xs text-right text-rose-700"
                >
                  {{ err.$message }}
                </p>
              </b-itext>
            </div>

            <div class="space-y-0.5">
              <b-itext
                type="password"
                label="Смена пароля"
                placeholder="Старый пароль"
                name="password"
                autocomplete="current-password"
                v-model="vpassword.oldpassword.$model"
                :invalid="vpassword.oldpassword.$invalid"
              >
                <p
                  v-for="err in vpassword.oldpassword.$errors"
                  :key="err.$uid"
                  class="text-xs text-right text-rose-700"
                >
                  {{ err.$message }}
                </p>
              </b-itext>
              <b-itext
                type="password"
                placeholder="Новый пароль"
                name="password"
                autocomplete="new-password"
                v-model="vpassword.newpassword.$model"
                :invalid="vpassword.newpassword.$invalid"
              >
                <p
                  v-for="err in vpassword.newpassword.$errors"
                  :key="err.$uid"
                  class="text-xs text-right text-rose-700"
                >
                  {{ err.$message }}
                </p>
              </b-itext>
              <b-itext
                type="password"
                placeholder="Повторите новый пароль"
                name="confirm-password"
                autocomplete="new-password"
                v-model="vpassword.confirmpassword.$model"
                :invalid="vpassword.confirmpassword.$invalid"
              >
                <p
                  v-for="err in vpassword.confirmpassword.$errors"
                  :key="err.$uid"
                  class="text-xs text-right text-rose-700"
                >
                  {{ err.$message }}
                </p>
              </b-itext>
            </div>
            <b-button
              class="relative mt-1 rounded-lg bg-c-success2 hover:bg-c-success text-white w-full py-1.5"
              :disabled="sendRequest"
              :loading="sendRequest"
              >Сохранить
            </b-button>
          </form>
        </div>
      </div>
      <div class="absolute top-9 lg:top-16 left-0 right-0 flex flex-col items-center">
        <Notification
          class="h-12 pt-3 px-6 py-0 whitespace-nowrap"
          v-for="n in notify"
          :key="n.id"
          :icon="n.icon"
          :type="n.type"
          :title="n.title"
          :description="n.description"
          :duration="3"
          :feedback="!!n.accept && !!n.reject"
          @accept="n.accept"
          @reject="n.reject"
          @close="n.reject"
          textAlign="text-left"
          :closable="true"
        />
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { useNickname } from "@/hooks/nickname.hook";
import type { Notify } from "@/models/Notification.model";
import { useUserStore } from "@/stores/UserStore";
import useVuelidate from "@vuelidate/core";
import { email, helpers, maxLength, minLength, required } from "@vuelidate/validators";
import { computed, reactive, ref, watch } from "vue";
import Notification from "../Notification.vue";

const userStore = useUserStore();
const { CheckNickname } = useNickname();

const notify = ref<Array<Omit<Notify, "closable">>>([]);

const AddNotify = (
  title: string,
  type: "info" | "error" = "info",
  description?: string
) => {
  const id = Date.now();
  const n = {
    id,
    title,
    description,
    type,
    reject: () => {
      notify.value.splice(
        notify.value.findIndex((n) => n.id === id),
        1
      );
    },
  };
  notify.value.push(n);
  setTimeout(() => {
    n.reject();
  }, 3000);
};

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

watch(model, (value) => {
  if (!userStore.user) return;

  sEmail.email = userStore.user.email;
  sNickname.nickname = userStore.user.nickname;
  sName.lastname = userStore.user.lastname || "";
  sName.firstname = userStore.user.firstname || "";
});

const sEmail = reactive({
  email: "",
});
const vemail = useVuelidate(
  {
    email: {
      email: helpers.withMessage("Почта введена не верно", email),
    },
  },
  sEmail,
  {
    $lazy: false,
  }
);

const sNickname = reactive({
  nickname: "",
});
let offdos: any; // interval request for prevent ddos attacks
const vnickname = useVuelidate(
  {
    nickname: {
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
        helpers.withAsync(async (value: string) => {
          return new Promise((resolve, reject) => {
            if (value === "") resolve(true);
            clearTimeout(offdos);
            offdos = setTimeout(() => {
              CheckNickname(value).then(resolve).catch(reject);
            }, 500);
          });
        })
      ),
    },
  },
  sNickname,
  {
    $lazy: true,
  }
);

const sName = reactive({
  firstname: "",
  lastname: "",
});
const vname = useVuelidate(
  {
    lastname: {
      max: helpers.withMessage("Максимальная длинна 32 символа", maxLength(32)),
    },
    firstname: {
      max: helpers.withMessage("Максимальная длинна 32 символа", maxLength(32)),
    },
  },
  sName,
  {
    $lazy: true,
  }
);

const sPassword = reactive({
  oldpassword: "",
  newpassword: "",
  confirmpassword: "",
});
const vpassword = useVuelidate(
  {
    oldpassword: {
      minLength: helpers.withMessage("Минимальная длина 4 символа!", minLength(4)),
      maxLength: helpers.withMessage("Максимальная длина 32 символа!", maxLength(32)),
    },
    newpassword: {
      minLength: helpers.withMessage("Минимальная длина 4 символа!", minLength(4)),
      maxLength: helpers.withMessage("Максимальная длина 32 символа!", maxLength(32)),
    },
    confirmpassword: {
      equal: helpers.withMessage(
        "Пароли не совпадают!",
        (value: string, model: { newpassword: string }) => {
          return value === model.newpassword;
        }
      ),
    },
  },
  sPassword,
  {
    $lazy: true,
  }
);

const sendRequest = ref(false);
const SendSettings = async () => {
  if (!userStore.user) return;

  sendRequest.value = true;

  if (sNickname.nickname !== userStore.user.nickname) {
    vnickname.value.nickname.$touch();
    if (!vnickname.value.nickname.$invalid) {
      const ok = await userStore.ChangeSettings("nickname", {
        nickname: sNickname.nickname,
      });
      if (ok === true) {
        AddNotify("Ник сменен!");
      } else if (ok === "early") {
        AddNotify("Ник можно сменить раз в месяц!", "error");
      }
    }
  }
  if (sEmail.email !== userStore.user.email) {
    vemail.value.email.$touch();
    if (!vemail.value.email.$invalid) {
      const ok = await userStore.ChangeSettings("email", {
        email: sEmail.email,
      });

      if (ok === true) {
        AddNotify("Подтверждение отправленно на почту!");
      } else if (ok === "early") {
        AddNotify("Эл.почту можно сменить раз в месяц!", "error");
      }
    }
  }
  if (sName.firstname !== userStore.user.firstname) {
    vname.value.firstname.$touch();
    if (!vname.value.firstname.$invalid) {
      const ok = await userStore.ChangeSettings("name", {
        firstname: sName.firstname,
      });

      if (ok === true) {
        AddNotify("Имя изменено!");
      } else {
        AddNotify("Имя изменить не удалось!", "error");
      }
    }
  }
  if (sName.lastname !== userStore.user.lastname) {
    vname.value.lastname.$touch();
    if (!vname.value.lastname.$invalid) {
      const ok = await userStore.ChangeSettings("name", {
        lastname: sName.lastname,
      });
      if (ok === true) {
        AddNotify("Имя изменено!");
      } else {
        AddNotify("Имя изменить не удалось!", "error");
      }
    }
  }
  if (sPassword.oldpassword !== "") {
    vpassword.value.$touch();
    if (!vpassword.value.$invalid) {
      const ok = await userStore.ChangeSettings("password", {
        oldpassword: sPassword.oldpassword,
        newpassword: sPassword.newpassword,
      });
      if (ok === true) {
        AddNotify("Пароль изменен!");
      } else if (ok === "oldpassword") {
        AddNotify("Старый пароль неверный!", "error");
      }
    }
  }
  sendRequest.value = false;
};

const isUploadAvatar = ref(false);
const UploadAvatar = async (event: any) => {
  const file = event.currentTarget.files[0];
  isUploadAvatar.value = true;
  await userStore.ChangeAvatar(file);
  isUploadAvatar.value = false;
};

const isRemoveAvatar = ref(false);
const RemoveAvatar = async () => {
  isRemoveAvatar.value = true;
  await userStore.ChangeAvatar();
  isRemoveAvatar.value = false;
};
// export default class SettingsModal extends Vue {
//   @ModelSync("modelValue", "update:modelValue", {
//     type: Boolean,
//     required: true,
//   })
//   public readonly isOpen?: boolean;

//   public get user() {
//     return userModule.User as User;
//   }

//   private offdos?: number;
//   public nickname = new Validations(
//     [
//       new CheckEmpty("Введите ник!"),
//       new CheckRegex(
//         /[^a-z0-9]/gi,
//         "Ник должен содержать только латинские буквы или цифры"
//       ),
//       new CheckMinLength(5, "Минимальная длина 5 символов!"),
//       new CheckMaxLength(24, "Максимальная длина 24 символа!"),
//       new CheckBlackList(["admin", "guest"], "Занят, выберите другой"),
//       new CheckCustom((s) => {
//         if (this.offdos) clearTimeout(this.offdos);
//         this.offdos = setTimeout(async () => {
//           if (this.user.nickname === (this.nickname.model as any)) return;

//           const res = await userModule.CheckNickName({
//             nickname: this.nickname.model as any,
//           });
//           if (!res) {
//             this.nickname.errors.push(s.message);
//             (this.nickname.Invalid as any) = true;
//           }
//         }, 500);
//         return false;
//       }, "Занят, выберите другой"),
//     ],
//     ""
//   );
//   public lastname = new Validations(
//     [new CheckMaxLength(24, "Максимальная длина 24 символа")],
//     ""
//   );
//   public firstname = new Validations(
//     [new CheckMaxLength(24, "Максимальная длина 24 символа")],
//     ""
//   );
//   public oldpassword = new Validations(
//     [
//       new CheckEmpty("Введите текущий пароль!"),
//       new CheckMinLength(4, "Минимальная длина 4 символа!"),
//       new CheckMaxLength(32, "Максимальная длина 32 символа!"),
//     ],
//     ""
//   );
//   public newpassword = new Validations(
//     [
//       new CheckEmpty("Введите новый пароль!"),
//       new CheckMinLength(4, "Минимальная длина 4 символа!"),
//       new CheckMaxLength(32, "Максимальная длина 32 символа!"),
//     ],
//     ""
//   );
//   public confirmpassword = new Validations(
//     [
//       new CheckEmpty("Повторите новый пароль!"),
//       new CheckEqual(this.newpassword.model, "Пароли не совпадают!"),
//     ],
//     ""
//   );

//   public avatarModal = false;

//   public SendingAvatar = false;
//   public get IsSendAvatar(): boolean {
//     return this.SendingAvatar;
//   }
//   public failedAvatar = false;
//   public get IsRemoveAvatar(): boolean {
//     return this.SendingAvatar || this.user.avatar === "/shared/defaultman.png";
//   }
//   async SelectFile(e: any) {
//     const file = e.currentTarget.files[0];
//     this.SendingAvatar = true;
//     const result = await userModule.UploadAvatar(file).finally(() => {
//       this.SendingAvatar = false;
//     });

//     if (!result) {
//       this.failedAvatar = true;
//       setTimeout(() => {
//         this.failedAvatar = false;
//       }, 5000);
//     }
//   }
//   RemoveAvatar() {
//     this.SendingAvatar = true;
//     userModule.RemoveAvatar().finally(() => {
//       this.SendingAvatar = false;
//     });
//   }
//   public SendingNickName = false;
//   public get IsSendNickName(): boolean {
//     return (
//       this.SendingPassword ||
//       (this.nickname.Invalid as any) ||
//       (this.nickname.model as any) === this.user.nickname
//     );
//   }
//   SendNickName(nickname: Validations<string>) {
//     if (!nickname.Update()) {
//       this.SendingNickName = true;

//       userModule
//         .UpdateNickName({
//           nickname: nickname.model as unknown as string,
//         })
//         .finally(() => {
//           this.SendingNickName = false;
//         });
//     }
//   }
//   public SendingName = false;
//   public get IsSendName(): boolean {
//     return (
//       this.SendingName ||
//       (this.lastname.Invalid as any) ||
//       (this.firstname.Invalid as any) ||
//       ((this.lastname.model as any) === this.user.lastname &&
//         (this.firstname.model as any) === this.user.firstname)
//     );
//   }

//   SendName(lastname: Validations<string>, firstname: Validations<string>) {
//     if (!lastname.Update() && !firstname.Update()) {
//       this.SendingName = true;

//       userModule
//         .UpdateName({
//           firstname:
//             (firstname.model as unknown as string) !== ""
//               ? (firstname.model as unknown as string)
//               : undefined,
//           lastname:
//             (lastname.model as unknown as string) !== ""
//               ? (lastname.model as unknown as string)
//               : undefined,
//         })
//         .finally(() => {
//           this.SendingName = false;
//         });
//     }
//   }
//   public SendingPassword = false;
//   public get IsSendPassword(): boolean {
//     return (
//       this.SendingPassword ||
//       (this.oldpassword.Invalid as any) ||
//       (this.newpassword.Invalid as any) ||
//       (this.confirmpassword.Invalid as any)
//     );
//   }
//   SendNewPassword(
//     oldpassword: Validations<string>,
//     password: Validations<string>,
//     confirm: Validations<string>
//   ) {
//     if (!oldpassword.Update() && !password.Update() && !confirm.Update()) {
//       this.SendingPassword = true;
//       userModule
//         .UpdatePassword({
//           password: oldpassword.model as unknown as string,
//           newpassword: password.model as unknown as string,
//         })
//         .finally(() => {
//           this.SendingPassword = false;
//         });
//     }
//   }
//   mounted(): void {
//     if (this.user) {
//       (this.nickname.model as any) = this.user.nickname;
//       (this.lastname.model as any) = this.user.lastname || "";
//       (this.firstname.model as any) = this.user.firstname || "";
//     }
//   }
// }
</script>
