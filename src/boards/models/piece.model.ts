export type PieceType =
  | "k"
  | "q"
  | "r"
  | "n"
  | "b"
  | "p"
  | "K"
  | "Q"
  | "R"
  | "N"
  | "B"
  | "P";

export interface piece {
  id: string;
  type: PieceType;
  x: number;
  y: number;
}
