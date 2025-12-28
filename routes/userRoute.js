const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/userController");

router.use(protect);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

module.exports = router;
