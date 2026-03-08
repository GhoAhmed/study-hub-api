const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const {
  verifyToken,
  verifyInstructor,
} = require("../middlewares/authMiddleware");

// Public
router.get("/courses", courseController.getAllCourses);
router.get("/courses/:id", courseController.getCourseById);

// Instructor only
router.post(
  "/courses",
  verifyToken,
  verifyInstructor,
  courseController.createCourse,
);
router.put(
  "/courses/:id",
  verifyToken,
  verifyInstructor,
  courseController.updateCourse,
);
router.delete(
  "/courses/:id",
  verifyToken,
  verifyInstructor,
  courseController.deleteCourse,
);

module.exports = router;
