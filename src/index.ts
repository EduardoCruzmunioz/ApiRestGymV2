import express from "express";
import { Express } from "express";
import { env } from "./config/env";
import workoutRouter, { recordRouter } from "./v1/routes";
import cors from "cors";

const port = env.port;
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/records", recordRouter);

app.listen(port, () =>
  console.log(`Servidor ejecutandose en el puerto (${port})`),
);
