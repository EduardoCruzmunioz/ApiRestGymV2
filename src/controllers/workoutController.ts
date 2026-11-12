import type { Request, Response } from "express";
import * as workoutService from "../services/workoutService";
import type { Filtros, Workout } from "../types/workout";
import { toHttpError } from "../utils/httpError";

const MIN_LIMIT = 1;

/**
 * Obtener todos los entrenamientos aplicando filtros opcionales y paginación.
 */
export function getAllWorkouts(request: Request, response: Response) {
  try {
    const { mode, equipment, exercise, trainerTips, limit } =
      request.query as unknown as Filtros;

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

    let workouts: Workout[] = workoutService.getAllWorkouts();

    if (mode) {
      workouts = workouts.filter(
        (workout) => workout.mode.toLowerCase() === mode.toLowerCase(),
      );
    }

    if (equipment) {
      workouts = workouts.filter((workout) =>
        workout.equipment.some((eq) =>
          eq.toLowerCase().includes(equipment.toLowerCase()),
        ),
      );
    }

    if (exercise) {
      workouts = workouts.filter((workout) =>
        workout.exercises.some((ex) =>
          ex.toLowerCase().includes(exercise.toLowerCase()),
        ),
      );
    }

    if (trainerTips) {
      workouts = workouts.filter((workout) =>
        workout.trainerTips.some((tip) =>
          tip.toLowerCase().includes(trainerTips.toLowerCase()),
        ),
      );
    }

    if (parsedLimit) {
      workouts = workouts.slice(0, parsedLimit);
    }

    response.send({
      status: "ok",
      data: workouts,
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
 * Obtener un entrenamiento específico por su identificador único.
 */
export function getWorkouts(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const workout = workoutService.getWorkout(id.toString());
    if (!workout) {
      response.status(404).send({
        status: "fail",
        data: `Workout with id '${id}' not found`,
      });
      return;
    }

    response.send({
      status: "ok",
      data: workout,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export const getWorkout = getWorkouts;

/**
 * Crear un nuevo entrenamiento validando campos obligatorios.
 */
export function postWorkout(request: Request, response: Response) {
  const body: Workout = request.body ?? {};

  if (
    !body.name ||
    !body.exercises ||
    !body.equipment ||
    !body.mode ||
    !body.trainerTips
  ) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const createdWorkout = workoutService.postWorkout(body);
    response.status(201).send({
      status: "ok",
      data: createdWorkout,
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
 * Actualizar parcialmente un entrenamiento existente.
 */
export function patchWorkout(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  const body: Workout = request.body ?? {};
  // No permitir modificar el id ni la fecha de creación
  if (body.id != null || body.createdAt != null) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    body.id = id.toString();
    const updatedWorkout = workoutService.patchWorkout(body);
    response.status(201).send({
      status: "ok",
      data: updatedWorkout,
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
 * Eliminar un entrenamiento por su ID.
 */
export function deleteWorkout(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const result = workoutService.deleteWorkout(id.toString());
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
