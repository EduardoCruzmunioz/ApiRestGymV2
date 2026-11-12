import {
  loadDB,
  createRecord,
  deleteRecord as eliminarRecord,
  updateRecord,
} from "../database/ficheros";
import type { WorkoutRecord } from "../types/workout";
import { v4 as uuid } from "uuid";
import { toHttpError } from "../utils/httpError";

export function getAllRecords(): WorkoutRecord[] {
  try {
    return loadDB().records;
  } catch (error) {
    throw toHttpError(error);
  }
}

export function getRecord(id: string): WorkoutRecord | null {
  try {
    return loadDB().records.find((record) => record.id === id) ?? null;
  } catch (error) {
    throw toHttpError(error);
  }
}

export function postRecord(record: WorkoutRecord): WorkoutRecord {
  try {
    const id: string = uuid();
    record.id = id;
    return createRecord(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export function patchRecord(record: WorkoutRecord): WorkoutRecord {
  try {
    const recordAnt: WorkoutRecord | null = getRecord(record.id);
    if (!recordAnt) {
      throw new Error(`Record with id '${record.id}' not found`);
    }
    if (record.workout == null) record.workout = recordAnt.workout;
    if (record.record == null) record.record = recordAnt.record;
    if (record.memberId == null) record.memberId = recordAnt.memberId;
    if (record.member == null) record.member = recordAnt.member;
    return updateRecord(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export function deleteRecord(id: string): boolean {
  try {
    return eliminarRecord(id);
  } catch (error) {
    throw toHttpError(error);
  }
}
