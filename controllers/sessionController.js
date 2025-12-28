const Session = require("../models/Session");

/**
 * Create a new session
 * POST /sessions
 */
exports.createSession = async (req, res) => {
  try {
    const { title, description, date, duration } = req.body;

    if (!title || !date || !duration) {
      return res
        .status(400)
        .json({ message: "Title, date, and duration are required" });
    }

    const session = new Session({
      title,
      description,
      date,
      duration,
      creator: req.user._id,
      participants: [req.user._id], // creator automatically joins
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Join a session
 * POST /sessions/:id/join
 */
exports.joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Prevent duplicate join
    if (session.participants.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You already joined this session" });
    }

    session.participants.push(req.user._id);
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all sessions
 * GET /sessions
 */
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("creator", "name email")
      .populate("participants", "name email");

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
