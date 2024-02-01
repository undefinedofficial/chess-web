import { CHESSMODE } from "@/models/Roomdata.model";
import type { GameMode } from "@/models/gamemode.model";

export function useGameMode() {
  const OnlineModes: Array<GameMode> = [
    {
      avatar: "/res/rocket-launch.svg",
      firstname: "1 + 0",
      description: "Пуля",
      tooltip: "Быстрые минутные шахматы",
      mode: CHESSMODE.BULLET10,
    },
    {
      avatar: "/res/clock-fast.svg",
      firstname: "5 + 0",
      description: "Блиц",
      tooltip: "Партия на 5 мин",
      mode: CHESSMODE.BLITZ50,
    },
    {
      avatar: "/res/timer.svg",
      firstname: "10 + 0",
      description: "Рапид",
      tooltip: "Шахматы на 10 мин",
      mode: CHESSMODE.RAPID100,
    },
  ];

  return { OnlineModes };
}
