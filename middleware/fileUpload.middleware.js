// fileUploadMiddleware.mjs
import multer from "multer";
import { fileTypeFromBuffer as fileType } from "file-type";
import Grid from "gridfs-stream";
import { MongoClient } from "mongodb";
import { mongo } from "mongoose";
import { GridFSBucket } from "mongodb";

const uri =
    "mongodb+srv://agbariajameel:5ibHQBONHVWQjNuO@cluster0.a8xesrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection URI
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let gridFSBucket;

client
    .connect()
    .then(() => {
        // Connect to the MongoDB database and initialize the GridFSBucket
        const db = client.db("FILES-DB"); // Replace with your database name
        gridFSBucket = new GridFSBucket(db);
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Middleware to validate file type
const validateFileType = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file provided." });
    }

    const fileBuffer = req.file.buffer;
    const type = fileType(fileBuffer);

    if (
        !type ||
        (!type.mime.includes("image") && !type.mime.includes("video"))
    ) {
        return res.status(400).json({
            error: "Invalid file type. Only image or video files are allowed.",
        });
    }

    // Attach the file type to the request for further processing if needed
    req.fileType = type;

    // Continue to the next middleware or route handler
    next();
};

// Configure multer storage to save files to MongoDB using GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file upload and save to MongoDB
const saveToMongoDB = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file provided." });
    }

    const buffer = req.file.buffer;
    const type = req.fileType.mime;

    // Ensure GridFS stream is closed after finishing writing
    const closeStream = () => {
        if (writeStream) {
            writeStream.end(() => {
                console.log("File saved to MongoDB GridFS");
            });
        }
    };
    const owner = req.user._id;
    // Create a write stream to save the file to GridFS
    const writeStream = gfs.createWriteStream({
        filename: req.file.originalname,
        content_type: type,
        metadata: { owner },
    });

    // Handle stream errors
    writeStream.on("error", (error) => {
        console.error("GridFS stream error:", error);
        closeStream();
        return res.status(500).json({ error: "Internal Server Error" });
    });

    // Handle stream finish event
    writeStream.on("finish", () => {
        closeStream();
        return res.json({
            message: "File uploaded and saved to MongoDB GridFS.",
        });
    });

    writeStream.write(buffer);
    writeStream.end();
};

export { upload, validateFileType, saveToMongoDB };
