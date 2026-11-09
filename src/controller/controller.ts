import type { Express, Request, Response } from "express";
import * as workoutService from "../services/workoutService.ts";
import type { Filtros, Workout } from "../types/workout.ts";
const MIN_LIMIT = 1;
export function getAllWorkouts(request: Request, response: Response) {
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

  if (mode)
    workouts = workouts.filter(
      (workout) => workout.mode.toLowerCase() === mode.toLowerCase(),
    );

  if (equipment)
    workouts = workouts.filter((workout) =>
      workout.equipment.includes(equipment),
    );

  if (exercise)
    workouts = workouts.filter((workout) =>
      workout.exercises.includes(exercise),
    );

  if (trainerTips)
    workouts = workouts.filter((workout) =>
      workout.trainerTips.includes(trainerTips),
    );

  if (parsedLimit) workouts = workouts.slice(0, parsedLimit);

  response.send({
    status: "ok",
    data: workouts,
  });
}

export function getWorkouts(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    response.send({
      status: 200,
      data: workoutService.getWorkout(id.toString()),
    });
  }
}

export function postWorkout(request: Request, response: Response) {
  const body: Workout = request.body ?? {};
  if (
    body.name == null ||
    body.exercises == null ||
    body.equipment == null ||
    body.mode == null ||
    body.trainerTips == null
  ) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    response.status(201).send({
      status: "ok",
      data: workoutService.postWorkout(body),
    });
  }
}
export function patchWorkout(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    const body: Workout = request.body ?? {};
    if (body.id != null || body.createdAt != null) {
      response.status(400).send({
        status: "fail",
        data: "Bad request",
      });
    } else {
      body.id = id.toString();
      response.status(201).send({
        status: "ok",
        data: workoutService.patchWorkout(body),
      });
    }
  }
}
export function deleteWorkout(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    response.send({
      status: 200,
      data: workoutService.deleteWorkout(id.toString()),
    });
  }
}
