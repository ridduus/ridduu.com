import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    key: {
      type: String,
      required: [true, "key is required"],
      trim: true,
    },

    url: {
      type: String,
      required: [false, "Url is required"],
      trim: true,
      match: [
        /^(https?:\/\/)?([\w.-]+)(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
        "Please provide a valid URL",
      ],
    },

    year: {
      type: Number,
    },

    logo: {
      type: String,
      trim: true,
    },

    tags: {
      type: Array,
      trim: true,
    },

    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Must be at least 10 characters"],
      maxlength: [1000, "Cannot exceed 1000 characters"],
    },

  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);