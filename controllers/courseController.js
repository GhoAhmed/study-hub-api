const Course = require("../models/Course");

// CREATE course (instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, category } = req.body;

    const course = new Course({
      title,
      description,
      price,
      thumbnail,
      category,
      instructor: req.user.id, // from JWT middleware
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructor",
      "username email",
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single course
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "username email",
    );
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE course (instructor who owns it only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE course (instructor who owns it only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
