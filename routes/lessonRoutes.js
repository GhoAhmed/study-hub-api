const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const {
  verifyToken,
  verifyInstructor,
} = require("../middlewares/authMiddleware");

router.get(
  "/sections/:sectionId/lessons",
  lessonController.getLessonsBySection,
);
router.get("/lessons/:id", lessonController.getLessonById);
router.post(
  "/lessons",
  verifyToken,
  verifyInstructor,
  lessonController.createLesson,
);
router.put(
  "/lessons/:id",
  verifyToken,
  verifyInstructor,
  lessonController.updateLesson,
);
router.delete(
  "/lessons/:id",
  verifyToken,
  verifyInstructor,
  lessonController.deleteLesson,
);

module.exports = router;
