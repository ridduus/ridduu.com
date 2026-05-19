import express from "express";
import Skill from "../models/Skill.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ ADD skill
router.post("/", verifyToken, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ UPDATE skill
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ DELETE skill
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Skill deleted",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;