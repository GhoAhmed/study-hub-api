const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ENROLL in a course (student only)
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const existing = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
    });
    if (existing) return res.status(400).json({ error: "Already enrolled" });

    const enrollment = new Enrollment({ userId: req.user.id, courseId });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET my enrollments (student)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate(
      "courseId",
      "title description thumbnail category price",
    );
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE progress
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    enrollment.progress = progress;
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UNENROLL
exports.unenrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    await enrollment.deleteOne();
    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
