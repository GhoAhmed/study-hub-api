require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://yourfrontenddomain.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

connectDB();

app.use("/api", adminRoutes);
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", enrollmentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
