import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    default: 104857600,
  },
  uploadDate: {
    type: Date,
    default: Date.now(),
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  expireAt: {
    type: Date,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  shareLink: {
    type: String,
    required: true,
  },
  linkId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("File", fileSchema);
