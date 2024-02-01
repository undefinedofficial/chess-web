import { ref } from "vue";
import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";
import type { GameMode } from "@/models/Roomdata.model";
import { BATTLETYPE } from "@/models/Datatype.model";

import { EventEmitter } from "@/services/Emitter";

type Events = {
  START_BATTLE: string;
  WAIT_BATTLE: undefined;
  STOP_BATTLE: undefined;

  JOIN_ROOM: string;
  BAD_ROOM: string;
  LEAVE_ROOM: string;
};

export const useBattleStore = defineStore("BattleStore", () => {
  const status = ref<"stop" | "wait" | "start">("stop");
  const { emit, on } = EventEmitter<Events>();

  const socketStore = useSocketStore();
  socketStore.on("data", ({ type, payload }) => {
    switch (type) {
      case BATTLETYPE.START_BATTLE:
        emit("START_BATTLE", payload as string);
        return true;
      case BATTLETYPE.WAIT_BATTLE:
        emit("WAIT_BATTLE", undefined);
        return true;

      case BATTLETYPE.STOP_BATTLE:
        emit("STOP_BATTLE", undefined);
        return true;

      // case BATTLETYPE.JOIN_ROOM:
      //   emit("JOIN_ROOM", payload as string);
      //   return true;
      // case BATTLETYPE.LEAVE_ROOM:
      //   emit("LEAVE_ROOM", payload as string);
      //   return true;
      // case BATTLETYPE.BAD_ROOM:
      //   emit("BAD_ROOM", payload as string);
      //   return true;
    }
  });

  const FindBattle = (gamemode: GameMode) => {
    return new Promise((resolve) => {
      const wait = on("WAIT_BATTLE", () => {
        status.value = "wait";
        wait();
      });
      const start = on("START_BATTLE", (roomId) => {
        status.value = "start";
        start();
        resolve(roomId);
      });
      socketStore.Send(BATTLETYPE.START_BATTLE, gamemode);
    });
  };
  const FindStop = () => {
    return new Promise((resolve) => {
      const stop = on("STOP_BATTLE", () => {
        stop();
      });
      status.value = "stop";
      socketStore.Send(BATTLETYPE.STOP_BATTLE, undefined);
      resolve(true);
    });
  };
  return {
    status,
    FindBattle,
    FindStop,
  };
});
