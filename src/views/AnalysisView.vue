<template>
  <div
    class="h-full w-full overflow-x-hidden lg:overflow-hidden justify-center grid grid-rows-g-sm grid-cols-g-sm md:snap-y md:grid-rows-g-md md:grid-cols-g-md lg:grid-cols-g-lg lg:grid-rows-g-lg"
  >
    <div
      class="md:my-[20%] my-2 row-start-4 md:row-start-5 md:snap-center md:col-start-2 lg:col-start-1 lg:row-start-1 lg:row-end-4"
    >
      <div
        class="h-full rounded-lg p-1 m-2 md:m-0 bg-l-grey-light-3 dark:bg-d-black-2 shadow-lg pb-6 flex"
      >
        <p class="m-auto">В разработке</p>

        <!-- <AnalyseStepTable
          :activeindex="activeMoveIndex"
          :history="ComputedHistory"
          :status="Status"
          @step-click="onGoMove"
        />
        <b-progress :value="ComputedHistory.score + 50" /> -->
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
      class="md:my-[20%] row-start-5 md:row-start-1 md:row-end-4 md:snap-center md:col-start-2 lg:col-start-3"
    >
      <div
        class="h-full relative rounded-lg px-[1px] m-2 md:m-0 bg-l-grey-light-3 dark:bg-d-black-2 overflow-hidden"
      >
        <HistoryStepTable
          :activeindex="floatHistoryIndex"
          :history="roomStore.history"
          :status="1"
          @step-click="OnFloatHistory"
        />
        <div
          class="absolute bottom-1 w-full border-t border-l-grey-3 dark:border-d-gray-3"
        >
          <AnalysisNavigation class="w-full" @rotate="RotateOrientation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import HistoryStepTable from "@/components/Navigate/HistoryStepTable.vue";
import AnalysisNavigation from "@/components/Navigate/AnalysisNavigation.vue";

import { Chess, type PartialMove, type PieceSymbol } from "chess.ts";

import type {
  RectGeometry,
  ArrowGeometry,
  CircleGeometry,
  Reference as ChessBoardRef,
} from "@/boards";
import type { Move } from "@/models/Roomdata.model";

import { useUserStore } from "@/stores/UserStore";
import { useRoomStore } from "@/stores/RoomStore";

/* Sounds */
import StepWav from "@/assets/sounds/step.wav";
import KillWav from "@/assets/sounds/piece_kill.wav";
import { useStockfish } from "@/hooks/stockfish.hook";

const soundStep = new Audio(StepWav);
const soundKill = new Audio(KillWav);

const userStore = useUserStore();
const stockfish = useStockfish();

const ChessBoardComponent = computed(() => {
  if (userStore.Board.type === "Perspective") {
    return defineAsyncComponent(() => import(`@/boards/PerspectiveBoard.vue`));
  } else {
    return defineAsyncComponent(() => import(`@/boards/PlaneBoard.vue`));
  }
});
const chessboard = ref<ChessBoardRef | null>(null);
const EnableBoard = computed(() => {
  return true;
});

const roomStore = useRoomStore();

let chess = new Chess();
const fen = ref(chess.fen());

const orientation = ref("w");
const RotateOrientation = () => {
  orientation.value = orientation.value === "w" ? "b" : "w";
};

const rects = ref<Array<RectGeometry & { name?: string }>>([]);
const circles = ref<Array<CircleGeometry & { name?: string }>>([]);
const arrows = ref<Array<ArrowGeometry>>([]);

