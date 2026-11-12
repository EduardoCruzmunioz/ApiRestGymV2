import express from "express";
import { Express, Request, Response, NextFunction } from "express";
import { env } from "./config/env";
import workoutRouter, { recordRouter } from "./v1/routes";
import cors from "cors";

const port = env.port;
const app: Express = express();
app.use(cors());
app.use(express.json());

app.use((request: Request, response: Response, next: NextFunction) => {
  let rawApiKey =
    request.headers["x-api-key"] ||
    request.headers["apikey"] ||
    request.query.apiKey ||
    request.query.apikey;

  if (Array.isArray(rawApiKey)) {
    rawApiKey = rawApiKey[0];
  }

  const apiKey = typeof rawApiKey === "string" ? rawApiKey.trim() : "";

  if (!apiKey) {
    response.status(401).send({
      status: "fail",
      data: "no puedes hacer nada sin esta apikey: EduApiKey",
    });
    return;
  }

  if (apiKey !== env.apiKey) {
    response.status(401).send({
      status: "fail",
      data: "API Key no válida",
    });
    return;
  }

  next();
});

app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/records", recordRouter);

app.listen(port, () =>
  console.log(`Servidor ejecutandose en el puerto (${port})`),
);
