const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch fresh user from DB to check isApproved & isActive
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isActive)
      return res.status(403).json({ error: "Account disabled" });
    if (user.role === "instructor" && !user.isApproved) {
      return res.status(403).json({ error: "Account pending approval" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

exports.verifyInstructor = (req, res, next) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ error: "Instructor access only" });
  }
  next();
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};
