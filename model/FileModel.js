// FileModel.mjs
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    size: Number,
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
    uploadDate: { type: Date, default: Date.now },
    tags: [String],
    shareableLink: String, // New field for shareable link
});

const FileModel = mongoose.model("File", fileSchema);

export default FileModel;
