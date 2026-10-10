import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
    value: { type: String, default: "" },
    label: { type: String, default: "" },
    sub: { type: String, default: "" },
});

const profileSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        designation: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        location: { type: String, default: "" },

        profileImg: { type: String, default: "" }, // image URL
        cv: { type: String, default: "" }, // CV / Resume data URL or link

        stats: [statSchema],

        desc1: { type: String, default: "" },
        desc2: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);