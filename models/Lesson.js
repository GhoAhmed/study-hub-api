const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    duration: { type: Number, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lesson", lessonSchema);
