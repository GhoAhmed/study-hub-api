require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

// const piscineRoutes = require("./routes/piscineRoute");

const app = express();

app.use(express.json());

connectDB();

app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", enrollmentRoutes);

// app.use("/api", piscineRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
