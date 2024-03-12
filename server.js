import express from "express";
import cors from "cors";
import connectDB from "./config/dbConnect.js";
import router from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/", router);

app.use(errorHandler);

connectDB().then(() =>
    app.listen(3000, () => {
        console.log("server is listening on port 3000");
    })
);
