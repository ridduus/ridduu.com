import Setting from "../models/Setting.js";

/* ================= GET SETTINGS ================= */
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // If first time (no data)
    if (!settings) {
      return res.json({
        success: true,
        settings: {
          projects: [],
          services: [],
          notifications: [],
          reviews: [],
        },
      });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE SETTINGS ================= */
export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    let existing = await Setting.findOne();

    if (!existing) {
      existing = new Setting(settings);
    } else {
      existing.projects = settings.projects;
      existing.services = settings.services;
      existing.notifications = settings.notifications;
      existing.reviews = settings.reviews;
    }

    await existing.save();

    res.json({
      success: true,
      message: "Settings updated",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};