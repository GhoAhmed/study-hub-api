const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true, maxlength: 160 },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, default: "" },
    previewVideo: { type: String, default: "" },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    language: { type: String, default: "English" },
    tags: [{ type: String, trim: true }],
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    totalDuration: { type: Number, default: 0 }, // in minutes
    totalLessons: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
