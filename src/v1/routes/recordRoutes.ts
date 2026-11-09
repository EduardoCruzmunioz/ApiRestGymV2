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

router.get("/", cache("1 minutes"), getAllRecords);
router.get("/:id", getRecord);
router.post("/", postRecord);
router.patch("/:id", patchRecord);
router.delete("/:id", deleteRecord);

export default router;
