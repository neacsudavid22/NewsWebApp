import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js'
import articlesRouter from './routes/article-routes.js';
import usersRouter from './routes/user-routes.js';
import uploadRouter from "./routes/upload-routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

// Connect to MongoDB
await connectDB();

const port = process.env.PORT || 5000;

const app = express();

app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
  credentials: true,
  allowedHeaders: ["Content-Type"]
};

// Apply CORS with options
app.use(cors(corsOptions));

// JSON parser for non-upload routes
app.use('/article-api', express.json(), articlesRouter);
app.use('/user-api', express.json(), usersRouter);

// FormData (multipart) is handled separately in upload-api
app.use('/upload-api', uploadRouter);

// Start Server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
