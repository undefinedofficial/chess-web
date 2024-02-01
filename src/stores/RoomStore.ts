import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";
import { ROOMTYPE } from "@/models/Datatype.model";
import type { Orientation } from "@/models/Orientation.model";

import { EventEmitter } from "@/services/Emitter";

import {
  CHESSMODE,
  ROOMSTATUS,
  type Move,
  type RoomMeta,
  type RoomResult,
  type RoomTime,
  type Message,
  type ResponceMove,
  ROOMCLAIMS,
} from "@/models/Roomdata.model";

type Events = {
  START_BATTLE: string;
  WAIT_BATTLE: undefined;
  STOP_BATTLE: undefined;

  JOIN_ROOM: string;
  BAD_ROOM: string;
  LEAVE_ROOM: string;

  CLAIM: ROOMCLAIMS;
};

export type ClaimDialog = {
  id: number;
  label: string; // type
  hTimer: any; // handle interval
  count: number; // size time
  clock: number; // current time
  accept: () => void;
  reject: () => void;
};

type ClaimRequest = "serrender" | "stalemate" | "backstep";

export const useRoomStore = defineStore("RoomStore", () => {
  const id = ref<string | null>(null);

  const mode = ref<CHESSMODE>();
  const clock = ref<number>();
  const white = ref<string>();
  const black = ref<string>();
  const create = ref<Date>();
  const status = ref<ROOMSTATUS>(ROOMSTATUS.PREMIERE);
  const result = ref<RoomResult>();

  const time = ref<{
    white: number;
    confirmWhite: number;
    black: number;
    confirmBlack: number;
  }>({
    white: 0,
    confirmWhite: 0,
    black: 0,
    confirmBlack: 0,
  });
  const users = ref<Array<string>>([]);
  const history = ref<Array<Move>>([]);
  const messages = ref<Array<Message>>([]);
  const claims = ref<Array<ClaimDialog>>([]);

  /**
   * if you step return you color;
   * else null that not you step. you watcher.
   */
  const Orientation = computed((): Orientation => {
    if (socketStore.id === white.value) return "w";
    if (socketStore.id === black.value) return "b";
    return "wb";
  });

  const { emit, on } = EventEmitter<Events>();

  const IsOnline = computed(() => {
    return (mode.value || 0) < 100;
  });

  watch(
    history,
    (value) => {
      if (history.value.length === 0 && IsOnline.value && time.value.confirmWhite === 0) {
        time.value.confirmWhite = 20000;
        time.value.confirmBlack = 0;
        return;
      }
      if (history.value.length === 1 && IsOnline.value && time.value.confirmBlack === 0) {
        time.value.confirmBlack = 20000;
        time.value.confirmWhite = 0;
        return;
      }
      /**
       * Sync time not change
       * sync time of last move
       */
      if (history.value.length > 0) {
        time.value.confirmWhite = 0;
        time.value.confirmBlack = 0;

        if (history.value.length % 2 === 0) {
          time.value.black = value[value.length - 1].clock;
        } else {
          time.value.white = value[value.length - 1].clock;
        }
      }
    },
    { deep: true }
  );

  let hTimer: any;
  const UpdateStatus = (value: ROOMSTATUS) => {
    status.value = value;

    if (hTimer) clearInterval(hTimer);
    if (value === ROOMSTATUS.PROCESSED) {
      let last = Date.now();
      hTimer = setInterval(() => {
        const offset = Date.now() - last;
        last = Date.now();

        if (history.value.length > 1 || !IsOnline.value) {
          history.value.length % 2 === 0
            ? (time.value.white -= offset)
            : (time.value.black -= offset);
          return;
        }
        if (history.value.length === 0) {
          time.value.confirmWhite -= offset;
          return;
        }
        if (history.value.length === 1) {
          time.value.confirmBlack -= offset;
          return;
        }
      }, 100);
    }
  };

  const socketStore = useSocketStore();
  socketStore.on("data", ({ type, payload }) => {
    // console.info(type, payload);

    switch (type) {
      case ROOMTYPE.JOIN_ROOM:
        emit("JOIN_ROOM", payload as string);
        return true;
      case ROOMTYPE.LEAVE_ROOM:
        emit("LEAVE_ROOM", payload as string);
        return true;
      case ROOMTYPE.BAD_ROOM:
        emit("BAD_ROOM", payload as string);
        return true;

      case ROOMTYPE.GET_ROOMMETA:
        const meta = payload as RoomMeta;
        mode.value = meta.mode;
        clock.value = meta.clock;
        white.value = meta.whiteId;
        black.value = meta.blackId;
        create.value = new Date(meta.create);
        UpdateStatus(meta.status);
        return true;

      case ROOMTYPE.GET_ROOMTIME:
        const roomtime = payload as RoomTime;
        time.value.confirmWhite = roomtime.cfW;
        time.value.confirmBlack = roomtime.cfB;

        time.value.white = roomtime.w;
        time.value.black = roomtime.b;
        return true;
      case ROOMTYPE.NEW_ROOMSTATUS:
        UpdateStatus(payload as ROOMSTATUS);
        return true;
      case ROOMTYPE.NEW_ROOMRESULT:
        result.value = payload as RoomResult;
        return true;

      case ROOMTYPE.GET_USERS:
        users.value.splice(0);
        users.value.push(...(payload as Array<string>));
        return true;
      case ROOMTYPE.JOIN_USER:
        users.value.push(payload as string);
        return true;
      case ROOMTYPE.LEAVE_USER:
        const userId = payload as string;
        users.value.splice(
          users.value.findIndex((u) => u === userId),
          1
        );
        return true;

      case ROOMTYPE.GET_HISTORY:
        history.value.splice(0);
        history.value.push(...(payload as Array<Move>));
        return true;
      case ROOMTYPE.NEW_HISTORY:
        history.value.push(payload as Move);
        return true;
      case ROOMTYPE.DEL_HISTORY:
        history.value.pop();
        return true;

      case ROOMTYPE.GET_MESSAGES:
        messages.value = (payload as Array<Message>).map<Message>((m) => {
          return {
            senderId: m.senderId,
            body: m.body,
            isSelf: m.senderId === socketStore.id,
          };
        });
        return true;
      case ROOMTYPE.NEW_MESSAGE:
        // eslint-disable-next-line no-case-declarations
        const msg = payload as Message;
        msg.isSelf = msg.senderId === socketStore.id;
        messages.value.push(msg);
        return true;

      case ROOMTYPE.ROOM_CLAIM:
        const claim = payload as ROOMCLAIMS;

        function ClaimToString(claim: ROOMCLAIMS) {
          if (claim === ROOMCLAIMS.CLAIM_BACK) return "соперник просит вернуть ход";
          if (claim === ROOMCLAIMS.CLAIM_DRAW) return "соперник предлагает ничью";
          return "";
        }

        const id = Date.now();
        const cDialog: ClaimDialog = {
          id,
          label: ClaimToString(claim),
          count: 100,
          clock: 100,
          hTimer: setInterval(() => {
            cDialog.clock--;
            if (cDialog.clock < 1) {
              cDialog.reject();
            }
          }, 100),
          accept: () => {
            clearInterval(cDialog.hTimer);
            claims.value.splice(
              claims.value.findIndex((c) => c.id === id),
              1
            );
            switch (claim) {
              case ROOMCLAIMS.CLAIM_BACK:
                return socketStore.Send(ROOMTYPE.NEW_CLAIM, ROOMCLAIMS.CLAIM_BACK_ACCEPT);
              case ROOMCLAIMS.CLAIM_DRAW:
                return socketStore.Send(ROOMTYPE.NEW_CLAIM, ROOMCLAIMS.CLAIM_DRAW_ACCEPT);
            }
          },
          reject: () => {
            clearInterval(cDialog.hTimer);
            claims.value.splice(
              claims.value.findIndex((c) => c.id === id),
              1
            );
            switch (claim) {
              case ROOMCLAIMS.CLAIM_BACK:
                return socketStore.Send(ROOMTYPE.NEW_CLAIM, ROOMCLAIMS.CLAIM_BACK_REJECT);
              case ROOMCLAIMS.CLAIM_DRAW:
                return socketStore.Send(ROOMTYPE.NEW_CLAIM, ROOMCLAIMS.CLAIM_DRAW_REJECT);
            }
          },
        };
        claims.value.push(cDialog);
        break;
      case ROOMTYPE.NEW_CLAIM:
        emit("CLAIM", payload as ROOMCLAIMS);
        break;
    }
  });

  const SendMove = (move: ResponceMove) => {
    socketStore.Send(ROOMTYPE.NEW_HISTORY, move);
  };
  const SendMessage = (body: string) => {
    if (body.trim().length === 0) return;
    console.log(body);

    socketStore.Send(ROOMTYPE.NEW_MESSAGE, body.trim());
  };

  const ClearClaims = () => {
    claims.value.forEach((c) => c.reject());
  };
  const SendClaim = (req: ClaimRequest) => {
    return new Promise((resolve, reject) => {
      switch (req) {
        case "serrender": {
          socketStore.Send(ROOMTYPE.ROOM_CLAIM, ROOMCLAIMS.CLAIM_SERRENDER);
          resolve(true);
          return;
        }
        case "backstep": {
          const offbackstep = on("CLAIM", (claim) => {
            resolve(claim !== ROOMCLAIMS.CLAIM_BACK_REJECT);
            offbackstep();
          });
          socketStore.Send(ROOMTYPE.ROOM_CLAIM, ROOMCLAIMS.CLAIM_BACK);
          return;
        }
        case "stalemate": {
          const offstalemate = on("CLAIM", (claim) => {
            resolve(claim !== ROOMCLAIMS.CLAIM_DRAW_REJECT);
            offstalemate();
          });
          socketStore.Send(ROOMTYPE.ROOM_CLAIM, ROOMCLAIMS.CLAIM_DRAW);
          return;
        }
      }
      reject("How'd I get here?");
    });
  };

  const JoinById = (roomId: string) => {
    return new Promise((resolve, reject) => {
      const joinroom = on("JOIN_ROOM", (connectId) => {
        id.value = connectId;

        /* FOR RESTORE  */
        socketStore.Send(ROOMTYPE.GET_USERS, undefined);
        socketStore.Send(ROOMTYPE.GET_HISTORY, undefined);
        socketStore.Send(ROOMTYPE.GET_MESSAGES, undefined);
        socketStore.Send(ROOMTYPE.GET_ROOMMETA, undefined);
        socketStore.Send(ROOMTYPE.GET_ROOMTIME, undefined);
        joinroom();
        resolve(true);
      });
      const badroom = on("BAD_ROOM", (connectId) => {
        id.value = null;
        badroom();
        resolve(false);
      });
      socketStore.Send(ROOMTYPE.JOIN_ROOM, roomId);
    });
  };

  const Leave = () => {
    return new Promise((resolve) => {
      on("LEAVE_ROOM", () => {
        id.value = null;
        resolve(true);
      });
      socketStore.Send(ROOMTYPE.LEAVE_ROOM, id.value);

      id.value = null;
      mode.value = undefined;
      clock.value = undefined;
      white.value = undefined;
      black.value = undefined;
      create.value = undefined;
      status.value = ROOMSTATUS.PREMIERE;
      result.value = undefined;

      time.value.white = 0;
      time.value.confirmWhite = 0;
      time.value.black = 0;
      time.value.confirmBlack = 0;

      users.value.splice(0);
      history.value.splice(0);
      messages.value.splice(0);
      claims.value.splice(0);
    });
  };

  return {
    id,
    mode,
    clock,
    white,
    black,
    status,
    result,
    time,
    users,
    history,
    messages,
    claims,
    Orientation,
    IsOnline,
    JoinById,
    Leave,
    SendMove,
    SendMessage,
    ClearClaims,
    SendClaim,
  };
});
