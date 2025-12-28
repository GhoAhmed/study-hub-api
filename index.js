// this is my server file
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
