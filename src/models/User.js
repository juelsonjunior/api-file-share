import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  storageUsed: {
    type: Number,
    required: true,
  },
  storageLimit: {
    type: Number,
    default: 104857600,
  },
});

export default mongoose.model("User", userSchema);
