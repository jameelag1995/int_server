import express from "express";
import {
    loginUser,
    logout,
    registerUser,
} from "../controllers/user.controller.js";
import {
    saveToMongoDB,
    upload,
    validateFileType,
} from "../middleware/fileUpload.middleware.js";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
    generateLink,
    getMyFiles,
    saveFile,
} from "../controllers/file.controller.js";
const router = express.Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.put("/users/logout", validateToken, logout);
router.post("/upload", validateToken, saveFile);
router.get("/files/get-files", validateToken, getMyFiles);
router.post("/generate-link", generateLink);
export default router;
