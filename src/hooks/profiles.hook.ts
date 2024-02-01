import { Get } from "@/api/Request";
import type { Profile } from "@/models/Profile.model";
import { CHESSMODE } from "@/models/Roomdata.model";
import type { User } from "@/models/User.model";

type BotSpecial = {
  description: string;
  mode: CHESSMODE;
};

const bots = new Map<string, Partial<User> & BotSpecial>([
  [
    "player-1",
    {
      nickname: "",
      firstname: "Емеля",
      avatar: "/res/player-1.png",
      description: "Подходит для тех, кто только учится играть в шахматы!",
      elo: 250,
      mode: CHESSMODE.PLAYER_1,
      location: "ru",
    },
  ],
  [
    "player-2",
    {
      nickname: "",
      firstname: "Анелла",
      avatar: "/res/player-2.png",
      description: "Cоперница для любителей с опытом!",
      elo: 400,
      mode: CHESSMODE.PLAYER_2,
      location: "en",
    },
  ],
  [
    "player-3",
    {
      nickname: "",
      firstname: "Кирилл",
      avatar: "/res/player-3.png",
      description: "Азартный клубный игрок!",
      elo: 650,
      mode: CHESSMODE.PLAYER_3,
      location: "ru",
    },
  ],
  [
    "player-4",
    {
      nickname: "",
      firstname: "Алена",
      avatar: "/res/player-4.png",
      description: "Играет на уровне второго разряда!",
      elo: 800,
      mode: CHESSMODE.PLAYER_4,
      location: "ru",
    },
  ],
  [
    "player-5",
    {
      nickname: "",
      firstname: "Вероника",
      avatar: "/res/player-5.png",
      description: "Играет на уровне сильного первого разряда!",
      elo: 1000,
      mode: CHESSMODE.PLAYER_5,
      location: "ru",
    },
  ],
  [
    "player-6",
    {
      nickname: "",
      firstname: "Роман",
      avatar: "/res/player-6.png",
      description: "Международный мастер и тренер по шахматам!",
      elo: 2650,
      mode: CHESSMODE.PLAYER_6,
      location: "ru",
    },
  ],
  [
    "player-7",
    {
      nickname: "",
      firstname: "Жаслан",
      avatar: "/res/player-7.png",
      description: "",
      elo: 1700,
      mode: CHESSMODE.PLAYER_7,
      location: "kz",
    },
  ],
  [
    "player-8",
    {
      nickname: "",
      firstname: "Макс",
      avatar: "/res/player-8.png",
      description: "",
      elo: 1300,
      mode: CHESSMODE.PLAYER_8,
      location: "ru",
    },
  ],
  [
    "player-9",
    {
      nickname: "",
      firstname: "Дэвид",
      avatar: "/res/player-9.png",
      description: "",
      elo: 1600,
      mode: CHESSMODE.PLAYER_9,
      location: "ru",
    },
  ],
  [
    "player-10",
    {
      nickname: "",
      firstname: "Владимир",
      avatar: "/res/player-10.png",
      description: "",
      elo: 2100,
      mode: CHESSMODE.PLAYER_10,
      location: "ru",
    },
  ],
  [
    "player-11",
    {
      nickname: "",
      firstname: "Алиса",
      avatar: "/res/player-11.png",
      description: "",
      elo: 1900,
      mode: CHESSMODE.PLAYER_11,
      location: "ru",
    },
  ],
  [
    "player-12",
    {
      nickname: "",
      firstname: "Эльдар",
      avatar: "/res/player-12.png",
      description: "",
      elo: 900,
      mode: CHESSMODE.PLAYER_12,
      location: "ru",
    },
  ],
  [
    "player-13",
    {
      nickname: "",
      firstname: "Клара",
      avatar: "/res/player-13.png",
      description: "",
      elo: 720,
      mode: CHESSMODE.PLAYER_13,
      location: "ru",
    },
  ],
  [
    "player-14",
    {
      nickname: "",
      firstname: "Диана",
      avatar: "/res/player-14.png",
      description: "",
      elo: 1350,
      mode: CHESSMODE.PLAYER_14,
      location: "ru",
    },
  ],
  [
    "player-15",
    {
      nickname: "",
      firstname: "Протас",
      avatar: "/res/player-15.png",
      description: "",
      elo: 1430,
      mode: CHESSMODE.PLAYER_15,
      location: "ru",
    },
  ],
  [
    "player-16",
    {
      nickname: "",
      firstname: "Маркус",
      avatar: "/res/player-16.png",
      description: "",
      elo: 580,
      mode: CHESSMODE.PLAYER_16,
      location: "ru",
    },
  ],
  [
    "player-17",
    {
      nickname: "",
      firstname: "Игрок 11",
      avatar: "/res/player-17.png",
      description: "",
      elo: 670,
      mode: CHESSMODE.PLAYER_17,
      location: "ru",
    },
  ],
  [
    "player-18",
    {
      nickname: "",
      firstname: "Игрок 12",
      avatar: "/res/player-18.png",
      description: "",
      elo: 700,
      mode: CHESSMODE.PLAYER_18,
      location: "ru",
    },
  ],
]);

function useProfiles() {
  const LoadByNickName = async (nick: string) => {
    if (!nick) return null;

    if (bots.has(nick)) {
      return bots.get(nick) as Profile;
    }

    const response = await Get({ url: "/p/" + nick });
    if (!response.ok) return null;

    return (await response.json()) as Profile;
  };

  const FindByNickName = async (nick: string) => {
    if (!nick) return null;

    const response = await Get({ url: "/search?q=" + nick });
    if (!response.ok) return [];

    return (await response.json()) as Profile[];
  };

  return {
    LoadByNickName,
    FindByNickName,
  };
}

export { bots, useProfiles };
