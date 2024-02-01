import { watch, ref } from "vue";
import type { Color } from "../models/color.model";
import { DrawableType, type Drawable } from "../models/drawable.model";
import type { Point } from "../models/point.model";

export type Options = Partial<{
  lineWidth: number;
}>;
type CanvasContext = CanvasRenderingContext2D;

export function useDrawable({ lineWidth }: Options) {
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasContext | null = null;

  /**
   * draw arrow
   * @param {Point} from
   * @param {Point} to
   * @param {Color} color
   * @param {Number} size = 14
   * @param {Number} scope = 7
   */
  const drawArrow = (
    ctx: CanvasContext,
    from: Point,
    to: Point,
    color: Color,
    size = 14,
    scope = 7
  ): void => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - scope * Math.cos(angle - Math.PI / 7),
      to.y - scope * Math.sin(angle - Math.PI / 7)
    );

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(
      to.x - scope * Math.cos(angle + Math.PI / 7),
      to.y - scope * Math.sin(angle + Math.PI / 7)
    );

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(to.x, to.y);
    ctx.lineTo(
      to.x - scope * Math.cos(angle - Math.PI / 7),
      to.y - scope * Math.sin(angle - Math.PI / 7)
    );

    //draws the paths created above
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  };
  /**
   * draw cicle
   * @param {Point} center
   * @param {Color} color
   * @param {Number} radius
   * @param {Number} size
   */
  const drawCircle = (
    ctx: CanvasContext,
    from: Point,
    to: Point,
    color: Color,
    size = 5,
    fill = false
  ): void => {
    if (!fill) {
      const offset = size / 2;
      ctx.beginPath();
      ctx.arc(from.x, from.y, to.y / 2 - offset, 0, 2 * Math.PI, true);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      const radius = to.y / 2,
        innerRadius = 20,
        outerRadius = radius + 5;

      const gradient = ctx.createRadialGradient(
        from.x,
        from.y,
        innerRadius,
        from.x,
        from.y,
        outerRadius
      );
      gradient.addColorStop(0.2, color);
      gradient.addColorStop(0.4, color.substring(0, 7) + "80");
      gradient.addColorStop(1, "#00000000");

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(from.x, from.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  };
  /**
   * draw rect
   * @param {Point} start
   * @param {Point} size
   * @param {Color} color
   * @param {Number} lineWidth
   */
  const drawRect = (
    ctx: CanvasContext,
    start: Point,
    size: Point,
    color: Color,
    lineWidth = 5,
    animate = false
  ): void => {
    const offset = lineWidth / 2;

    const draw = (lineWidth: number) => {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.strokeRect(
        start.x + offset,
        start.y + offset,
        size.x - lineWidth,
        size.y - lineWidth
      );
    };

    if (animate) {
      let count = 4;
      const timer = setInterval(() => {
        if (--count < 1) clearInterval(timer);
        draw(lineWidth / count);
      }, 20);
      return;
    }
    draw(lineWidth);
  };

  const drawlist = ref<Drawable[]>([]);
  const redraw = () => {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (drawlist.value.length === 0) return;

    drawlist.value.forEach((drawable, i) => {
      switch (drawable.type) {
        case DrawableType.RECT:
          drawRect(
            ctx as any,
            drawable.from,
            drawable.to,
            drawable.color,
            drawable.width || lineWidth
          );
          break;
        case DrawableType.CIRCLE:
          drawCircle(
            ctx as any,
            drawable.from,
            drawable.to,
            drawable.color,
            drawable.width || lineWidth,
            drawable.fill
          );
          break;
        case DrawableType.ARROW:
          drawArrow(
            ctx as any,
            drawable.from,
            drawable.to,
            drawable.color,
            drawable.width || lineWidth
          );
          break;
      }
    });
  };
  watch(drawlist, redraw, { deep: true });

  const getCanvas = () => canvas;
  const setCanvas = (cvs: HTMLCanvasElement) => {
    canvas = cvs;
    if (!canvas) throw new Error("Canvas Element invalid");
    ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Context 2D invalid");
    redraw();
  };

  const getContext = () => ctx;

  const clear = () => {
    drawlist.value.splice(0);
  };
  const push = (draw: Drawable) => {
    const id = drawlist.value.length;
    drawlist.value.push(draw);
    return id;
  };
  const pop = () => {
    drawlist.value.pop();
  };
  const getById = (id: number) => {
    return drawlist.value[id];
  };
  const removeById = (id: number) => {
    drawlist.value.splice(id, 1);
  };

  return {
    getCanvas,
    setCanvas,
    getContext,
    clear,
    push,
    pop,
    getById,
    removeById,
    redraw,
    drawlist,
  };
}
