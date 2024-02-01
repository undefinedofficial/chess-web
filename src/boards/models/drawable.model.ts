import type { Color } from "./color.model";
import type { Point } from "./point.model";

export const enum DrawableType {
  RECT = 1,
  CIRCLE,
  ARROW,
}

export interface Drawable {
  type: DrawableType;
  color: Color;
  from: Point;
  to: Point;
  width?: number;
  fill?: boolean;
}
