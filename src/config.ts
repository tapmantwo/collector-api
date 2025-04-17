import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    assistantId: process.env.ASSISTANT_ID,
  },
  apiKey: process.env.ANALYSER_KEY,
};
