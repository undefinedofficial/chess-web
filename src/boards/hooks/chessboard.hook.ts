import { onMounted, ref, toRefs, watch } from "vue";
import type { piece } from "../models/piece.model";
import { useCoord } from "../hooks/coord.hook";

export function useChessboard(props: any, emit: any) {
  const { fen, orientation, duration } = toRefs<{
    fen: string;
    orientation: "w" | "b";
    duration: number;
  }>(props);

  const pieces = ref<Array<piece>>([]);
  let refreshId = "0";
  const RedrawBoard = (refresh: boolean) => {
    pieces.value.splice(0);
    if (!fen.value) return;

    const rows = fen.value.substring(0, fen.value.indexOf(" ")).split("/");
    if (rows.length !== 8) throw new Error("Invalid fen. rows length: " + rows.length);

    if (refresh) refreshId = Date.now().toString();

    const o = orientation.value;
    let i = 0;
    rows.forEach((row, y) => {
      const iy = o === "w" ? y : 7 - y; // index y coord
      for (let x = 0, shift = 0; x < row.length; x++, i++) {
        const e = row[x];

        // continue all shifts
        if (!isNaN(parseInt(e, 10))) {
          shift += parseInt(e, 10) - 1;
          continue;
        }

        const ix = o === "w" ? x + shift : 7 - x - shift; // index x coord
        pieces.value.push({
          id: refreshId + i.toString(),
          type: e as any,
          y: iy,
          x: ix,
        });
      }
    });
  };
  watch(orientation, () => RedrawBoard(false));
  watch(fen, () => RedrawBoard(true));

  const { pointToString, stringToPoint } = useCoord();

  const OnCellEnter = (y: number, x: number, { buttons }: MouseEvent) => {
    if (buttons === 1) {
      if (select.value) {
        select.value.x = x;
        select.value.y = y;
      }
    }
    emit("enter", pointToString({ x, y }, orientation.value));
  };
  const OnCellLeave = (y: number, x: number, { buttons }: MouseEvent) => {
    if (buttons === 1 && !select.value) {
      const piece = pieces.value.find((p) => p.x == x && p.y === y) || null;
      if (piece) {
        emit("before", pointToString(piece, orientation.value), (allow: boolean) => {
          if (allow) {
            select.value = piece;
            before.value = {
              id: piece.id,
              type: piece.type,
              x: piece.x,
              y: piece.y,
            };
          } else {
            select.value = null;
            before.value = null;
          }
        });
      }
    }
    emit("leave", pointToString({ x, y }, orientation.value));
  };

  const before = ref<piece | null>(null); // before state select piece
  const select = ref<piece | null>(null); // select piece

  const OnCellLeftUp = (y: number, x: number) => {
    if (before.value && before.value.x === x && before.value.y === y) {
      emit("cancel", pointToString(before.value, orientation.value));
      select.value = null;
      before.value = null;
      return;
    }

    if (before.value && select.value) {
      select.value.x = x;
      select.value.y = y;
      emit(
        "after",
        pointToString(before.value, orientation.value),
        pointToString(select.value, orientation.value),
        (allow: boolean) => {
          if (!allow && select.value && before.value) {
            select.value.x = before.value.x;
            select.value.y = before.value.y;
          }
          select.value = null;
          before.value = null;
        }
      );
      return;
    }

    const isWhite = (type: string) => type.toUpperCase() === type;
    const piece = pieces.value.find((p) => p.x == x && p.y === y) || null;
    if (piece && (!before.value || isWhite(before.value.type) === isWhite(piece.type))) {
      emit("before", pointToString(piece, orientation.value), (allow: boolean) => {
        if (allow) {
          select.value = piece;
          before.value = {
            id: piece.id,
            type: piece.type,
            x: piece.x,
            y: piece.y,
          };
        }
      });
      return;
    }
  };

  const OnBoardLeave = ({ buttons }: MouseEvent) => {
    if (select.value && before.value) {
      select.value.x = before.value.x;
      select.value.y = before.value.y;
      // if piece drag then remove select piece
      // if (buttons === 1) {
      //   select.value = null;
      //   before.value = null;
      // }
    }
  };

  const move = (fromCoord: string, toCoord: string) => {
    return new Promise((resolve) => {
      const from = stringToPoint(fromCoord, orientation.value);
      const to = stringToPoint(toCoord, orientation.value);
      const piece = pieces.value.find((p) => p.x === from.x && p.y === from.y);
      if (piece) {
        piece.x = to.x;
        piece.y = to.y;
      }
      setTimeout(() => {
        resolve(true);
      }, duration.value);
    });
  };

  onMounted(() => {
    RedrawBoard(true);
  });
  return {
    before,
    pieces,
    select,
    OnCellEnter,
    OnCellLeave,
    OnBoardLeave,
    OnCellLeftUp,
    move,
  };
}
