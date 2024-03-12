import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import {
    saveToMongoDB,
    upload,
    validateFileType,
} from "../middleware/fileUpload.middleware.js";
import { validateToken } from "../middleware/validateTokenHandler.js";
import { generateLink, getMyFiles } from "../controllers/file.controller.js";
const router = express.Router();

router.post("/users/register", registerUser);
router.patch("/users/login", validateToken, loginUser);
router.post(
    "/upload",
    validateToken,
    upload.single("file"),
    validateFileType,
    saveToMongoDB
);
router.post("/generate-link", generateLink);
router.get("/get-my-files", validateToken, getMyFiles);
export default router;
