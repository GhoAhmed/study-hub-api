const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid Password!" });

    // Check if account is disabled
    if (!user.isActive) {
      return res.status(403).json({ error: "Your account has been disabled." });
    }

    // Check if instructor is approved
    if (user.role === "instructor" && !user.isApproved) {
      return res
        .status(403)
        .json({ error: "Your instructor account is pending admin approval." });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );
    res.json(accessToken);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
