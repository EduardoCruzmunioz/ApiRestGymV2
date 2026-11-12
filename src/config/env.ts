import { readFileSync, existsSync } from "fs";
import path from "path";

let envApiKey = process.env.API_KEY;
let envPort = process.env.PORT;

const envPath = path.resolve(import.meta.dirname, ".env");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
      if (key.trim() === "API_KEY" && !envApiKey) envApiKey = val;
      if (key.trim() === "PORT" && !envPort) envPort = val;
    }
  }
}

export const env = {
  port: Number(envPort || 3002),
  apiKey: envApiKey || "EduApiKey",
};
