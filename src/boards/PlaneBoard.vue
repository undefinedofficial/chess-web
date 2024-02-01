<template>
  <div class="plane-board" :disabled="disabled">
    <div
      class="board"
      :style="{
        '--plane-white': white,
        '--plane-black': black,
        'pointer-events': disabled ? 'none' : 'all',
      }"
    >
      <div class="board-container" @mouseleave="OnBoardLeave">
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
          class="board-effect-layer"
        ></canvas>
        <canvas
          ref="effects"
          height="600"
          width="600"
          class="board-effect-layer"
        ></canvas>

        <div class="row-letters">
          <div v-for="r in 8" :key="r">
            {{
              orientation === "w"
                ? String.fromCharCode(r + 64)
                : String.fromCharCode(73 - r)
            }}
          </div>
        </div>
        <div class="column-numbers">
          <div v-for="c in 8" :key="c">
            {{ orientation === "w" ? 9 - c : c }}
          </div>
        </div>
        <div class="pieces-container">
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
              style="margin: 8px; top: 24px"
              @promotion="promotedEvent"
              :style="{
                left: promotedCoord * 11 + '%',
                transform: 'scale(1.2)',
              }"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from "vue";
import Piece from "./components/PlanePiece.vue";
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

  white: { type: String, default: "#dee3e6" },
  black: { type: String, default: "#8ca2ad" },
});
const { white, black } = toRefs(props);

const emit = defineEmits(["enter", "leave", "before", "after", "cancel", "promote"]);

const { stringToPoint } = useCoord();
const promotedCoord = ref<number | null>(null);
const promotedEvent = ref<(...args: any) => void>(() => {});

const promote = (coord: string) => {
  return new Promise((resolve) => {
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

onMounted(() => {
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
$white: var(--plane-white);
$black: var(--plane-black);
.plane-board {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 4px;
  margin-right: 4px;
  user-select: none;

  .board {
    display: flex;
    justify-content: center;
    width: 100%;
    max-height: 90%;
    aspect-ratio: 1/1;
    will-change: transform;
    .board-container {
      position: relative;
      display: block;
      max-width: 100%;
      height: 100%;
      aspect-ratio: 1/1;
      background: $white;

      .row {
        width: 100%;
        height: calc(100% / 8);
        display: flex;

        &:nth-child(even) .cell:nth-child(odd),
        &:nth-child(odd) .cell:nth-child(even) {
          background: $black;
        }
        .cell {
          position: relative;
          display: block;
          width: calc(100% / 8);
          height: 100%;
        }
      }
      .board-effect-layer {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
      }
      .row-letters,
      .column-numbers {
        display: flex;
        position: absolute;
        color: black;
        z-index: 20;
        // font-size: 1.5rem;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        font-weight: bold;
        pointer-events: none;
        @media (max-width: 700px) {
          // font-size: 1rem;
        }
      }
      .column-numbers {
        flex-direction: column;
        top: 1px;
        left: 1px;
        height: 100%;
        & div {
          text-align: end;
          height: 100%;
        }
      }
      .row-letters {
        left: -1px;
        bottom: -1px;
        width: 100%;
        & div {
          text-align: right;
          width: 100%;
        }
      }
    }
  }
}
.pieces-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}
.promote {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
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
