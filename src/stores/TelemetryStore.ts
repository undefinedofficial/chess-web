import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { useSocketStore } from "./SocketStore";
import { BATTLETYPE } from "@/models/Datatype.model";
import { TELEMETRYTYPE, type DataTelemetry } from "@/models/Telemetry.model";

export const useTelemetryStore = defineStore("TelemetryStore", () => {
  const socketStore = useSocketStore();
  const subscribed = ref(false);

  const users = ref(0);
  const Users = computed(() => users.value);

  const parts = ref(0);
  const Parts = computed(() => parts.value);

  const players = ref(0);
  const Players = computed(() => players.value);

  const bullet = ref(0);
  const Bullet = computed(() => bullet.value);

  const blitz = ref(0);
  const Blitz = computed(() => blitz.value);

  const rapid = ref(0);
  const Rapid = computed(() => rapid.value);

  let stop: () => void;
  const Subscribe = () => {
    if (subscribed.value === true) return;
    subscribed.value = true;

    /*Update listener */
    stop = socketStore.on("data", (data) => {
      if (data.type === BATTLETYPE.TELEMETRY) {
        (data.payload as Array<DataTelemetry>).forEach(({ type, update }) => {
          switch (type) {
            case TELEMETRYTYPE.USERS:
              users.value = update;
              break;
            case TELEMETRYTYPE.PARTS:
              parts.value = update;
              break;
            case TELEMETRYTYPE.PLAYERS:
              players.value = update;
              break;
            case TELEMETRYTYPE.BULLET:
              bullet.value = update;
              break;
            case TELEMETRYTYPE.BLITZ:
              blitz.value = update;
              break;
            case TELEMETRYTYPE.RAPID:
              rapid.value = update;
              break;
          }
        });
        return true;
      }
      return false;
    });

    socketStore.Send(BATTLETYPE.TELEMETRY, subscribed.value);
  };
  const Unsubscribe = () => {
    if (subscribed.value === false) return;

    subscribed.value = false;
    socketStore.Send(BATTLETYPE.TELEMETRY, subscribed.value);
    if (stop) stop();
  };
  return {
    subscribed,
    Subscribe,
    Unsubscribe,
    Users,
    Parts,
    Players,
    Bullet,
    Blitz,
    Rapid,
  };
});
