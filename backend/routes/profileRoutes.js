import express from "express";
import Profile from "../models/Profile.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


// ================== GET PROFILE ==================
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No profile found. Please add data first.",
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


// ================== CREATE / UPDATE PROFILE ==================
router.post("/",verifyToken, async (req, res) => {
  try {
    let profile = await Profile.findOne();

    const data = {
      name: req.body.name,
      designation: req.body.designation,
      phone: req.body.phone,
      email: req.body.email,
      location: req.body.location,
      desc1: req.body.desc1,
      desc2: req.body.desc2,
      stats: req.body.stats || [],
      profileImg: req.body.profileImg || "",
      cv: req.body.cv || "",
    };

    // 👉 Update if exists
    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, {
        new: true,
      });
    } else {
      // 👉 Create new
      profile = await Profile.create(data);
    }

    res.json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;