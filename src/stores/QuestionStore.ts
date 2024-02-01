import { defineStore } from "pinia";
import type { Question } from "@/models/Question.model";
import { Post } from "@/api/Request";

export const useQuestionStore = defineStore("QuestionStore", () => {
  const SendQuestion = async (q: Question) => {
    const response = await Post({ url: "/question", toJson: true, body: q });
    return response.ok;
  };
  return {
    SendQuestion,
  };
});
