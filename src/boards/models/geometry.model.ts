export type Colors = "default" | "info" | "warn" | "err";

type ProtoGeometry = {
  from: string;
  to: string;
  color: Colors;
};

export type RectGeometry = Omit<ProtoGeometry, "to">;
export interface CircleGeometry extends Omit<ProtoGeometry, "to"> {
  fill: boolean;
}
export type ArrowGeometry = ProtoGeometry;
