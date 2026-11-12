import { Router } from "express";
import {
  getAllRecords,
  getRecord,
  postRecord,
  patchRecord,
  deleteRecord,
} from "../../controller/controller";
import apicache from "apicache";

const router: Router = Router();
const cache = apicache.middleware;

/**
 * @openapi
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: ad75d475-ac57-44f4-a02a-8f6def58ff56
 *         workout:
 *           type: string
 *           description: ID del entrenamiento asociado
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         record:
 *           type: string
 *           description: Marca o puntuación obtenida
 *           example: 160 reps
 *         memberId:
 *           type: string
 *           description: ID del miembro que logró el récord
 *           example: 12a410bc-849f-4e7e-bfc8-4ef283ee4b19
 *         member:
 *           type: string
 *           description: Nombre o ruta del miembro
 *           example: Mario
 */

/**
 * @openapi
 * /api/v1/records:
 *   get:
 *     tags:
 *       - Records
 *     summary: Obtener lista de todos los records
 *     description: Retorna la lista de records registrados, con soporte de filtrado por entrenamiento, marca, miembro y límite de resultados.
 *     parameters:
 *       - in: query
 *         name: workout
 *         schema:
 *           type: string
 *         description: Filtrar records por ID del entrenamiento
 *       - in: query
 *         name: record
 *         schema:
 *           type: string
 *         description: Filtrar por texto contenido en la marca (ej. reps, 13:45)
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: string
 *         description: Filtrar por ID del miembro
 *       - in: query
 *         name: member
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del miembro
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de records a devolver (entero positivo)
 *     responses:
 *       200:
 *         description: Lista de records obtenida con éxito
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
 *                     $ref: '#/components/schemas/Record'
 *       400:
 *         description: Parámetro límite inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 data:
 *                   type: string
 *                   example: limit must be a positive integer
 *       401:
 *         description: No autorizado (falta o API Key incorrecta)
 */
router.get("/", cache("1 minutes"), getAllRecords);

/**
 * @openapi
 * /api/v1/records/{id}:
 *   get:
 *     tags:
 *       - Records
 *     summary: Obtener un record por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del récord
 *     responses:
 *       200:
 *         description: Récord encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Record'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Récord no encontrado
 */
router.get("/:id", getRecord);

/**
 * @openapi
 * /api/v1/records:
 *   post:
 *     tags:
 *       - Records
 *     summary: Registrar un nuevo record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workout
 *               - record
 *             properties:
 *               workout:
 *                 type: string
 *                 example: d8be2362-7b68-4ea4-a1f4-c86c1dc2dc5e
 *               record:
 *                 type: string
 *                 example: 14:10
 *               memberId:
 *                 type: string
 *                 example: 12a410bc-849f-4e7e-bfc8-4ef283ee4b19
 *               member:
 *                 type: string
 *                 example: Mario
 *     responses:
 *       201:
 *         description: Récord creado con éxito
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
 *         description: Faltan campos obligatorios (workout o record)
 *       401:
 *         description: No autorizado
 */
router.post("/", postRecord);

/**
 * @openapi
 * /api/v1/records/{id}:
 *   patch:
 *     tags:
 *       - Records
 *     summary: Actualizar campos de un record existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del récord a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workout:
 *                 type: string
 *                 example: d8be2362-7b68-4ea4-a1f4-c86c1dc2dc5e
 *               record:
 *                 type: string
 *                 example: 13:30
 *               memberId:
 *                 type: string
 *               member:
 *                 type: string
 *     responses:
 *       201:
 *         description: Récord actualizado
 *       400:
 *         description: ID no modificable o petición incorrecta
 *       401:
 *         description: No autorizado
 */
router.patch("/:id", patchRecord);

/**
 * @openapi
 * /api/v1/records/{id}:
 *   delete:
 *     tags:
 *       - Records
 *     summary: Eliminar un record por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del récord a eliminar
 *     responses:
 *       200:
 *         description: Récord eliminado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteRecord);

export default router;
