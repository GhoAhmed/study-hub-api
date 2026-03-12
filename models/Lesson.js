const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "heading",
        "paragraph",
        "code",
        "callout",
        "divider",
        "bulletList",
      ],
      required: true,
    },
    data: {
      text: { type: String, default: "" },
      language: { type: String, default: "javascript" }, // for code blocks
      level: { type: Number, default: 2 }, // h1-h3 for heading
      style: { type: String, default: "info" }, // info | warning | success for callout
      items: { type: [String], default: [] }, // for bulletList
    },
  },
  { _id: true },
);

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String },
    pdfUrl: { type: String },
    duration: { type: Number },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    content: { type: [blockSchema], default: [] }, // ← new
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lesson", lessonSchema);
