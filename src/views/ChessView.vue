<template>
  <div
    class="relative h-full w-full overflow-x-hidden lg:overflow-hidden justify-center grid grid-rows-g-sm grid-cols-g-sm md:snap-y md:grid-rows-g-md md:grid-cols-g-md lg:grid-cols-g-lg lg:grid-rows-g-lg"
  >
    <div
      class="md:my-[20%] my-2 row-start-4 md:row-start-5 md:snap-center md:col-start-2 lg:col-start-1 lg:row-start-1 lg:row-end-4"
    >
      <div
        class="h-full rounded-lg p-1 m-2 md:m-0 bg-l-grey-light-3 dark:bg-d-black-2 shadow-lg"
      >
        <Messenger :messages="roomStore.messages" @send="roomStore.SendMessage">
          <template #header>
            <div class="flex">
              <div class="flex -space-x-4 h-12 m-auto">
                <b-avatar
                  v-for="(u, i) in ExceptPlayers.length > 4 ? 4 : ExceptPlayers.length"
                  :key="u"
                  :nickname="ExceptPlayers[i]"
                  class="border border-l-grey-3 dark:border-d-gray-3"
                  v-cloak
                />
                <div
                  v-if="ExceptPlayers.length > 4"
                  class="relative aspect-square w-12 h-12 bg-l-grey-light dark:bg-d-black rounded-full border dark:border-d-gray-3"
                >
                  <p class="text-center mt-3">{{ ExceptPlayers.length - 4 }}+</p>
                </div>
              </div>
            </div>
          </template>
        </Messenger>
      </div>
    </div>

    <div
      class="h-full w-full row-start-2 brightness-110 dark:brightness-100 md:sticky md:top-0 md:row-start-1 md:row-end-4 md:col-start-1 lg:col-start-2 lg:static lg:w-full md:px-1 lg:px-4"
    >
      <!-- board -->
      <component
        :is="ChessBoardComponent"
        ref="chessboard"
        :rects="rects"
        :arrows="arrows"
        :circles="circles"
        :fen="fen"
        :orientation="orientation"
        :duration="userStore.Board.duration"
        :white="userStore.Board.whiteColor"
        :black="userStore.Board.blackColor"
        :alphapiece="userStore.Board.alphapiece"
        :disabled="!EnableBoard"
        @cancel="OnCancel"
        @enter="OnEnter"
        @leave="OnLeave"
        @before="OnBefore"
        @after="OnAfter"
      />
    </div>

    <div
      class="md:snap-start flex md:items-end row-start-1 md:row-start-1 md:col-start-2 lg:col-start-3"
    >
      <div class="relative h-[44%] md:mb-0 md:min-h-[5rem] w-full">
        <DefaultTimer
          class="border-b border-l-grey-3 dark:border-d-gray-3 md:bg-l-grey-light-3 md:dark:bg-d-black-2 md:rounded-t-lg shadow-lg md:shadow-none"
          :ms="BlackTime"
        >
          <SmallProfile
            :id="BlackId"
            :avatarclass="
              roomStore.users.findIndex((u) => u === BlackId) > -1
                ? 'ring-1 ring-offset-1 ring-c-success'
                : ' '
            "
          ></SmallProfile
        ></DefaultTimer>
        <ConfirmTimer class="absolute z-20 -bottom-8 h-8" :count="ConfirmTimerBlack" />
      </div>
    </div>
    <div class="row-start-5 md:row-start-2 md:snap-center md:col-start-2 lg:col-start-3">
      <div
        class="h-[96%] md:h-full rounded-lg lg:rounded-none px-[1px] m-2 md:m-0 bg-l-grey-light-3 dark:bg-d-black-2"
      >
        <HistoryStepTable
          :activeindex="floatHistoryIndex"
          :history="roomStore.history"
          :status="roomStore.status"
          @step-click="OnFloatHistory"
        />
      </div>
    </div>
    <div
      class="relative md:pb-[20%] md:snap-end flex flex-col w-full md:rounded-b-lg row-start-3 md:row-start-3 md:col-start-2 lg:col-start-3"
    >
      <div
        class="absolute bottom-[42%] md:top-[-34px] w-full border-t border-l-grey-3 dark:border-d-gray-3"
      >
        <div
          v-if="Claim"
          class="absolute left-2 right-2 rounded -top-24 h-24 bg-l-grey-light dark:bg-gray-900 shadow shadow-gray-800"
        >
          <div
            class="flex h-full justify-between items-center text-md text-center mx-4 md:mx-1 z-10"
          >
            <b-button class="text-c-danger text-5xl" @click="Claim.reject"
              ><i class="mdi mdi-close-circle"></i
            ></b-button>
            <p>{{ Claim.label }}</p>
            <b-button
              class="text-c-success text-5xl hover:shadow-white drop-shadow-2xl"
              @click="Claim.accept"
              ><i class="mdi mdi-check-circle"></i
            ></b-button>
          </div>
          <div
            class="h-0.5 bg-c-blue absolute bottom-0"
            :style="{
              width: (Claim.clock * 100) / Claim.count + '%',
              transition: 'width ' + Claim.count * 10 + 'ms linear',
            }"
          ></div>
        </div>
        <OnlineNavigation
          v-if="roomStore.Orientation !== 'wb' && EnableBoard"
          :isback="roomStore.history.length > 2 && roomStore.status === 1"
          :isdraw="roomStore.history.length > 2 && roomStore.status === 1"
          :isbackreq="isBackStepRequest"
          :isdrawreq="isDrawRequest"
          @rotate="RotateOrientation"
          @back="BackStepGame"
          @loss="LossingGame"
          @draw="DrawingGame"
        />
        <WatherNavigation
          v-else
          @rotate="RotateOrientation"
          @exit="router.push('/')"
          @analyse="GoAnalyse"
        />
      </div>
      <div class="relative h-[44%] w-full mt-auto md:mt-0 md:mb-auto md:min-h-[5rem]">
        <ConfirmTimer class="absolute -top-8 h-8" :count="ConfirmTimerWhite" />
        <DefaultTimer
          class="border-t border-l-grey-3 dark:border-d-gray-3 md:rounded-b-lg md:shadow-lg bg-l-grey-light-3 dark:bg-d-black-2"
          :ms="WhiteTime"
        >
          <SmallProfile
            :id="WhiteId"
            :avatarclass="
              roomStore.users.findIndex((u) => u === WhiteId) > -1
                ? 'ring-1 ring-offset-1 ring-c-success'
                : ''
            "
          ></SmallProfile
        ></DefaultTimer>
      </div>
    </div>
  </div>
  <StatusModal
    v-model="isStatusModal"
    :status="GameStatus"
    :whiteid="roomStore.white || ''"
    :whiteelo="roomStore.result?.whiteElo || 0"
    :whitescore="roomStore.result?.whiteScore || 0"
    :blackid="roomStore.black || ''"
    :blackelo="roomStore.result?.blackElo || 0"
    :blackscore="roomStore.result?.blackScore || 0"
  />
  <!-- <EmojiModal/> -->
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Chess } from "chess.ts";

