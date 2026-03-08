const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, min: 0 },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Section", sectionSchema);
