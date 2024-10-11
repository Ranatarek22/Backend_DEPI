const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUserById,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", protect, getProfile);
router.put("/profile/:id", protect, updateProfile);
router.get("/user/:id", protect, getUserById);
module.exports = router;
