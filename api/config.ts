// @ts-nocheck
import * as dotenv from "dotenv";
dotenv.config();

export const config = () => {
  const { OPENAI_API_KEY, ASSISTANT_ID, ANALYSER_KEY } = process.env;
  return {
    openai: {
      apiKey: OPENAI_API_KEY,
      assistantId: ASSISTANT_ID,
    },
    apiKey: ANALYSER_KEY,
  };
};
