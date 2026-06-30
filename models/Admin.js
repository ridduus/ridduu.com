import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);