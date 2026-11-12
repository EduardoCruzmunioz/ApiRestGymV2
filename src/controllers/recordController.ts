import type { Request, Response } from "express";
import * as recordService from "../services/recordService";
import type { FiltrosRecord, WorkoutRecord } from "../types/workout";
import { toHttpError } from "../utils/httpError";

const MIN_LIMIT = 1;

/**
 * Obtener todos los records aplicando filtros opcionales por entrenamiento, marca o miembro.
 */
export function getAllRecords(request: Request, response: Response) {
  try {
    const { workout, record, memberId, member, limit } =
      request.query as unknown as FiltrosRecord;

    const parsedLimit = limit == undefined ? undefined : Number(limit);
    if (
      parsedLimit != undefined &&
      (!Number.isInteger(parsedLimit) || parsedLimit < MIN_LIMIT)
    ) {
      response.status(400).send({
        status: "fail",
        data: "limit must be a positive integer",
      });
      return;
    }

    let records: WorkoutRecord[] = recordService.getAllRecords();

    if (workout) {
      records = records.filter(
        (rec) => rec.workout.toLowerCase() === workout.toLowerCase(),
      );
    }

    if (record) {
      records = records.filter((rec) =>
        rec.record.toLowerCase().includes(record.toLowerCase()),
      );
    }

    if (memberId) {
      records = records.filter(
        (rec) =>
          rec.memberId != null &&
          rec.memberId.toLowerCase() === memberId.toLowerCase(),
      );
    }

    if (member) {
      records = records.filter((rec) => {
        if (!rec.member) return false;
        if (typeof rec.member === "string") {
          return rec.member.toLowerCase().includes(member.toLowerCase());
        }
        return rec.member.name.toLowerCase().includes(member.toLowerCase());
      });
    }

    if (parsedLimit) {
      records = records.slice(0, parsedLimit);
    }

    response.send({
      status: "ok",
      data: records,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

/**
 * Obtener un record por su identificador único.
 */
export function getRecord(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const record = recordService.getRecord(id.toString());
    if (!record) {
      response.status(404).send({
        status: "fail",
        data: `Record with id '${id}' not found`,
      });
      return;
    }

    response.send({
      status: "ok",
      data: record,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export const getRecords = getRecord;

/**
 * Crear un nuevo record validando que incluya el workout asociado y la marca.
 */
export function postRecord(request: Request, response: Response) {
  const body: WorkoutRecord = request.body ?? {};

  if (!body.workout || !body.record) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const createdRecord = recordService.postRecord(body);
    response.status(201).send({
      status: "ok",
      data: createdRecord,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

/**
 * Actualizar parcialmente un record existente.
 */
export function patchRecord(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  const body: WorkoutRecord = request.body ?? {};
  // No permitir modificar el identificador
  if (body.id != null) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    body.id = id.toString();
    const updatedRecord = recordService.patchRecord(body);
    response.status(201).send({
      status: "ok",
      data: updatedRecord,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

/**
 * Eliminar un record por su identificador.
 */
export function deleteRecord(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const result = recordService.deleteRecord(id.toString());
    response.send({
      status: "ok",
      data: result,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}
