import type { Point } from "../models/point.model";

export function useCoord() {
  const pointToString = ({ x, y }: Point, orientation = "w"): string => {
    return orientation === "w"
      ? String.fromCharCode(x + 97) + (8 - y).toString()
      : String.fromCharCode(104 - x) + (y + 1).toString();
  };
  const stringToPoint = (coord: string, orientation = "w"): Point => {
    return {
      x: orientation === "w" ? coord.charCodeAt(0) - 97 : 104 - coord.charCodeAt(0),
      y: orientation === "w" ? 8 - parseInt(coord[1]) : parseInt(coord[1]) - 1,
    };
  };
  return { pointToString, stringToPoint };
}
