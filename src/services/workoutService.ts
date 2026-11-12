import {
  loadDB,
  createWorkout,
  deleteWorkout as eliminarWorkout,
  updateWorkout,
} from "../database/ficheros";
import type { Workout } from "../types/workout";
import { v4 as uuid } from "uuid";
import { toHttpError } from "../utils/httpError";

export * from "./recordService";

export function getAllWorkouts(): Workout[] {
  return loadDB().workouts;
}

export function getWorkout(id: string): Workout | null {
  try {
    return loadDB().workouts.find((workout) => workout.id === id) ?? null;
  } catch (error) {
    throw toHttpError(error);
  }
}

export function postWorkout(workout: Workout): Workout {
  try {
    const id: string = uuid();
    const timestamp = Date.now().toString();
    workout.id = id;
    workout.createdAt = timestamp;
    workout.updatedAt = timestamp;
    return createWorkout(workout);
  } catch (error) {
    throw toHttpError(error);
  }
}

export function patchWorkout(workout: Workout): Workout {
  try {
    workout.updatedAt = Date.now().toString();
    const workoutAnt: Workout | null = getWorkout(workout.id);
    if (!workoutAnt) {
      throw new Error(`Workout with id '${workout.id}' not found`);
    }
    if (workout.equipment == null) workout.equipment = workoutAnt.equipment;
    if (workout.exercises == null) workout.exercises = workoutAnt.exercises;
    if (workout.name == null) workout.name = workoutAnt.name;
    if (workout.mode == null) workout.mode = workoutAnt.mode;
    if (workout.trainerTips == null) workout.trainerTips = workoutAnt.trainerTips;
    workout.createdAt = workoutAnt.createdAt;
    return updateWorkout(workout);
  } catch (error) {
    throw toHttpError(error);
  }
}

export function deleteWorkout(id: string): boolean {
  try {
    return eliminarWorkout(id);
  } catch (error) {
    throw toHttpError(error);
  }
}
