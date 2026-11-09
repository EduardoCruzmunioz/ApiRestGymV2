import {
  loadDB,
  createRecord,
  deleteRecord as eliminarRecord,
  updateRecord,
} from "../database/ficheros";
import { WorkoutRecord } from "../types/workout";
import { v4 as uuid } from "uuid";
import { toHttpError } from "../utils/httpError";

export function getAllRecords() {
  try {
    return loadDB().records;
  } catch (error) {
    throw toHttpError(error);
  }
}

export function getRecord(id: string) {
  try {
    return loadDB().records.find((record) => record.id == id) ?? null;
  } catch (error) {
    throw toHttpError(error);
  }
}

export function postRecord(record: WorkoutRecord) {
  try {
    const id: string = uuid();
    record.id = id;
    return createRecord(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export function patchRecord(record: WorkoutRecord) {
  try {
    let recordAnt: WorkoutRecord = getRecord(record.id)!;
    if (record.workout == null) record.workout = recordAnt.workout;
    if (record.record == null) record.record = recordAnt.record;
    if (record.memberId == null) record.memberId = recordAnt.memberId;
    if (record.member == null) record.member = recordAnt.member;
    return updateRecord(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export function deleteRecord(id: string) {
  try {
    return eliminarRecord(id);
  } catch (error) {
    throw toHttpError(error);
  }
}
