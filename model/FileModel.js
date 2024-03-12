// FileModel.mjs
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
    uploadDate: { type: Date, default: Date.now },
    shareableLink: String, // New field for shareable link
});

const FileModel = mongoose.model("File", fileSchema);

export default FileModel;
