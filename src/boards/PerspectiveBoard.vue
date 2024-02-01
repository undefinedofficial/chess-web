<template>
  <div ref="board" class="perspective-board" :disabled="disabled">
    <div
      class="board"
      :style="{
        transform: 'scale(' + scale + ')',
        left: left + 'px',
        top: top + 'px',
        'pointer-events': disabled ? 'none' : 'all',
      }"
    >
      <div class="bg-board"></div>
      <div class="grid-board">
        <div class="grid-container" @mouseleave="OnBoardLeave">
          <div class="row" v-for="y in 8">
            <div
              v-for="x in 8"
              class="cell"
              @contextmenu.prevent
              @mousedown.left="OnCellLeftDown(y - 1, x - 1)"
              @mouseup.left="OnCellLeftUp(y - 1, x - 1)"
              @mousedown.right="OnCellRightDown(y - 1, x - 1, $event)"
              @mouseup.right="OnCellRightUp(y - 1, x - 1)"
              @mouseenter.stop="
                ($event) => {
                  OnCellEnter(y - 1, x - 1, $event);
                  OnEnter(y - 1, x - 1, $event);
                }
              "
              @mouseleave.stop="OnCellLeave(y - 1, x - 1, $event)"
            ></div>
          </div>
          <canvas
            ref="graphic"
            height="600"
            width="600"
            class="grid-effect-layer"
          ></canvas>
          <canvas
            ref="effects"
            height="600"
            width="600"
            class="grid-effect-layer"
          ></canvas>
          <div class="grid-numbers">
            <div v-for="c in 8" :key="c">
              {{ orientation === "w" ? 9 - c : c }}
            </div>
          </div>
          <div class="grid-letters">
            <div v-for="i in 8" :key="i">
              {{
                orientation === "w"
                  ? String.fromCharCode(i + 64)
                  : String.fromCharCode(73 - i)
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="piece-container" :class="orientation === 'w' ? 'white' : 'black'">
        <Piece
          v-for="piece in pieces"
          :key="piece.id"
          :piece="piece"
          :duration="duration"
          :active="piece === select"
        />
        <Piece
          style="opacity: 0.7"
          v-if="before && alphapiece"
          :piece="before"
          :duration="0"
          :active="true"
        />
      </div>
      <transition name="promote">
        <div v-if="promotedCoord !== null" class="promote">
          <Promotion
            style="margin: 8px; top: -32px"
            @promotion="promotedEvent"
            :style="{
              left: (promotedCoord - 1.6) * 12.5 + '%',
              transform: 'scale(.7)',
            }"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from "vue";
import Piece from "./components/PerspectivePiece.vue";
import Promotion from "./components/Promotion.vue";
import { useChessboard } from "./hooks/chessboard.hook";
import { useGraphic } from "./hooks/graphic.hook";
import { useCoord } from "./hooks/coord.hook";

import type {
  CircleGeometry,
  RectGeometry,
  ArrowGeometry,
} from "./models/geometry.model";

const props = defineProps({
  arrows: { type: Array<ArrowGeometry>, default: [] },
  rects: { type: Array<RectGeometry>, default: [] },
  circles: { type: Array<CircleGeometry>, default: [] },
  fen: { type: String, required: true },
  orientation: { type: String, default: "w" },
  duration: { type: Number, default: 100 },
  alphapiece: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["enter", "leave", "before", "after", "cancel", "promoted"]);

const promotedCoord = ref<number | null>(null);
const promotedEvent = ref<(...args: any) => void>(() => {});

const { stringToPoint } = useCoord();

const promote = (coord: string) => {
  return new Promise((resolve, reject) => {
    promotedCoord.value = stringToPoint(coord, props.orientation).x;
    promotedEvent.value = (to) => {
      resolve(to);
      promotedCoord.value = null;
    };
  });
};

const graphic = ref<HTMLCanvasElement | null>(null);
const effects = ref<HTMLCanvasElement | null>(null);
const {
  before,
  pieces,
  select,
  OnBoardLeave,
  OnCellEnter,
  OnCellLeave,
  OnCellLeftUp,
  move,
} = useChessboard(props, emit);

const {
  drawGraphic,
  drawEffects,
  OnCellLeftDown,
  OnCellRightDown,
  OnCellRightUp,
  OnEnter,
} = useGraphic(props);

// const Move = (from: string, to: string) => move(from, to);

//#region scale
let board = ref<HTMLElement | null>(null);
const scale = ref<number>(0);
const left = ref<number>(0);
const top = ref<number>(0);
let hScale: any;
const Rescale = () => {
  if (hScale) clearTimeout(hScale);
  hScale = setTimeout(() => {
    const field = board.value;
    if (field === null) return;

    const wWidth: number = field.clientWidth;
    const wHeight: number = field.clientHeight;
    const sWidth = wWidth / 600;
    const sHeight = wHeight / 450;

    /* Маштаб варируется от 0 до 1.4.
     * При этом выбирается самый меньший из вертикального и горизонтального.
     * И смещение при увеличении. */
    let newscale = sHeight > sWidth ? sWidth : sHeight;
    newscale = newscale > 2.0 ? 2.0 : newscale;
    if (scale.value !== newscale) scale.value = newscale;

    const newleft: number = wWidth / 2 - 600 / 2;
    if (left.value !== newleft) left.value = newleft;

    const newtop: number = wHeight / 2 - 450 / 2;
    if (top.value !== newtop) top.value = newtop;
  }, 10);
};
/*  Изменяет маштаб доски в зависимости от размера экрана  */
window.addEventListener("resize", Rescale);
//#endregion

onMounted(() => {
  Rescale();
  if (!graphic.value) throw new Error("No canvas graphic");
  drawGraphic.setCanvas(graphic.value);

  if (!effects.value) throw new Error("No canvas effects");
  drawEffects.setCanvas(effects.value);
});

defineExpose({
  move,
  promote,
});
</script>

<style lang="scss" scoped>
$duration: 300ms;
.perspective-board {
  position: relative;
  height: 100%;
  margin-left: 0;
  margin-right: 0;
  transition: transform 150 ease-in;
  will-change: transform;
  &:disabled {
    cursor: no-drop;
  }

  .board {
    width: 600px;
    height: 450px;
    position: absolute;

    .bg-board {
      background-image: url("./assets/chessboard.png");
      background-size: cover;
      background-position: center;
      height: 100%;
      width: 100%;
      pointer-events: none;
    }

    .grid-board {
      perspective: 1100px;
      perspective-origin: 50% 50%;
      position: absolute;
      left: 78px;
      top: -26px;
      right: 78px;
      bottom: 52px;
      user-select: none;

      .grid-container {
        position: relative;
        display: grid;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        transform: rotateX(33deg);

        .grid-letters,
        .grid-numbers {
          position: absolute;
          color: #ae9975;
          z-index: 5;
          font-size: 25px;
          text-shadow: 2px 2px 2px rgba(59, 44, 32, 0.5);
          font-weight: bold;
          pointer-events: none;
        }
        .grid-numbers {
          top: 0px;
          left: -30px;
          & div {
            height: 54px;
          }
        }
        .grid-letters {
          bottom: -35px;
          left: 20px;
          display: flex;
          & div {
            width: 55px;
          }
        }

        .row {
          width: 100%;
          display: flex;
          height: 100%;

          // &:nth-child(even) {
          //   .cell:nth-child(odd) {
          //     background: #00a;
          //   }
          //   .cell:nth-child(even) {
          //     background: #a00;
          //   }
          // }
          // &:nth-child(odd) {
          //   .cell:nth-child(even) {
          //     background: #00a;
          //   }
          //   .cell:nth-child(odd) {
          //     background: #a00;
          //   }
          // }
          .cell {
            position: relative;
            display: block;
            width: calc(100% / 8);
            height: 100%;

            .cell-state {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;

              &.select {
                z-index: 2;
                transition: box-shadow 300ms ease;
                box-shadow: inset 0 0 10px 5px yellow;
              }

              &.hover {
                z-index: 3;
                animation: selected 200ms ease forwards;

                &:hover {
                  animation: selected-hover 200ms ease forwards;
                }
              }
            }
          }
        }
        .grid-effect-layer {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          z-index: 10;
          pointer-events: none;
        }
      }
    }
  }
}
.piece-container {
  perspective: 1100px;
  perspective-origin: 50% 50%;

  position: absolute;
  left: 102px;
  top: -18px;
  width: 400px;
  height: 400px;
  pointer-events: none;
  user-select: none;
}

.promote {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto 96px;
  z-index: 40;
  transition: opacity 200ms ease;
}

.promote-enter-from,
.promote-leave-to {
  opacity: 0;
}

@keyframes selected {
  from {
    opacity: 0;
    background: transparent;
  }
  to {
    opacity: 1;
    background: radial-gradient(rgba(0, 255, 80, 1) 5%, transparent);
  }
}
@keyframes selected-hover {
  from {
    opacity: 1;
    background: radial-gradient(rgba(0, 255, 80, 1) 5%, transparent);
  }
  50% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 0, 0, 1) 0%,
      rgba(231, 0, 0, 1) 25%,
      rgba(169, 0, 0, 0) 89%,
      rgba(158, 0, 0, 0) 100%
    );
  }
}
</style>