import DefaultTimer from "@/components/Timers/DefaultTimer.vue";
import ConfirmTimer from "@/components/Timers/ConfirmTimer.vue";
import Messenger from "@/components/Navigate/Messenger.vue";
import HistoryStepTable from "@/components/Navigate/HistoryStepTable.vue";
import OnlineNavigation from "@/components/Navigate/OnlineNavigation.vue";
import WatherNavigation from "@/components/Navigate/WatherNavigation.vue";
import SmallProfile from "@/components/profiles/SmallProfile.vue";
import StatusModal from "@/components/Modals/StatusModal.vue";

import type {
  RectGeometry,
  ArrowGeometry,
  CircleGeometry,
  Reference as ChessBoardRef,
} from "@/boards";
import { ROOMSTATUS, type Move, CHESSMODE } from "@/models/Roomdata.model";

import { useUserStore } from "@/stores/UserStore";
import { useRoomStore } from "@/stores/RoomStore";
import { useNotificationStore } from "@/stores/NotificationStore";

import { useStockfish } from "@/hooks/stockfish.hook";
/* Sounds */
import StepWav from "@/assets/sounds/step.wav";
import KillWav from "@/assets/sounds/piece_kill.wav";
import { bots } from "@/hooks/profiles.hook";

const soundStep = new Audio(StepWav);
const soundKill = new Audio(KillWav);

const { ShowNotification } = useNotificationStore();
const router = useRouter();
const userStore = useUserStore();

const ChessBoardComponent = computed(() => {
  if (userStore.Board.type === "Perspective") {
    return defineAsyncComponent(() => import(`@/boards/PerspectiveBoard.vue`));
  } else {
    return defineAsyncComponent(() => import(`@/boards/PlaneBoard.vue`));
  }
});
const chessboard = ref<ChessBoardRef | null>(null);
const EnableBoard = computed(
  () => roomStore.Orientation !== "wb" && roomStore.status === ROOMSTATUS.PROCESSED
);

const roomStore = useRoomStore();

const chess = new Chess();
const fen = ref(chess.fen());

const orientation = ref("w");
const RotateOrientation = () => {
  orientation.value = orientation.value === "w" ? "b" : "w";
};

