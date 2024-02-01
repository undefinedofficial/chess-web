import { ref } from "vue";
import { defineStore } from "pinia";

import type { TokenType } from "@/models/Token.model";
import { BATTLETYPE, type DATATYPE } from "@/models/Datatype.model";

import { useNotificationStore } from "./NotificationStore";
import { useUserStore } from "./UserStore";
import { EventEmitter } from "@/services/Emitter";

interface NodePacket<T> {
  t: T;
  p: undefined | unknown | number | string | NodePacket<any> | Array<object>;
}

function Serialize<T>(data: NodePacket<T>): string {
  return JSON.stringify(data);
}
function Deserialize<T>(data: string): NodePacket<T> {
  return JSON.parse(data);
}

type Events = {
  data: { type: DATATYPE; payload: unknown };
  resume: boolean; // normal?
  suspend: boolean; // wasclean
};

export const useSocketStore = defineStore("SocketStore", () => {
  let socket: WebSocket;
  const id = ref<string>();
  const { on, off, emit } = EventEmitter<Events>();

  const { ShowNotification } = useNotificationStore();

  const Send = (type: DATATYPE, payload: unknown) => {
    if (!socket || socket.readyState !== socket.OPEN) {
      console.warn("error send message " + type + " status " + socket.readyState);
      // ShowNotification({
      //   type: "error",
      //   closable: true,
      //   icon: "mdi-emoticon-sad",
      //   title: "Соединение с chesswood потеряно",
      //   description: "Перезагрузите страницу",
      //   timeout: 20,
      // });
      return;
    }
    socket.send(Serialize({ t: type, p: payload }));
  };

  const CreateSocket = (token: TokenType) => {
    return new Promise((resolve) => {
      let cookie;
      if (!token || token.length < 1) {
        cookie = localStorage.getItem("session") || undefined;
      } else {
        cookie = "Bearer " + token;
      }
      document.cookie = `token=${cookie}; Path=/api/; SameSite=Strict; Secure; max-age=5000`;
      if (socket) {
        socket.close();
      }
      socket = new WebSocket(
        import.meta.env.VITE_VUE_APP_BACKEND_WEBSOCKET + "/api/ws/chess"
      );
      socket.onopen = () => {
        document.cookie = `token=; SameSite=Strict; Secure; max-age=-1`;
        emit("resume", true);
        resolve(true);
      };
      socket.onerror = (e: Event) => {
        console.warn("socket error: ", e);
        resolve(false);
      };
      socket.onclose = (e: CloseEvent) => {
        if (!e.wasClean) {
          console.warn("ws close code: " + e.code);
          ShowNotification({
            type: "error",
            closable: true,
            icon: "mdi-emoticon-sad",
            title: "Соединение с chesswood потеряно",
            description: "Перезагрузите страницу",
            timeout: 20,
          });
        }
        emit("suspend", e.wasClean);
        resolve(false);
      };
      socket.onmessage = (e: MessageEvent) => {
        const data = Deserialize<DATATYPE>(e.data);
        if (data.t === BATTLETYPE.AUTH) {
          id.value = data.p as string;
          // console.log(id.value);
          if (!token || token.length < 1) {
            localStorage.setItem("session", id.value);
          }
          return;
        }
        emit("data", { type: data.t, payload: data.p });
      };
    });
  };

  const RefreshToken = async (token: TokenType) => {
    if (
      !socket ||
      socket.readyState === socket.CLOSING ||
      socket.readyState === socket.CLOSED
    ) {
      return;
    }
    await CreateSocket(token);
  };

  const Connect = async () => {
    const { token } = useUserStore();
    if (
      !socket ||
      socket.readyState === socket.CLOSING ||
      socket.readyState === socket.CLOSED
    ) {
      await CreateSocket(token);
    }
  };
  const Disconnect = () => {
    if (socket) socket.close();
  };

  return { Connect, Disconnect, RefreshToken, Send, on, off, id };
});
