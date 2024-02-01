<template>
  <div class="piece" :class="'piece-' + piece.type" :style="transformated"></div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";
import type { piece } from "../models/piece.model";

const props = defineProps({
  piece: { type: Object, required: true },
  active: { type: Boolean, default: false },
  duration: { type: Number, default: 200 },
});
const { piece, active, duration } = toRefs<{
  piece: piece;
  active: boolean;
  duration: number;
}>(props as any);

const transformated = computed(() => {
  return {
    transition: `transform ${duration.value}ms ease-in-out`,
    transform:
      "translate3d(" +
      piece.value.x * 51 +
      "px, " +
      piece.value.y * 41.5 +
      "px, " +
      piece.value.y * 25 +
      "px) scale(0.8)",
    "z-index": piece.value.y * 2 + (active.value ? 1 : 0),
  };
});
</script>

<style>
.piece {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 80px;
  background-repeat: no-repeat;
  background-size: contain;
  will-change: transform;
}
.piece-p {
  background-image: url("../assets/bp.png");
}
.piece-P {
  background-image: url("../assets/wp.png");
}

.piece-r {
  background-image: url("../assets/br.png");
}
.piece-R {
  background-image: url("../assets/wr.png");
}

.white .piece-n {
  background-image: url("../assets/bn.png");
}
.white .piece-N {
  background-image: url("../assets/wn.png");
}
.black .piece-n {
  background-image: url("../assets/bn2.png");
}
.black .piece-N {
  background-image: url("../assets/wn2.png");
}

.piece-b {
  background-image: url("../assets/bb.png");
}
.piece-B {
  background-image: url("../assets/wb.png");
}

.piece-q {
  background-image: url("../assets/bq.png");
}
.piece-Q {
  background-image: url("../assets/wq.png");
}

.piece-k {
  background-image: url("../assets/bk.png");
}
.piece-K {
  background-image: url("..//assets/wk.png");
}
</style>