const WhiteId = computed((): string => {
  return orientation.value === "w" ? roomStore.white || "" : roomStore.black || "";
});
const BlackId = computed((): string => {
  return orientation.value === "b" ? roomStore.white || "" : roomStore.black || "";
});
const WhiteTime = computed(() => {
  return orientation.value === "w" ? roomStore.time.white : roomStore.time.black;
});
const BlackTime = computed(() => {
  return orientation.value === "b" ? roomStore.time.white : roomStore.time.black;
});
const ConfirmTimerWhite = computed(() => {
  return orientation.value === "w"
    ? roomStore.time.confirmWhite
    : roomStore.time.confirmBlack;
});
const ConfirmTimerBlack = computed(() => {
  return orientation.value === "b"
    ? roomStore.time.confirmWhite
    : roomStore.time.confirmBlack;
});

const ExceptPlayers = computed(() => {
  return roomStore.users.filter((u) => u !== roomStore.white && u !== roomStore.black);
});

const rects = ref<Array<RectGeometry & { name?: string }>>([
  // {
  //   from: "a1",
  //   color: "default",
  // },
  // {
  //   from: "b2",
  //   color: "info",
  // },
  // {
  //   from: "c3",
  //   color: "warn",
  // },
  // {
  //   from: "d4",
  //   color: "err",
  // },
]);
const circles = ref<Array<CircleGeometry & { name?: string }>>([
  // {
  //   from: "a3",
  //   color: "default",
  // },
  // {
  //   from: "b4",
  //   color: "info",
  // },
  // {
  //   from: "c5",
  //   color: "warn",
  // },
  // {
  //   from: "d6",
  //   color: "err",
  // },
]);
const arrows = ref<Array<ArrowGeometry>>([
  // {
  //   from: "f3",
  //   to: "h5",
  //   color: "default",
  // },
  // {
  //   from: "e3",
  //   to: "f4",
  //   color: "info",
  // },
  // {
  //   from: "h6",
  //   to: "g5",
  //   color: "warn",
  // },
  // {
  //   from: "g3",
  //   to: "h4",
  //   color: "err",
  // },
]);

let last_offset = 0;
watch(
  roomStore.history,
  async (history) => {
    const offset = history.length - last_offset;
    last_offset = history.length;

    if (offset == 0) return;

    if (offset < 0) {
      const step = chess.undo();
      if (step !== null) {
        if (chessboard.value) await chessboard.value.move(step.to, step.from);
      }
    } else {
      for (let i = history.length - offset; i < history.length; i++) {
        const move = chess.move(history[i].san);
        if (move === null) {
          return;
        }
        if (offset === 1) {
          rects.value.splice(
            0,
            rects.value.length,
            {
              from: move.from,
              color: "warn",
            },
            {
              from: move.to,
              color: "warn",
            }
          );
          if (chessboard.value) await chessboard.value.move(move.from, move.to);
          if (!userStore.IsMute) {
            if (soundKill.readyState >= 2 && move.flags === "c") soundKill.play();
            else if (soundStep.readyState >= 2) soundStep.play();
          }
        }
      }
    }
    fen.value = chess.fen();
    floatHistoryIndex.value = history.length - 1;
    isBackStepRequest.value = false;
  },
  { deep: true }
);

watch(fen, () => {
  if (!chess.gameOver()) {
    AutoMove();
  }

  circles.value = circles.value.filter((circle) => circle["name"] !== "check");
  if (chess.inCheck()) {
    const board = chess.board();
    for (let y = 0; y < board.length; y++) {
      const row = board[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell && cell.type === "k" && cell.color === chess.turn()) {
          circles.value.push({
            name: "check",
            from: String.fromCharCode(x + 97) + (8 - y).toString(),
            color: "err",
            fill: true,
          });
        }
      }
    }
  }
});

const OnCancel = (selected: string) => {
  circles.value = circles.value.filter((circle) => circle["name"] !== "move");
};
const OnEnter = (coord: string) => {
  const move = circles.value.find((m) => m.from === coord && m.name === "move");
  if (move)
    circles.value.push({
      name: "enter",
      from: coord,
      color: "info",
      fill: true,
    });
};
const OnLeave = (coord: string) => {
  if (!circles.value.length) return;
  circles.value = circles.value.filter((circle) => circle.name !== "enter");
};
const OnBefore = (select: string, allow: (is: boolean) => void) => {
  if (floatHistoryIndex.value !== roomStore.history.length - 1) {
    floatHistoryIndex.value = roomStore.history.length - 1;
    fen.value = chess.fen();
    return allow(false);
  }
  /*  Если один из случаев верны (Пустая ячейка, Мат, Не ваш ход) тогда отменить ход */
  if (chess.inCheckmate() || chess.inDraw() || roomStore.Orientation !== chess.turn())
    return allow(false);

  /*  проверка доступных ходов  */
  const moves = chess.moves({
    square: select,
    verbose: true,
  });
  circles.value = circles.value.filter((circle) => circle["name"] !== "move");
  if (moves.length === 0) {
    return allow(false);
  }
  circles.value.push(
    {
      name: "move",
      from: select,
      color: "info",
      fill: true,
    },
    ...moves.map<CircleGeometry>((move) => {
      return {
        name: "move",
        from: move.to,
        color: move.flags === "c" ? "err" : "default",
        fill: true,
      };
    })
  );

  allow(true);
};
const OnAfter = async (before: string, after: string, allow: (is: boolean) => void) => {
  // console.log("After", before, after);

  if (!chessboard.value) throw new Error("chessboard not defined");

  const promotion = chess.isPromotion({ from: before, to: after })
    ? await chessboard.value.promote(after)
    : undefined;

  circles.value = circles.value.filter((circle) => circle.name !== "move");
  const moves = chess.moves({ verbose: true });
  if (moves.length > 0) {
    for (const move of moves) {
      if (move.from !== before || move.to !== after || move.promotion !== promotion)
        continue;

      roomStore.SendMove({
        from: move.from,
        to: move.to,
        promotion,
      });
      return allow(true);
    }
  }
  return allow(false);
};

