import { onMounted, ref, toRefs, watch, nextTick } from "vue";

import { useDrawable } from "./drawable.hook";
import { useCoord } from "./coord.hook";
import type {
  CircleGeometry,
  Colors,
  RectGeometry,
  ArrowGeometry,
} from "../models/geometry.model";
import type { Color } from "../models/color.model";
import { DrawableType } from "../models/drawable.model";

export function useGraphic(props: {
  rects: Array<RectGeometry>;
  circles: Array<CircleGeometry>;
  arrows: Array<ArrowGeometry>;
  orientation: string;
}) {
  const { rects, circles, arrows, orientation } = toRefs(props);

  const drawGraphic = useDrawable({});
  const drawEffects = useDrawable({});
  const { stringToPoint } = useCoord();

  let drawable: number | null = null;
  const OnCellRightDown = (
    y: number,
    x: number,
    { ctrlKey, altKey, shiftKey }: MouseEvent
  ) => {
    const effects = drawGraphic.getCanvas();
    if (!effects) return;

    let color = "rgba(38, 148, 14, 0.95)";
    if (ctrlKey) color = "rgba(0, 120, 250, 0.95)";
    else if (altKey) color = "rgba(216, 85, 49, 0.95)";

    const h = effects.height / 8;
    const w = effects.width / 8;

    if (shiftKey) {
      drawable = drawEffects.push({
        type: DrawableType.RECT,
        from: {
          x: x * w,
          y: y * h,
        },
        to: {
          x: w,
          y: h,
        },
        color,
        width: 3,
      });
    } else {
      drawable = drawEffects.push({
        type: DrawableType.CIRCLE,
        from: {
          x: x * w + w / 2,
          y: y * h + h / 2,
        },
        to: {
          x: w,
          y: h,
        },
        color,
        width: 3,
      });
    }
  };
  const OnCellRightUp = (y: number, x: number) => {
    if (drawable !== null) drawEffects.getById(drawable).width = undefined;
    drawable = null;
  };
  const OnEnter = (y: number, x: number, { buttons }: MouseEvent) => {
    if (buttons === 2 && drawable !== null) {
      const canvas = drawEffects.getCanvas();
      if (!canvas) return;

      const effect = drawEffects.getById(drawable);
      if (effect.type === DrawableType.RECT) return;

      const h = canvas.height / 8;
      const w = canvas.width / 8;
      const pointX = x * w + w / 2;
      const pointY = y * h + h / 2;

      if (effect.from.x === pointX && effect.from.y === pointY) {
        effect.type = DrawableType.CIRCLE;
        effect.to = {
          x: w,
          y: h,
        };
        effect.width = 3;
      } else {
        effect.type = DrawableType.ARROW;
        effect.to = {
          x: pointX,
          y: pointY,
        };
        effect.width = 10;
      }
    }
  };
  const OnCellLeftDown = (y: number, x: number) => {
    drawEffects.clear();
  };

  const colors: Record<Colors, Color> = {
    default: "#09b66de0",
    info: "#0081ffe0",
    warn: "#ff8a48e0",
    err: "#bf2233e0",
  };

  const redrawGraphic = () => {
    drawGraphic.clear();

    const effects = drawGraphic.getCanvas();
    if (!effects) return;

    const h = effects.height / 8;
    const w = effects.width / 8;
    const halfW = w / 2;
    const halfH = h / 2;

    rects.value.forEach((rect) => {
      const coord = stringToPoint(rect.from, orientation.value);
      drawGraphic.push({
        type: DrawableType.RECT,
        from: {
          x: coord.x * w,
          y: coord.y * h,
        },
        to: {
          x: w,
          y: h,
        },
        color: colors[rect.color],
      });
    });

    circles.value.forEach((circle) => {
      const coord = stringToPoint(circle.from, orientation.value);
      drawGraphic.push({
        type: DrawableType.CIRCLE,
        from: {
          x: coord.x * w + halfW,
          y: coord.y * h + halfH,
        },
        to: {
          x: w,
          y: h,
        },
        color: colors[circle.color],
        fill: circle.fill,
      });
    });

    arrows.value.forEach((arrow) => {
      const from = stringToPoint(arrow.from, orientation.value);
      const to = stringToPoint(arrow.to, orientation.value);
      drawGraphic.push({
        type: DrawableType.ARROW,
        from: {
          x: from.x * w + halfW,
          y: from.y * h + halfH,
        },
        to: {
          x: to.x * w + halfW,
          y: to.y * h + halfH,
        },
        color: colors[arrow.color],
      });
    });
  };
  watch([circles, rects, arrows], redrawGraphic, { deep: true });

  onMounted(() =>
    nextTick(() => {
      const context = drawEffects.getContext();
      // const def = drawEffects
      //   .getContext()
      //   ?.createRadialGradient(120, 100, 100, 120, 100, 30);

      if (context) {
        // const rendRad = (x: number, y: number, radius: number, color: string) => {
        //   const innerRadius = 15,
        //     outerRadius = 48;
        //   const pointX = x * 75 + radius;
        //   const pointY = y * 75 + radius;
        //   const gradient = context.createRadialGradient(
        //     pointX,
        //     pointY,
        //     innerRadius,
        //     pointX,
        //     pointY,
        //     outerRadius
        //   );
        //   gradient.addColorStop(0, color);
        //   gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        //   context.beginPath();
        //   context.fillStyle = gradient;
        //   context.arc(pointX, pointY, radius, 0, 2 * Math.PI);
        //   context.fill();
        // };
        // for (let y = 0; y < 8; y++) {
        //   for (let x = 0; x < 8; x++) {
        //     rendRad(x, y, 75 / 2, "#f00");
        //   }
        // }
      }
      redrawGraphic();
    })
  );

  return {
    drawGraphic,
    drawEffects,
    OnCellRightDown,
    OnCellRightUp,
    OnEnter,
    OnCellLeftDown,
  };
}
