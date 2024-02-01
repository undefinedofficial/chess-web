import { Post } from "@/api/Request";

export function useNickname() {
  const CheckNickname = async (nickname: string) => {
    if (nickname === "") return false;
    const res = await Post({
      url: "/nick",
      body: {
        nickname,
      },
      toJson: true,
    });
    if (res.status > 399) return false;
    return true;
  };

  return {
    CheckNickname,
  };
}
