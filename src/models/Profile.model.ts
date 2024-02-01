export interface Profile {
  nickname: string;
  location: string;
  lastOnline: string | true;
  avatar: string;

  lastname?: string;
  firstname?: string;

  elo: number;
  winBattle: number;
  lossBattle: number;
  drawBattle: number;
}
