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

router.get("/", cache("1 minutes"), getAllWorkouts);
router.get("/:id", getWorkouts);
router.get("/:id/records", cache("1 minutes"), (request, response) => {
  request.query.workout = request.params.id;
  return getAllRecords(request, response);
});
router.post("/", postWorkout);
router.patch("/:id", patchWorkout);
router.delete("/:id", deleteWorkout);

export default router;
