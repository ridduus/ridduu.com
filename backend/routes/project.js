import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", verifyToken, getProject);
router.post("/", verifyToken, createProject);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;