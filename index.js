require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

// const piscineRoutes = require("./routes/piscineRoute");

const app = express();

app.use(express.json());

connectDB();

// app.use("/api", piscineRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
