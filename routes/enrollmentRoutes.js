const express = require("express");
const router = express.Router();
const e = require("../controllers/enrollmentController");
const {
  verifyToken,
  verifyInstructor,
} = require("../middlewares/authMiddleware");

// Student
router.post("/enrollments", verifyToken, e.enrollCourse);
router.get("/enrollments/me", verifyToken, e.getMyEnrollments);
router.put("/enrollments/:id/progress", verifyToken, e.updateProgress);
router.delete("/enrollments/:id", verifyToken, e.unenrollCourse);

// Instructor
router.get(
  "/courses/:courseId/enrollments",
  verifyToken,
  verifyInstructor,
  e.getCourseEnrollments,
);
router.patch(
  "/enrollments/:id/status",
  verifyToken,
  verifyInstructor,
  e.updateEnrollmentStatus,
);

module.exports = router;
