export type Reference = {
  move: (from: string, to: string) => Promise<void>;
  promote: (coord: string) => Promise<"q" | "r" | "b" | "n">;
};
