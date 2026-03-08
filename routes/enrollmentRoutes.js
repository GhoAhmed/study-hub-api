const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/enrollments", verifyToken, enrollmentController.enrollCourse);
router.get(
  "/enrollments/me",
  verifyToken,
  enrollmentController.getMyEnrollments,
);
router.put(
  "/enrollments/:id/progress",
  verifyToken,
  enrollmentController.updateProgress,
);
router.delete(
  "/enrollments/:id",
  verifyToken,
  enrollmentController.unenrollCourse,
);

module.exports = router;
