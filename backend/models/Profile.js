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

        stats: [statSchema],

        desc1: { type: String, default: "" },
        desc2: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);