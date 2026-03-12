const Lesson = require("../models/Lesson");
const Section = require("../models/Section");
const Course = require("../models/Course");

// helper to check ownership
const isOwner = async (sectionId, userId) => {
  const section = await Section.findById(sectionId).populate("courseId");
  if (!section) return null;
  return section.courseId.instructor.toString() === userId ? section : null;
};

// Helper: strip any client-generated _id / _tempId from content blocks
const sanitizeContent = (content) => {
  if (!Array.isArray(content)) return [];
  return content.map(({ _id, _tempId, ...block }) => block);
};

// CREATE lesson
exports.createLesson = async (req, res) => {
  try {
    const { title, videoUrl, pdfUrl, sectionId, duration, content } = req.body;

    const section = await isOwner(sectionId, req.user.id);
    if (!section)
      return res
        .status(403)
        .json({ error: "Not authorized or section not found" });

    const lesson = new Lesson({
      title,
      videoUrl,
      pdfUrl,
      sectionId,
      duration,
      content: sanitizeContent(content),
    });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all lessons of a section
exports.getLessonsBySection = async (req, res) => {
  try {
    const lessons = await Lesson.find({ sectionId: req.params.sectionId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single lesson
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE lesson
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const section = await isOwner(lesson.sectionId, req.user.id);
    if (!section) return res.status(403).json({ error: "Not authorized" });

    // Pull content out separately so we can sanitize it
    const { content, ...rest } = req.body;

    const updated = await Lesson.findByIdAndUpdate(
      req.params.id,
      { ...rest, content: sanitizeContent(content) },
      { new: true, runValidators: true },
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE lesson
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const section = await isOwner(lesson.sectionId, req.user.id);
    if (!section) return res.status(403).json({ error: "Not authorized" });

    await lesson.deleteOne();
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
