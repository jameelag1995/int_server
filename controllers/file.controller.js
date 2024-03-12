import FileModel from "../model/FileModel.js";

export const generateLink = async (req, res, next) => {
    try {
        const fileId = req.body.fileId;

        // Check if the file with the provided ID exists
        const file = await FileModel.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found." });
        }

        // Generate a shareable link (replace 'your_frontend_url' with your actual frontend URL)
        const shareableLink = `http://localhost:5173/share/${fileId}`;

        return res.json({ link: shareableLink });
    } catch (error) {
        console.error("Error generating shareable link:", error);
        res.status(500).json({ error: "Internal Server Error" });
        next(error);
    }
};

export const getMyFiles = async (req, res, next) => {
    try {
        const myFiles = await FileModel.find({ owner: req.user.id });
        if (myFiles.length === 0) {
            throw new Error("No files in database");
        }
        res.send(myFiles);
    } catch (error) {
        next(error);
    }
};
