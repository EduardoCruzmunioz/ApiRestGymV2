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
  const apiKey =
    request.headers["x-api-key"] ||
    request.headers["apikey"] ||
    request.query.apiKey ||
    request.query.apikey;

  if (!apiKey) {
    response.status(401).send({
      status: "fail",
      data: "no puedes hacer nada sin la apikey: EduApiKey",
    });
    return;
  }

  if (env.apiKey && apiKey !== env.apiKey) {
    response.status(403).send({
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
