
import OpenAI from "openai";
import { configDotenv } from "dotenv";

configDotenv();

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export default ai;
