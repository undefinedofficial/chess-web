import type { Orientation } from "./Orientation.model";

export const enum CHESSMODE {
  BULLET10 = 10,
  BLITZ50 = 20,
  RAPID100 = 30,

  PLAYER_1 = 101,
  PLAYER_2,
  PLAYER_3,
  PLAYER_4,
  PLAYER_5,
  PLAYER_6,
  PLAYER_7,
  PLAYER_8,
  PLAYER_9,
  PLAYER_10,
  PLAYER_11,
  PLAYER_12,
  PLAYER_13,
  PLAYER_14,
  PLAYER_15,
  PLAYER_16,
  PLAYER_17,
  PLAYER_18,
}

export type ResponceMove = {
  from: string;
  to: string;
  promotion?: string;
};
export type Move = {
  san: string;
  clock: number;
};

export type Message = {
  senderId: string;
  body: string;
  isSelf: boolean;
};

export interface GameMode {
  mode: CHESSMODE;
  orientation: Orientation;
}

export type RoomTime = {
  /**  white time */
  w: number;
  /**  black time */
  b: number;
  /** confirm white time */
  cfW: number;
  /** confirm black time */
  cfB: number;
};

export const enum ROOMSTATUS {
  PREMIERE,
  PROCESSED,
  WHITE_WIN,
  BLACK_WIN,
  WHITE_SURRENDER,
  BLACK_SURRENDER,
  STALEMATE,
  STALEMATE_SURRENDER,
}

export type RoomMeta = {
  mode: CHESSMODE;
  clock: number;
  whiteId: string;
  blackId: string;
  create: Date;
  status: ROOMSTATUS;
};

export type RoomResult = {
  whiteElo: number;
  whiteScore: number;

  blackElo: number;
  blackScore: number;
};

export enum ROOMCLAIMS {
  CLAIM_DRAW = 10,
  CLAIM_DRAW_ACCEPT = 11,
  CLAIM_DRAW_REJECT = 12,

  CLAIM_BACK = 20,
  CLAIM_BACK_ACCEPT = 21,
  CLAIM_BACK_REJECT = 22,

  CLAIM_SERRENDER = 30,
}
