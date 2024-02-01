import { EventEmitter } from "@/services/Emitter";
import { UciTask } from "@/services/UciTask";
import { ConvertRange } from "@/helpers/convertRange";

type Score = number | null;

export type Move = {
  from: string;
  to: string;
  promotion?: string;
};

type Bounds = "cp" | "mate" | "upper" | "lower";

export type AnalyseMove = {
  depth: number;
  nodes: number;
  score: number;
  bound: Bounds;
  moves: Move[];
};
type SearchOptions = Partial<{
  depth: number;
  wtime: number;
  btime: number;
  winc: number;
  binc: number;
  movestogo: number;
  nodes: number;
  mate: number;
  movetime: number;
  // infinite: boolean;
  ponder: boolean;
  searchmoves: string[];
}>;

type EmitterTypes = {
  MOVE: Move;
  READY: void;
};

export function useStockfish() {
  const uci = new UciTask("/stockfish/stockfish.js");

  const { on, emit } = EventEmitter<EmitterTypes>();

  uci.addEventListener("message", (event) => {
    const data = event && typeof event === "object" ? event.data : event;
    let match;
    /// Did the AI move?
    if ((match = data.match("^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?"))) {
      emit("MOVE", {
        from: match[1],
        to: match[2],
        promotion: match[3],
      });
    }
  });

  const _searchoptions: SearchOptions = {};

  /**
   * SetSkillLevel
   */
  const SetSkillLevel = (value: number) => {
    if (value < 0) {
      value = 0;
    }
    if (value > 20) {
      value = 20;
    }
    uci.uciSet("Skill Level value " + value);

    const err_prob = Math.round(ConvertRange(value, 0, 20, 20, 1));
    const max_err = Math.round(ConvertRange(value, 0, 20, 700, 100));

    uci.uciSet("Skill Level Maximum Error value " + max_err);
    uci.uciSet("Skill Level Probability value " + err_prob);
  };
  /**
   * SetDepth
   */
  const SetDepth = (value: number) => {
    if (value < 1) {
      value = 1;
    }
    if (value > 20) {
      value = 20;
    }
    _searchoptions.depth = value;
  };
  /**
   * SetNodes
   */
  const SetNodes = (value: number) => {
    _searchoptions.nodes = value;
  };
  /**
   * SetPonder
   */
  const SetPonder = (value: boolean) => {
    _searchoptions.ponder = value;
  };
  /**
   * SetInfinite
   */
  const SetInfinite = (value: boolean) => {
    // _searchoptions.infinite = value;
  };
  /**
   * SetTime
   */
  const SetTime = (white: number, black?: number) => {
    _searchoptions.wtime = white;
    _searchoptions.btime = black ? black : white;
  };
  /**
   * SetTimeInc
   */
  const SetTimeInc = (whiteInc: number, blackInc?: number) => {
    _searchoptions.binc = whiteInc;
    _searchoptions.winc = blackInc ? blackInc : whiteInc;
  };
  /**
   * SetElo
   */
  const SetElo = (value: number) => {
    // console.log("ELO", value);

    if (value < 0) {
      value = 0;
    }
    if (value > 3000) {
      value = 3000;
    }

    let skill = Math.round(value / 150);
    if (skill > 19) skill = 19;
    else if (skill < 0) skill = 0;
    uci.uciSet("Skill Level value " + skill);

    const err_prob = Math.round(ConvertRange(skill, 0, 20, 20, 1));
    uci.uciSet("Skill Level Probability value " + err_prob);

    const max_err = Math.round(ConvertRange(skill, 0, 20, 500, 50));
    uci.uciSet("Skill Level Maximum Error value " + max_err);

    // console.log("Calc elo ", skill, err_prob, max_err);
  };

  /**
   * Search
   * @param movesOrFen fen string or moves Array
   * @returns {Promise<Move>} best move promise
   */
  const Search = ({
    fen,
    moves,
  }: {
    fen?: string;
    moves?: Move[];
  }): Promise<Move | undefined> => {
    return new Promise((resolve, reject) => {
      const offmove = on("MOVE", (move) => {
        resolve(move);
        offmove();
      });
      let position = "position ";
      if (fen) {
        position += "fen " + fen;
      } else {
        position = "startpos";
      }
      if (moves && moves.length > 0) {
        position += " moves";
        moves.forEach((move) => {
          position += " " + move.from + move.to + (move.promotion || "");
        });
      }
      uci.uciSend(position);

      let query = "go";
      // if (_searchoptions.infinite) {
      // query += " infinite ";
      // offmove();
      // }
      if (_searchoptions.ponder) {
        query += " ponder ";
      }
      if (_searchoptions.depth) {
        query += " depth " + _searchoptions.depth;
      }
      if (_searchoptions.nodes) {
        query += " nodes " + _searchoptions.nodes;
      }
      if (_searchoptions.wtime) {
        query += " wtime " + _searchoptions.depth;
        query += " btime " + _searchoptions.btime;
        query += " winc " + _searchoptions.winc || 0;
        query += " binc " + _searchoptions.binc || 0;
      }
      if (_searchoptions.movestogo) {
        query += " movestogo " + _searchoptions.movestogo;
      }
      if (_searchoptions.mate) {
        query += " mate  " + _searchoptions.mate;
      }
      if (_searchoptions.movetime) {
        query += " movetime " + _searchoptions.movetime;
      }
      uci.uciSend(query);

      // if (_searchoptions.infinite) {
      //   resolve(undefined);
      // }
    });
  };
  /**
   * Stop
   */
  const NewGame = () => {
    uci.uciSend("ucinewgame");
  };
  /**
   * Stop
   */
  const Stop = () => {
    uci.uciSend("stop");
  };

  const kill = () => uci.terminate();
  return {
    log: uci.log,
    kill,
    SetElo,
    SetSkillLevel,
    SetDepth,
    SetNodes,
    SetPonder,
    SetInfinite,
    SetTime,
    SetTimeInc,
    Search,
    NewGame,
    Stop,
  };
}
