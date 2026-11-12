// ================= MODELOS DE DOMINIO =================

export interface Workout {
  id: string;
  name: string;
  mode: string;
  equipment: string[];
  exercises: string[];
  createdAt: string;
  updatedAt: string;
  trainerTips: string[];
}

export interface WorkoutRecord {
  id: string;
  workout: string;
  record: string;
  memberId?: string;
  member?: Miembro | string;
}

export interface Miembro {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface Database {
  workouts: Workout[];
  members: Miembro[];
  records: WorkoutRecord[];
}

// ================= DTOs Y FILTROS DE CONSULTA =================

export interface Filtros {
  mode?: string;
  equipment?: string;
  exercise?: string;
  trainerTips?: string;
  limit?: string;
}

export interface FiltrosRecord {
  workout?: string;
  record?: string;
  memberId?: string;
  member?: string;
  limit?: string;
}

export interface CreateWorkoutDTO {
  name: string;
  mode: string;
  equipment: string[];
  exercises: string[];
  trainerTips: string[];
}

export interface UpdateWorkoutDTO {
  name?: string;
  mode?: string;
  equipment?: string[];
  exercises?: string[];
  trainerTips?: string[];
}

export interface CreateRecordDTO {
  workout: string;
  record: string;
  memberId?: string;
  member?: string;
}

export interface UpdateRecordDTO {
  workout?: string;
  record?: string;
  memberId?: string;
  member?: string;
}

// ================= CONTRATOS DE RESPUESTA PARA FRONTEND =================

export interface ApiSuccessResponse<T> {
  status: "ok";
  data: T;
}

export interface ApiErrorResponse {
  status: "fail";
  data: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
