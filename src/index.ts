import express from "express";
import type { Express } from "express";
import { env } from "./config/env";
import workoutRouter, { recordRouter } from "./v1/routes";
import { apiKeyMiddleware } from "./middlewares/auth";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { swaggerDocs } from "./v1/swagger";
import cors from "cors";

const port = env.port;
const app: Express = express();

// ================= MIDDLEWARES GLOBALES =================
app.use(cors());
app.use(express.json());

// Seguridad: Validación de API Key (excluye /api/v1/docs automáticamente)
app.use(apiKeyMiddleware);

// ================= RUTAS DE LA API =================
app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/records", recordRouter);

// Manejador centralizado de errores (siempre al final de las rutas)
app.use(globalErrorHandler);

// ================= ARRANQUE DEL SERVIDOR =================
app.listen(port, () => {
  console.log(`Servidor ejecutandose en el puerto (${port})`);
  swaggerDocs(app, port);
});

export { app };
export default app;
