const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ENROLL in a course (student)
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const existing = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
    });
    if (existing)
      return res.status(400).json({ error: "Already enrolled or pending" });

    const enrollment = new Enrollment({
      userId: req.user.id,
      courseId,
      status: "pending",
    });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET my enrollments (student)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate(
        "courseId",
        "title description thumbnail category level price instructor totalLessons totalDuration rating",
      )
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE progress (student)
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

// UNENROLL (student)
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

// GET enrollments for instructor's course (instructor)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const enrollments = await Enrollment.find({ courseId: req.params.courseId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// APPROVE or REJECT enrollment (instructor)
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const enrollment = await Enrollment.findById(req.params.id).populate(
      "courseId",
    );
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    if (enrollment.courseId.instructor.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    enrollment.status = status;
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
