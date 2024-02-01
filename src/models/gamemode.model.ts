import type { CHESSMODE } from "./Roomdata.model";

export type GameMode = {
  avatar: string;
  firstname: string;
  description: string;
  tooltip?: string;
  mode: CHESSMODE;
};
