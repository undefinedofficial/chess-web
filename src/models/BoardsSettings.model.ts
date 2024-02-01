export type Boards = "Plane" | "Perspective";

export interface BoardsSettings {
  type: Boards;
  duration: number;
  whiteColor?: string;
  blackColor?: string;
  alphapiece: boolean;
}
