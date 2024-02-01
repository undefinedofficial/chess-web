import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/User.model";
import type { Themes } from "@/models/Themes.model";
import type { BoardsSettings } from "@/models/BoardsSettings.model";
import { Del, Get, Post, Put } from "@/api/Request";
import type { SignIn } from "@/models/SignIn.model";
import type { SignUp } from "@/models/SignUp.model";
import type { TokenType } from "@/models/Token.model";
import { useSocketStore } from "./SocketStore";
import type { ForgotPassword } from "@/models/ForgotPassword.model";
import type { ResetPassword } from "@/models/ResetPassword.model";
import type { Settings } from "@/models/Settings.model";

export const useUserStore = defineStore("UserStore", () => {
  const isMute = ref<boolean>(false);
  const IsMute = computed(() => isMute.value);
  const SetMute = (is: boolean) => {
    localStorage.setItem("mute", is ? "true" : "false");
    isMute.value = is;
  };

  const theme = ref<string>("dark");
  const Theme = computed(() => theme.value);
  const SwitchTheme = (value: Themes) => {
    localStorage.setItem("theme", value);
    const html = document.getElementsByTagName("html")[0] as HTMLElement;
    html.classList.remove(theme.value);
    html.classList.add(value);
    theme.value = value;
  };

  const board = ref<BoardsSettings>({
    type: "Perspective",
    duration: 200,
    whiteColor: "#dee3e6",
    blackColor: "#8ca2ad",
    alphapiece: true,
  });
  const Board = computed(() => board.value);
  const ChangeBoard = (value: BoardsSettings) => {
    localStorage.setItem("board", JSON.stringify(value));
    board.value = value;
  };

  const token = ref<TokenType>(null);
  const SetToken = (value: TokenType) => {
    if (token.value === value) return;
    value !== null
      ? localStorage.setItem("token", value)
      : localStorage.removeItem("token");

    token.value = value;
    useSocketStore().RefreshToken(value);
  };
  const user = ref<User | null>(null);
  const LoadMe = async () => {
    if (!token.value) {
      user.value = null;
      return false;
    }

    const responce = await Get({ url: "/me", token: token.value });
    if (!responce.ok) {
      SetToken(null);
      return false;
    }

    user.value = await responce.json();
    return true;
  };

  const ChangeSettings = async (
    type: "email" | "nickname" | "name" | "password",
    update: Settings
  ) => {
    if (!token.value) return null;

    switch (type) {
      case "email": {
        const response = await Put({
          url: "/me/settings/" + type,
          token: token.value as string,
          body: update,
          toJson: true,
        });
        if (response.ok) {
          return response.ok;
        }
        return await response.text();
      }

      case "nickname": {
        const response = await Put({
          url: "/me/settings/" + type,
          token: token.value as string,
          body: update,
          toJson: true,
        });
        if (response.ok) {
          user.value = await response.json();
          return response.ok;
        }
        return await response.text();
      }
      case "name": {
        const response = await Put({
          url: "/me/settings/" + type,
          token: token.value as string,
          body: update,
          toJson: true,
        });
        if (response.ok) {
          user.value = await response.json();
        }
        return response.ok;
      }
      case "password": {
        const response = await Put({
          url: "/me/settings/" + type,
          token: token.value as string,
          body: update,
          toJson: true,
        });
        if (response.ok) {
          return response.ok;
        }
        return await response.text();
      }
    }
  };
  const SignIn = async (vm: SignIn) => {
    const response = await Post({ url: "/signin", body: vm, toJson: true });
    if (!response.ok) return false;

    SetToken(await response.text());
    return await LoadMe();
  };
  const SignUp = async (vm: SignUp) => {
    const response = await Post({ url: "/signup", body: vm, toJson: true });
    return response.status;
  };
  const ForgotPassword = async (vm: ForgotPassword) => {
    const response = await Post({ url: "/forgot", body: vm, toJson: true });
    return response.status;
  };
  const ResetPassword = async (vm: ResetPassword) => {
    const response = await Post({ url: "/resetpass", body: vm, toJson: true });
    return response.status;
  };
  const SignOut = async () => {
    SetToken(null);
    await LoadMe();
  };
  const Confirm = async (hash: string) => {
    const response = await Post({ url: "/confirm", body: { hash }, toJson: true });
    if (!response.ok) return false;
    const obj = await response.json();
    SetToken(obj.token);
    return await LoadMe();
  };
  const ConfirmNewEmail = async (hash: string) => {
    const response = await Post({ url: "/newconfirm", body: { hash }, toJson: true });
    return response.ok;
  };
  const ChangeAvatar = async (file?: File) => {
    if (!token.value) return null;
    /* Upload or remove */
    if (file) {
      const response = await Post({
        url: "/me/avatar",
        body: file,
        token: token.value,
      });
      if (response.ok) {
        user.value = await response.json();
      }
      return response.ok;
    } else {
      const response = await Del({ url: "/me/avatar", token: token.value });
      if (response.ok) {
        user.value = await response.json();
      }
      return response.ok;
    }
  };
  const Reconstruction = async () => {
    const theme = localStorage.getItem("theme");
    SwitchTheme(theme === "light" ? "light" : "dark");

    const board = localStorage.getItem("board");
    if (board) {
      const boardsettings: BoardsSettings = JSON.parse(board);
      if (!boardsettings.type) boardsettings.type = "Perspective";
      if (!boardsettings.duration) boardsettings.duration = 100;
      if (!boardsettings.whiteColor) boardsettings.whiteColor = "#dee3e6";
      if (!boardsettings.blackColor) boardsettings.blackColor = "#8ca2ad";
      if (!boardsettings.alphapiece) boardsettings.alphapiece = true;
      ChangeBoard(boardsettings);
    }

    const isMute = localStorage.getItem("mute");
    SetMute(isMute === "true" ? true : false);

    const token = localStorage.getItem("token");
    if (token) {
      SetToken(token);
      await LoadMe();
    }
  };

  return {
    Reconstruction,

    IsMute,
    Theme,
    Board,
    SetMute,
    SwitchTheme,
    ChangeBoard,

    user,
    token,
    SignIn,
    SignUp,
    SignOut,
    Confirm,
    ConfirmNewEmail,
    ForgotPassword,
    ResetPassword,
    ChangeAvatar,
    ChangeSettings,
  };
});
