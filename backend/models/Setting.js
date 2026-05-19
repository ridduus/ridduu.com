import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  key: String,
  title: String,
  value: { type: Boolean, default: true },
});

const settingSchema = new mongoose.Schema({
  projects: [itemSchema],
  services: [itemSchema],
  notifications: [itemSchema],
  reviews: [itemSchema],
});

export default mongoose.model("Setting", settingSchema);