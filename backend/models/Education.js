import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
    {
        university: { type: String, required: true },
        degree: { type: String, required: true },
        location: String,
        period: String,
        logo: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Education", educationSchema);