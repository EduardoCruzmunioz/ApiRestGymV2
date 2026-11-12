import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Middleware para validar la presencia y validez de la API Key en las peticiones.
 * Permite acceso libre a las rutas de documentación Swagger (/api/v1/docs).
 */
export function apiKeyMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // Excluir la documentación de Swagger del control de acceso
  if (request.path.startsWith("/api/v1/docs")) {
    return next();
  }

  // 1. Extraer la API Key de las cabeceras estándar o de la URL
  let rawApiKey =
    request.headers["x-api-key"] ||
    request.headers["apikey"] ||
    request.query.apiKey ||
    request.query.apikey;

  // Si llega como array en query (?apiKey=1&apiKey=2), tomar el primer elemento
  if (Array.isArray(rawApiKey)) {
    rawApiKey = rawApiKey[0];
  }

  const apiKey = typeof rawApiKey === "string" ? rawApiKey.trim() : "";

  // 2. Comprobar presencia
  if (!apiKey) {
    response.status(401).send({
      status: "fail",
      data: `no puedes hacer nada sin esta apikey: ${env.apiKey}`,
    });
    return;
  }

  // 3. Comprobar validez contra la clave configurada en el entorno
  if (apiKey !== env.apiKey) {
    response.status(401).send({
      status: "fail",
      data: "API Key no válida",
    });
    return;
  }

  // 4. Clave correcta: permitir el paso a los routers
  next();
}
