import express from "express";
import { Express, Request, Response } from "express";
import { env } from "./config/env";
import routerV1 from "./v1/routes";
import cors from "cors";

const port = env.port;
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/workouts", routerV1);

app.listen(port, () =>
  console.log(`Servidor ejecutandose en el puerto (${port})`),
);
