import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { NotFoundError, errorHandler } from "./middlewares/error-handler.js";
import morgan from "morgan";
import connectDb from "./config/db.js";
import bodyParser from "body-parser";
import userRoutes from './routes/user.js';
import villageRoutes from './routes/village.js';
import eventsRoutes from './routes/events.js';
import path from 'path';
import multer from 'multer';

dotenv.config();

const app = express();

const hostname = process.env.DOCKERSERVERURL || '127.0.0.1';
const port = process.env.SERVERPORT || 9090;

// Info on req : GET /route ms -25
app.use(morgan("tiny"));
app.use(cors());

// Database connection
connectDb();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static folder setup
app.use("/media", express.static("media"));
app.use('/uploads/images', express.static('uploads/images'));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        // Sanitize the filename
        const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
        cb(null, sanitizedFilename);
    }
});

const upload = multer({ storage: storage });

app.post("/uploads", upload.single('upload'), (req, res) => {
    res.json({
        success: 1,
        profilePic: `/uploads/images/${req.file.filename}` // Return the correct path
    });
});

// Routes
app.use('/user', userRoutes);
app.use('/village', villageRoutes);
app.use('/events', eventsRoutes);

// Error handling middleware
app.use(NotFoundError);
app.use(errorHandler);

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running on ${hostname}:${port}`);
});
