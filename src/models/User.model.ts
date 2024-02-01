import type { Profile } from "./Profile.model";

export type User = Profile & {
  email: string;
  changeEmail: Date;
  changeNickname: string;
};
