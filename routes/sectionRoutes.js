const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const {
  verifyToken,
  verifyInstructor,
} = require("../middlewares/authMiddleware");

router.get(
  "/courses/:courseId/sections",
  sectionController.getSectionsByCourse,
);
router.post(
  "/sections",
  verifyToken,
  verifyInstructor,
  sectionController.createSection,
);
router.put(
  "/sections/:id",
  verifyToken,
  verifyInstructor,
  sectionController.updateSection,
);
router.delete(
  "/sections/:id",
  verifyToken,
  verifyInstructor,
  sectionController.deleteSection,
);

module.exports = router;
