const express = require("express");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// All authenticated users can view users
router.get("/", authMiddleware, getUsers);
// Only admins can create users
router.post("/", authMiddleware, adminMiddleware, createUser);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;