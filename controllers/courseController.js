const Course = require("../models/Course");

// GET all courses (public) with filter/search/pagination
exports.getAllCourses = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };

    if (search)
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    if (category) query.category = category;
    if (level) query.level = level;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate("instructor", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      courses,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single course (public)
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

// GET courses by instructor (for instructor dashboard)
exports.getMyCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { instructor: req.user.id };

    if (search) query.title = { $regex: search, $options: "i" };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      courses,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE course (instructor only)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      price,
      thumbnail,
      previewVideo,
      category,
      level,
      language,
      tags,
      whatYouWillLearn,
      requirements,
    } = req.body;

    const course = new Course({
      title,
      description,
      shortDescription,
      price,
      thumbnail,
      previewVideo,
      category,
      level,
      language,
      tags,
      whatYouWillLearn,
      requirements,
      instructor: req.user.id,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
