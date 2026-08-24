import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createTestDriveController,
  listTestDrivesController,
  updateTestDriveController,
  deleteTestDriveController
} from "../controllers/testDriveController";

const router = Router();


router.post("/", authMiddleware, createTestDriveController);

router.get("/user/:id", authMiddleware, listTestDrivesController);
router.put("/:id", authMiddleware, updateTestDriveController);
router.delete("/:id", authMiddleware, deleteTestDriveController);

export default router;