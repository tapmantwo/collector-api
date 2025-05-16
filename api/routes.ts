import { Router } from "express";
import multer from "multer";
import { analyse } from "./analyser";
import { config } from "./config";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const routes = Router();

routes.get("/", (req: any, res: any) => {
  res.send("Analyser API is running!");
});

routes.post("/analyse", upload.single("image"), async (req: any, res: any) => {
  // check whether the api key is in the headers
  const apiKey = req.headers["x-api-key"];
  const c = config();
  console.log("API Key:", apiKey, c.apiKey);
  if (apiKey !== c.apiKey) {
    return res.status(401).send("Unauthorized: Invalid API key.");
  }

  const { file } = req;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  // Here you can process the image file (e.g., save it, analyze it, etc.)
  const analysis = await analyse(file.buffer);

  // For demonstration, we'll just return the file's original name and size.
  res.json(analysis);

  storage._removeFile(req, file, () => {});
});
