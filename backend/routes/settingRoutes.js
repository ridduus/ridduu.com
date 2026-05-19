import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controller/settingController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/settings", getSettings);
router.put("/settings", verifyToken, updateSettings);

export default router;