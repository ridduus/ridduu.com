import express from "express";
import Education from "../models/Education.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Education.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const { university, degree, location, period, logo } = req.body;

    const newData = await Education.create({
      university,
      degree,
      location,
      period,
      logo, // base64
    });

    res.json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;