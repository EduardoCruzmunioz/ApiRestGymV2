import type { Request, Response, NextFunction } from "express";
import { HttpError, toHttpError } from "../utils/httpError";

/**
 * Middleware global de captura y formateo de errores.
 * Garantiza que cualquier error no controlado se devuelva siempre en formato JSON estándar para el Frontend.
 */
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const httpError: HttpError = toHttpError(err);

  res.status(httpError.status).send({
    status: "fail",
    data: httpError.message || "Error interno del servidor",
  });
}
