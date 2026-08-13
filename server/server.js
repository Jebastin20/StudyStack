const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const startNotificationScheduler =
    require("./jobs/notificationScheduler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api/subjects", subjectRoutes);

app.use(
    "/api/study-sessions",
    studySessionRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.get("/", (req, res) => {
    res.send("🚀 Welcome to StudyStack Backend");
});

// Check environment variables
console.log(
    "Cloudinary Cloud Name:",
    process.env.CLOUDINARY_CLOUD_NAME
);

console.log(
    "Cloudinary API Key exists:",
    !!process.env.CLOUDINARY_API_KEY
);

console.log(
    "Cloudinary API Secret exists:",
    !!process.env.CLOUDINARY_API_SECRET
);

console.log(
    "JWT_SECRET exists:",
    !!process.env.JWT_SECRET
);

// Connect Database and start server
const startServer = async () => {
    try {
        await connectDB();

startNotificationScheduler();

const PORT = process.env.PORT || 5000;

        app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        message: err.message || "Internal Server Error"
    });
});

startServer();