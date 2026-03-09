const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

// All routes require admin
//router.use(verifyToken, verifyAdmin);

// Stats
router.get("/admin/stats", verifyToken, verifyAdmin, adminController.getStats);

// Users CRUD
router.get(
  "/admin/users",
  verifyToken,
  verifyAdmin,
  adminController.getAllUsers,
);
router.get(
  "/admin/users/:id",
  verifyToken,
  verifyAdmin,
  adminController.getUserById,
);
router.post(
  "/admin/users",
  verifyToken,
  verifyAdmin,
  adminController.createUser,
);
router.put(
  "/admin/users/:id",
  verifyToken,
  verifyAdmin,
  adminController.updateUser,
);
router.delete(
  "/admin/users/:id",
  verifyToken,
  verifyAdmin,
  adminController.deleteUser,
);
router.patch(
  "/admin/users/:id/toggle-status",
  verifyToken,
  verifyAdmin,
  adminController.toggleUserStatus,
);

// Instructor approvals
router.get(
  "/admin/instructors/pending",
  verifyToken,
  verifyAdmin,
  adminController.getPendingInstructors,
);
router.patch(
  "/admin/instructors/:id/approve",
  verifyToken,
  verifyAdmin,
  adminController.approveInstructor,
);
router.delete(
  "/admin/instructors/:id/reject",
  verifyToken,
  verifyAdmin,
  adminController.rejectInstructor,
);

module.exports = router;
