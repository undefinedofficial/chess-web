export enum TELEMETRYTYPE {
  USERS = 1, // users all online
  PARTS, // parts
  PLAYERS, // users in rooms
  BULLET,
  BLITZ,
  RAPID,
}
export type DataTelemetry = {
  type: TELEMETRYTYPE;
  update: number;
};