const floatHistoryIndex = ref(0);
const OnFloatHistory = async (step: Move, index: number) => {
  if (index === floatHistoryIndex.value) return;
  const clone = chess.clone();
  const history = chess.history();
  for (let i = history.length - 1; i !== index; i--) {
    clone.undo();
  }
  fen.value = clone.fen();
  floatHistoryIndex.value = clone.history().length - 1;
};

watch(
  () => roomStore.mode,
  (mode) => {
    chess.reset();
    if (
      (mode && mode < CHESSMODE.PLAYER_1) ||
      roomStore.Orientation === "wb" ||
      roomStore.status !== ROOMSTATUS.PROCESSED
    )
      return;

    stockfish = useStockfish();
    stockfish.NewGame();
    const elo =
      bots.get((roomStore.Orientation === "w" ? roomStore.black : roomStore.white) || "")
        ?.elo || 1000;
    stockfish.SetElo(elo);
    AutoMove();
  }
);

const isStatusModal = ref(false);
watch(
  () => roomStore.status,
  (value) => {
    if (roomStore.Orientation !== "wb" && value > ROOMSTATUS.PROCESSED)
      isStatusModal.value = true;
  }
);

const GameStatus = computed(() => {
  switch (roomStore.status) {
    case ROOMSTATUS.WHITE_WIN:
      if (roomStore.Orientation === "w") return 1;
      else if (roomStore.Orientation === "b") return 2;
      break;
    case ROOMSTATUS.BLACK_WIN:
      if (roomStore.Orientation === "b") return 1;
      else if (roomStore.Orientation === "w") return 2;
      break;
  }
  return 0;
});

const AutoMove = async () => {
  if (
    stockfish &&
    roomStore.Orientation !== "wb" &&
    roomStore.Orientation !== chess.turn()
  ) {
    const move = await stockfish.Search({
      fen: fen.value,
      moves: chess.history({ verbose: true }),
    });
    if (move) {
      roomStore.SendMove(move);
    }
  }
};

/**
 * Watch current self orientation players 'w' or 'b' or 'wb' for watchers
 */
watch(
  () => roomStore.Orientation,
  () => {
    if (roomStore.Orientation !== "wb") {
      orientation.value = roomStore.Orientation;
    } else {
      orientation.value = "w";
    }
  }
);

const Claim = computed(() => {
  const claim = roomStore.claims[0];
  return claim;
});

const isBackStepRequest = ref(false);
const BackStepGame = async () => {
  isBackStepRequest.value = true;
  await roomStore.SendClaim("backstep");
  isBackStepRequest.value = false;
};

const isDrawRequest = ref(false);
const DrawingGame = async () => {
  isDrawRequest.value = true;
  await roomStore.SendClaim("stalemate");
  isDrawRequest.value = false;
};

const LossingGame = async () => {
  await roomStore.SendClaim("serrender");
};

const GoAnalyse = () => {
  router.push({ name: "analyse", query: { fen: fen.value } });
};

let stockfish: ReturnType<typeof useStockfish> | null = null;

onMounted(async () => {
  const route = useRoute();
  if (route.params.id) {
    const isConnect = await roomStore.JoinById(route.params.id.toString());
    if (isConnect) {
      router.beforeEach((_to, _from, next) => {
        if (roomStore.status === ROOMSTATUS.PROCESSED) {
          ShowNotification({
            closable: true,
            type: "info",
            title: "Закончите партию чтобы выйти",
          });
          return;
        }
        stockfish;
        next();
      });
      return;
    }
  }
  router.push({ name: "not found" });
});
onUnmounted(() => {
  if (stockfish) {
    stockfish.kill();
    stockfish = null;
  }
  roomStore.Leave();
});
</script>
