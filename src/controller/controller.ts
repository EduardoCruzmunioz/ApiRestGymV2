import type { Express, Request, Response } from "express";
import * as workoutService from "../services/workoutService";
import * as recordService from "../services/recordService";
import type {
  Filtros,
  FiltrosRecord,
  Workout,
  WorkoutRecord,
} from "../types/workout";
import { toHttpError } from "../utils/httpError";

const MIN_LIMIT = 1;

// ================= WORKOUT CONTROLLERS =================

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
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export function getWorkouts(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
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
        status: 200,
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
    try {
      response.status(201).send({
        status: "ok",
        data: workoutService.postWorkout(body),
      });
    } catch (error: any) {
      const httpError = toHttpError(error);
      response.status(httpError.status).send({
        status: "fail",
        data: httpError.message,
      });
    }
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
      try {
        body.id = id.toString();
        response.status(201).send({
          status: "ok",
          data: workoutService.patchWorkout(body),
        });
      } catch (error: any) {
        const httpError = toHttpError(error);
        response.status(httpError.status).send({
          status: "fail",
          data: httpError.message,
        });
      }
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
    try {
      response.send({
        status: 200,
        data: workoutService.deleteWorkout(id.toString()),
      });
    } catch (error: any) {
      const httpError = toHttpError(error);
      response.status(httpError.status).send({
        status: "fail",
        data: httpError.message,
      });
    }
  }
}

// ================= RECORD CONTROLLERS =================

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

    if (workout)
      records = records.filter(
        (rec) => rec.workout.toLowerCase() === workout.toLowerCase(),
      );

    if (record)
      records = records.filter((rec) =>
        rec.record.toLowerCase().includes(record.toLowerCase()),
      );

    if (memberId)
      records = records.filter(
        (rec) =>
          rec.memberId != null &&
          rec.memberId.toLowerCase() === memberId.toLowerCase(),
      );

    if (member)
      records = records.filter((rec) => {
        if (!rec.member) return false;
        if (typeof rec.member === "string") {
          return rec.member.toLowerCase().includes(member.toLowerCase());
        }
        return rec.member.name.toLowerCase().includes(member.toLowerCase());
      });

    if (parsedLimit) records = records.slice(0, parsedLimit);

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

export function getRecord(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
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
        status: 200,
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
}

export const getRecords = getRecord;

export function postRecord(request: Request, response: Response) {
  const body: WorkoutRecord = request.body ?? {};
  if (body.workout == null || body.record == null) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    try {
      response.status(201).send({
        status: "ok",
        data: recordService.postRecord(body),
      });
    } catch (error: any) {
      const httpError = toHttpError(error);
      response.status(httpError.status).send({
        status: "fail",
        data: httpError.message,
      });
    }
  }
}

export function patchRecord(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    const body: WorkoutRecord = request.body ?? {};
    if (body.id != null) {
      response.status(400).send({
        status: "fail",
        data: "Bad request",
      });
    } else {
      try {
        body.id = id.toString();
        response.status(201).send({
          status: "ok",
          data: recordService.patchRecord(body),
        });
      } catch (error: any) {
        const httpError = toHttpError(error);
        response.status(httpError.status).send({
          status: "fail",
          data: httpError.message,
        });
      }
    }
  }
}

export function deleteRecord(request: Request, response: Response) {
  const id = request.params.id;
  if (id == undefined) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
  } else {
    try {
      response.send({
        status: 200,
        data: recordService.deleteRecord(id.toString()),
      });
    } catch (error: any) {
      const httpError = toHttpError(error);
      response.status(httpError.status).send({
        status: "fail",
        data: httpError.message,
      });
    }
  }
}
