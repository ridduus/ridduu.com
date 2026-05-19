import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
    {
        company: { type: String, required: true },
        role: { type: String, required: true },
        location: String,
        period: String,
        // desc: String,

        // 👇 Base64 logo
        logo: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);