watch(fen, () => {
  if (chess.gameOver()) {
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

const Move = async (step: PartialMove, animate = true) => {
  const move = chess.move(step);
  if (move === null) return false;

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
  if (chessboard.value && animate) await chessboard.value.move(move.from, move.to);
  if (!userStore.IsMute) {
    if (soundKill.readyState >= 2 && move.flags === "c") soundKill.play();
    else if (soundStep.readyState >= 2) soundStep.play();
  }
  fen.value = chess.fen();
  floatHistoryIndex.value = history.length - 1;
  return true;
};

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
  if (chess.inCheckmate() || chess.inDraw()) {
    // || roomStore.Orientation !== chess.turn()
    return allow(false);
  }
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
  console.log("After", before, after);

  if (!chessboard.value) throw new Error("chessboard not defined");

  const promotion: PieceSymbol | undefined = chess.isPromotion({
    from: before,
    to: after,
  })
    ? await chessboard.value.promote(after)
    : undefined;

  circles.value = circles.value.filter((circle) => circle.name !== "move");

  if (!(await Move({ from: before, to: after, promotion }))) return allow(false);
  // stockfish
  //   .Search({ fen: fen.value, moves: chess.history({ verbose: true }) })
  //   .then((move) => {
  //     if (move) {
  //       Move(move as PartialMove);
  //     } else {
  //       console.warn(move);
  //     }
  //   });

  

  allow(true);
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

//   async UndoStep() {
//     if (this.History.length) {
//       this.History.pop();
//     }
//   }
// async RedoStep() {
// if (this.undoList.length) {
//   const step = this.undoList.pop();
//   if (step) {
//     this.chess.move(step);
//     await (this.$refs.chessboard as Board).OnMovePiece(step.from, step.to);
//     this.fen = this.chess.fen();
//   }
// }
// }

onMounted(async () => {
  const route = useRoute();

  if (route.query.fen) {
    chess = new Chess(route.query.fen as string);
    fen.value = chess.fen();
  }
  //   this.stockfish.onMayBeMoves = (m) => {
  //     this.ComputedHistory = {
  //       depth: m.depth,
  //       nodes: m.nodes,
  //       score: m.score,
  //       bound: m.bound,
  //       moves: [],
  //     };
  //     this.ComputedHistory.moves.push(...m.moves);
  //   };
  //   // this.stockfish.Debug(true);
  stockfish.SetDepth(20);
  stockfish.SetSkillLevel(1);
  stockfish.SetNodes(10);
  //   // this.stockfish.SetInfinite(true);
  //   this.stockfish
  //     .Search([])
  //     .then((m) => {
  //       console.log("best move ", m);
  //     })
  //     .catch(() => {});
});
onUnmounted(() => {
  // if (this.stfh) this.stfh.kill();
});

// import { Options, Vue } from "vue-class-component";
// import { Watch } from "vue-property-decorator";
// import { userModule } from "@/store/UserModule";

// import { AnalyseMove, Stockfish } from "@/models/Stockfish/";

// /* Boards */
// import TiltedBoard from "@/components/boards/TiltedBoard/TiltedBoard.vue";
// import PlaneBoard from "@/components/boards/PlaneBoard/PlaneBoard.vue";

// /* Components */
// import AnalyseStepTable from "../components/navigations/AnalyseStepTable.vue";
// import HistoryStepTable from "../components/navigations/HistoryStepTable.vue";

// /* Chess engines */
// import { Orientation } from "@/models/utils.chess";
// import { Chess, PieceSymbol } from "chess.ts";

// /* Sounds */
// import StepWav from "@/assets/sounds/step.wav";
// import KillWav from "@/assets/sounds/piece_kill.wav";
// import { Board } from "@/components/boards/models/board";
// import FastBoard from "@/components/boards/FastBoard/FastBoard.vue";

// @Options({
//   components: {
//     TiltedBoard,
//     PlaneBoard,
//     AnalysisNavigation,
//     HistoryStepTable,
//     AnalyseStepTable,
//     FastBoard,
//   },
// })
// export default class ChessView extends Vue {
//   private readonly soundStep = new Audio(StepWav);
//   private readonly soundKill = new Audio(KillWav);
//   private boardEnable = true;

//   public orientation: Orientation = "w";
//   public RotateOrientation() {
//     this.orientation = this.orientation === "w" ? "b" : "w";
//   }

//   private chess = new Chess();
//   public fen = this.chess.fen();

//   public get ChessBoard() {
//     return this.$refs.chessboard as Board;
//   }
//   public get EnableBoard() {
//     return this.boardEnable;
//   }
//   public get BoardStyle() {
//     return userModule.Board;
//   }

//   public ComputedHistory: AnalyseMove = {
//     depth: 0,
//     nodes: 0,
//     score: 0,
//     bound: "cp",
//     moves: [],
//   };

//   notifyWhite = "";
//   notifyBlack = "";
//   @Watch("fen")
//   UpdateFen() {
//     this.notifyWhite = "";
//     this.notifyBlack = "";
//     if (this.chess.inCheckmate()) {
//       this.chess.turn() === "w" ? (this.notifyWhite = "Мат") : (this.notifyBlack = "Мат");
//       return;
//     }
//     if (this.chess.inCheck()) {
//       this.chess.turn() === "w" ? (this.notifyWhite = "Шах") : (this.notifyBlack = "Шах");
//     }
//   }
//   public get NotifyUp() {
//     return this.orientation === "b" ? this.notifyWhite : this.notifyBlack;
//   }
//   public get NotifyDown() {
//     return this.orientation === "w" ? this.notifyWhite : this.notifyBlack;
//   }
//   public get History() {
//     return this.chess.history({ verbose: true });
//   }

//   public get Status(): string {
//     return "";
//   }

//   private last_offset = 0;
//   @Watch("History", { deep: true })
//   async UpdateHistory(value: any) {
//     const offset = value.length - this.last_offset;
//     this.last_offset = value.length;

//     if (offset == 0) return;

//     if (offset < 0) {
//       const step = this.chess.undo();
//       if (step !== null) {
//         await this.ChessBoard.OnMovePiece(step.to, step.from);
//       }
//     } else {
//       for (let i = value.length - offset; i < value.length; i++) {
//         const move = this.chess.move(value[i].san);
//         if (move === null) {
//           return null;
//         }
//         if (offset === 1) {
//         }
//       }
//     }
//     this.activeMoveIndex = value.length - 1;
//   }

//   UndoStep() {
//     this.chess.undo();
//   }
//   // async RedoStep() {
//   // if (this.undoList.length) {
//   //   const step = this.undoList.pop();
//   //   if (step) {
//   //     this.chess.move(step);
//   //     await (this.$refs.chessboard as Board).OnMovePiece(step.from, step.to);
//   //     this.fen = this.chess.fen();
//   //   }
//   // }
//   // }
//   public activeMoveIndex = 0;
//   async onViewBack(step: any, index: number) {
//     if (index === this.activeMoveIndex) return;
//     const history = this.chess.clone();
//     for (let i = history.history().length - 1; i !== index; i--) {
//       history.undo();
//     }
//     this.fen = history.fen();
//     this.activeMoveIndex = history.history().length - 1;
//   }

//   BoardMoveBefore(
//     cell: string,
//     orientation: string,
//     done: (alloweds?: Array<string>) => void
//   ) {
//     if (this.activeMoveIndex !== this.History.length - 1) {
//       this.activeMoveIndex = this.History.length - 1;
//       this.fen = this.chess.fen();
//       return done([]);
//     }
//     // /*  Если один из случаев верны (Пустая ячейка, Мат, Не ваш ход) тогда отменить ход */
//     if (this.chess.inCheckmate() || this.chess.inDraw()) {
//       return done([]);
//     }
//     // /*  проверка доступных ходов  */
//     const moves = this.chess.moves({
//       square: cell,
//       verbose: true,
//     });
//     if (moves.length === 0) {
//       return done([]);
//     }
//     let alloweds: Array<string> = [cell];
//     for (let i = 0; i < moves.length; i++) {
//       alloweds.push(moves[i].to);
//     }
//     return done(alloweds);
//   }
//   async BoardMoveAfter(
//     beforeCoord: string,
//     afterCoord: string,
//     promotion: PieceSymbol,
//     orientation: string,
//     done: (state: boolean) => void
//   ) {
//     const move = this.chess.move({
//       from: beforeCoord,
//       to: afterCoord,
//       promotion,
//     });
//     if (!move) {
//       return done(false);
//     }

//     await (this.$refs.chessboard as Board).OnMovePiece(move.from, move.to);
//     if (!userModule.IsMute) {
//       if (this.soundKill.readyState >= 2 && move.flags === "c") this.soundKill.play();
//       else if (this.soundStep.readyState >= 2) this.soundStep.play();
//     }
//     this.fen = this.chess.fen();

//     this.stockfish
//       ?.Search(
//         this.chess.history({ verbose: true }).map((m) => {
//           return {
//             from: m.from,
//             to: m.to,
//             promotion: m.promotion,
//           };
//         })
//       )
//       .then(async (m) => {
//         const move = this.chess.move(m as any);
//         if (move) {
//           await (this.$refs.chessboard as Board).OnMovePiece(move.from, move.to);
//           if (!userModule.IsMute) {
//             if (this.soundKill.readyState >= 2 && move.flags === "c")
//               this.soundKill.play();
//             else if (this.soundStep.readyState >= 2) this.soundStep.play();
//           }
//           this.fen = this.chess.fen();
//         }
//       })
//       .catch(() => {});
//     return done(true);
//   }

//   BackStepGame() {}

//   onGoMove({
//     from,
//     to,
//     promotion,
//   }: {
//     from: string;
//     to: string;
//     promotion: PieceSymbol;
//   }) {
//     this.BoardMoveAfter(from, to, promotion, this.orientation, () => {});
//   }

//   stockfish?: Stockfish;
//   mounted() {
//     let fen: string | undefined;
//     if (this.$route.query.fen) {
//       fen = this.$route.query.fen as string;
//     }
//     if (this.$route.query.id) {
//     }

//     this.stockfish = new Stockfish();
//     this.stockfish.onMayBeMoves = (m) => {
//       this.ComputedHistory = {
//         depth: m.depth,
//         nodes: m.nodes,
//         score: m.score,
//         bound: m.bound,
//         moves: [],
//       };
//       this.ComputedHistory.moves.push(...m.moves);
//     };
//     // this.stockfish.Debug(true);
//     this.stockfish.SetDepth(20);
//     // this.stockfish.SetSkillLevel(1);
//     // this.stockfish.SetNodes(10);
//     // this.stockfish.SetInfinite(true);
//     this.stockfish
//       .Search([])
//       .then((m) => {
//         console.log("best move ", m);
//       })
//       .catch(() => {});

//     this.chess = new Chess(fen);
//     this.fen = this.chess.fen();
//   }
//   unmounted() {
//     if (this.stockfish) this.stockfish.kill();
//   }
// }
</script>
