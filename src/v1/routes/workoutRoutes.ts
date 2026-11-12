import { Router } from "express";
import {
  getAllWorkouts,
  getWorkouts,
  postWorkout,
  patchWorkout,
  deleteWorkout,
  getAllRecords,
} from "../../controller/controller";
import apicache from "apicache";

const router: Router = Router();
const cache = apicache.middleware;

/**
 * @openapi
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         name:
 *           type: string
 *           example: Tommy V
 *         mode:
 *           type: string
 *           example: For Time
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           example: ["barbell", "rope"]
 *         exercises:
 *           type: array
 *           items:
 *             type: string
 *           example: ["21 thrusters", "12 rope climbs, 15 ft"]
 *         createdAt:
 *           type: string
 *           example: "1793014703120"
 *         updatedAt:
 *           type: string
 *           example: "1793014703120"
 *         trainerTips:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Split the 21 thrusters as needed", "Try to do the 9 and 6 thrusters unbroken"]
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         data:
 *           type: string
 *           example: Mensaje descriptivo del error
 */

/**
 * @openapi
 * /api/v1/workouts:
 *   get:
 *     tags:
 *       - Workouts
 *     summary: Obtener lista de todos los entrenamientos
 *     description: Retorna todos los entrenamientos, permitiendo filtrar por modo, equipamiento, ejercicio, consejos y limitar la cantidad de resultados.
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *         description: "Modo del entrenamiento (ej: For Time, AMRAP 12)"
 *       - in: query
 *         name: equipment
 *         schema:
 *           type: string
 *         description: Filtrar por equipamiento requerido
 *       - in: query
 *         name: exercise
 *         schema:
 *           type: string
 *         description: Filtrar por ejercicio incluido
 *       - in: query
 *         name: trainerTips
 *         schema:
 *           type: string
 *         description: Filtrar por consejos del entrenador
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de entrenamientos a devolver (entero positivo)
 *     responses:
 *       200:
 *         description: Lista de entrenamientos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Parámetro límite inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               limiteInvalido:
 *                 value:
 *                   status: fail
 *                   data: limit must be a positive integer
 *       401:
 *         description: No autorizado (falta API Key o no coincide)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               faltaApiKey:
 *                 value:
 *                   status: fail
 *                   data: "no puedes hacer nada sin esta apikey: EduApiKey"
 *               apiKeyInvalida:
 *                 value:
 *                   status: fail
 *                   data: "API Key no válida"
 *       500:
 *         description: Error interno del servidor o de base de datos (HttpError)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: fail
 *               data: Error de lectura o fallo en base de datos
 */
router.get("/", cache("1 minutes"), getAllWorkouts);

/**
 * @openapi
 * /api/v1/workouts/{id}:
 *   get:
 *     tags:
 *       - Workouts
 *     summary: Obtener un entrenamiento por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del entrenamiento
 *     responses:
 *       200:
 *         description: Entrenamiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Parámetro ID ausente o no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: fail
 *               data: Bad request
 *       401:
 *         description: No autorizado (falta o API Key no válida)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrenamiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: fail
 *               data: Workout with id '61dbae02-c147-4e28-863c-db7bd402b2d6' not found
 *       500:
 *         description: Error interno del servidor (HttpError)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getWorkouts);

/**
 * @openapi
 * /api/v1/workouts/{id}/records:
 *   get:
 *     tags:
 *       - Workouts
 *     summary: Obtener los records asociados a un entrenamiento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del entrenamiento del cual obtener los records
 *     responses:
 *       200:
 *         description: Records obtenidos correctamente
 *       400:
 *         description: Parámetro límite o ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor (HttpError)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id/records", cache("1 minutes"), (request, response) => {
  request.query.workout = request.params.id;
  return getAllRecords(request, response);
});

/**
 * @openapi
 * /api/v1/workouts:
 *   post:
 *     tags:
 *       - Workouts
 *     summary: Crear un nuevo entrenamiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mode
 *               - equipment
 *               - exercises
 *               - trainerTips
 *             properties:
 *               name:
 *                 type: string
 *                 example: Murph
 *               mode:
 *                 type: string
 *                 example: For Time
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["pull-up bar"]
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["1 mile run", "100 pull-ups", "200 push-ups", "300 squats", "1 mile run"]
 *               trainerTips:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Divide the pull-ups, push-ups and squats as needed"]
 *     responses:
 *       201:
 *         description: Entrenamiento creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Faltan campos obligatorios en el cuerpo de la petición
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: fail
 *               data: Bad request
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al guardar en base de datos (HttpError)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", postWorkout);

/**
 * @openapi
 * /api/v1/workouts/{id}:
 *   patch:
 *     tags:
 *       - Workouts
 *     summary: Actualizar campos de un entrenamiento existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del entrenamiento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Murph Modificado
 *               mode:
 *                 type: string
 *                 example: For Time
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: string
 *               trainerTips:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Entrenamiento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Intento de modificar ID o fecha de creación, o ID ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: fail
 *               data: Bad request
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al actualizar en base de datos (HttpError)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id", patchWorkout);

/**
 * @openapi
 * /api/v1/workouts/{id}:
 *   delete:
 *     tags:
 *       - Workouts
 *     summary: Eliminar un entrenamiento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del entrenamiento a eliminar
 *     responses:
 *       200:
 *         description: Entrenamiento eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: ID ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: fail
 *               data: Bad request
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al eliminar en base de datos (HttpError)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", deleteWorkout);

export default router;
