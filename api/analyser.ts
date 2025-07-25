import OpenAI, { toFile } from "openai";
import { config } from "./config";

const c = config();
const assistantId = c.openai.assistantId as string;
const client = new OpenAI({
  apiKey: c.openai.apiKey,
});

export type Game = {
  name: string;
  publisher: string;
  platform: string;
  release_year: number;
  estimated_value: number;
};

export type AnalysisResult = {
  games: Game[];
  message: string;
};

export const analyse = async (image: Buffer) => {
  const uploadImage = async (): Promise<string> => {
    console.log("Uploading image...");

    // const imageData = await fetch(imageUrl, {
    //   headers: { Accept: "image/jpeg" },
    // });
    // console.log(imageData);
    const result = await client.files.create({
      file: await toFile(image, "image.jpeg"),
      purpose: "vision",
    });
    return result.id;
  };

  const deleteImage = async (fileId: string): Promise<void> => {
    await client.files.delete(fileId);
  };

  // const startThread = async (fileId: string): Promise<string> => {
  //   const thread = await client.beta.threads.create();

  //   await client.beta.threads.messages.create(thread.id, {
  //     role: "user",
  //     content: [
  //       {
  //         type: "image_file",
  //         image_file: {
  //           file_id: fileId,
  //           detail: "auto",
  //         },
  //       },
  //     ],
  //   });

  //   return thread.id;
  // };

  const runPrompt = async (fileId: string): Promise<string> => {
    const result = await client.responses.create({
      prompt: {
        id: "pmpt_6883698dfad0819584b5629031e4fcc50b2a53f786284f91",
      },
      input: [
        {
          role: "user",
          content: [
            {
              detail: "auto",
              type: "input_image",
              file_id: fileId,
            },
          ],
        },
      ],
    });

    return result.output_text;
  };

  // const runThread = async (threadId: string): Promise<string> => {
  //   const run = await client.beta.threads.runs.createAndPoll(threadId, {
  //     assistant_id: assistantId,
  //     additional_instructions: null,
  //   });

  //   if (run.status !== "completed") {
  //     throw new Error(`Run failed with status: ${run.status}`);
  //   }

  //   const messages = await client.beta.threads.messages.list(threadId);

  //   // for (const message of messages.getPaginatedItems()) {
  //   //   console.log(message);
  //   // }
  //   const lastAssistantMessage = messages
  //     .getPaginatedItems()
  //     .filter((m) => m.role === "assistant")
  //     .pop();

  //   console.log("lastAssistantMessage", lastAssistantMessage);

  //   if (lastAssistantMessage?.content[0]?.type !== "text") {
  //     throw new Error(`Run failed with status: ${run.status}`);
  //   }

  //   return lastAssistantMessage.content[0].text.value;
  // };

  const fileId = await uploadImage();
  try {
    const result = await runPrompt(fileId);

    console.log("result", result);
    const parsed = JSON.parse(result);
    console.log("parsed result", parsed);
    return parsed as AnalysisResult;
  } finally {
    await deleteImage(fileId);
  }
};
