const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  createSession,
  joinSession,
  getAllSessions,
} = require("../controllers/sessionController");

router.use(protect);

router.post("/sessions", createSession);
router.post("/sessions/:id/join", joinSession);
router.get("/sessions", getAllSessions);

module.exports = router;
