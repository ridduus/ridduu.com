import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    icon: {
      type: String, // store icon name (e.g., "FaReact")
      required: true,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);