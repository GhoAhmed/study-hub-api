const Section = require("../models/Section");
const Course = require("../models/Course");

// CREATE section
exports.createSection = async (req, res) => {
  try {
    const { title, order, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const section = new Section({ title, order, courseId });
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all sections of a course
exports.getSectionsByCourse = async (req, res) => {
  try {
    const sections = await Section.find({ courseId: req.params.courseId }).sort(
      "order",
    );
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE section
exports.updateSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate("courseId");
    if (!section) return res.status(404).json({ error: "Section not found" });

    if (section.courseId.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE section
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate("courseId");
    if (!section) return res.status(404).json({ error: "Section not found" });

    if (section.courseId.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await section.deleteOne();
    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
