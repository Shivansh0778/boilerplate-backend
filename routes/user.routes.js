const express = require("express");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserStats,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// All authenticated users can view users
router.get("/", authMiddleware, getUsers);

router.get("/stats", authMiddleware, adminMiddleware, getUserStats);

// Only admins can create users
router.post("/", authMiddleware, adminMiddleware, createUser);

router.patch("/:id/status", authMiddleware, adminMiddleware, updateUserStatus);

router.put("/:id", authMiddleware, adminMiddleware, updateUser);

router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
