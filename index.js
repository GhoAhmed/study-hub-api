// this is my server file
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoute");
const taskRoutes = require("./routes/taskRoute");
const userRoutes = require("./routes/userRoute");

dotenv.config();
connectDB();

app.use(express.json());

// User routes
app.use("/api/auth", authRoutes);
// Task routes
app.use("/api", taskRoutes);
// User profile routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
