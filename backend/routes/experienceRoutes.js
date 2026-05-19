import express from "express";
import Experience from "../models/Experience.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Experience.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const { company, role, location, period, logo } = req.body;

    const newData = await Experience.create({
      company,
      role,
      location,
      period,
      logo, // base64 save
    });

    res.json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;