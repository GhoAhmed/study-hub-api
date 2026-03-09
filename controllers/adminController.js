const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");

// ─── USERS ───────────────────────────────────────────

// GET all users (with optional role filter & search)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE user (by admin)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isApproved: true, // admin-created accounts are auto-approved
    });
    await user.save();
    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TOGGLE active/disabled
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({
      message: `User ${user.isActive ? "activated" : "disabled"}`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── INSTRUCTOR APPROVALS ─────────────────────────────

// GET all pending instructors
exports.getPendingInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      role: "instructor",
      isApproved: false,
    })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// APPROVE instructor
exports.approveInstructor = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "instructor" },
      { isApproved: true },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ error: "Instructor not found" });
    res.json({ message: "Instructor approved", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REJECT instructor (delete account)
exports.rejectInstructor = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      role: "instructor",
      isApproved: false,
    });
    if (!user) return res.status(404).json({ error: "Instructor not found" });
    res.json({ message: "Instructor rejected and removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── STATS ────────────────────────────────────────────

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      pendingInstructors,
      totalCourses,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor", isApproved: true }),
      User.countDocuments({ role: "instructor", isApproved: false }),
      Course.countDocuments(),
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      pendingInstructors,
      totalCourses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
