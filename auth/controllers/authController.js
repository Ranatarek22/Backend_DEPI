// authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register a new user
exports.register = async (req, res) => {
  console.log("Register request body:", req.body);
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    console.log("User created:", user);
    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get user profile (protected route)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getUserById = async (req, res) => {
  const { id } = req.params; // Get user ID from route parameters

  try {
    const user = await User.findById(id).select("-password"); // Exclude the password field from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// exports.updateProfile = async (req, res) => {
//   const { id } = req.params; // Get user ID from route parameters
//   const { name, password } = req.body;

//   try {
//     // Find the user by ID and update their profile
//     const user = await User.findById(id); // Use the ID from query params

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update user details
//     if (name) {
//       user.name = name;
//     }

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }

//     await user.save(); // Save the updated user

//     res.json({
//       message: "Profile updated successfully",
//       user: { name: user.name, email: user.email },
//     });
//   } catch (error) {
//     console.error("Update profile error:", error.message);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// };

// Update user profile
exports.updateProfile = async (req, res) => {
  const { id } = req.params; // Get user ID from route parameters
  const { name, password, email } = req.body; // Include email in the destructuring

  try {
    // Find the user by ID and update their profile
    const user = await User.findById(id); // Use the ID from route params

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the request body contains email and respond accordingly
    if (email) {
      return res.status(400).json({ message: "Email cannot be updated." });
    }

    // Update user details
    if (name) {
      user.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save(); // Save the updated user

    res.json({
      message: "Profile updated successfully",
      user: { name: user.name, password: user.password },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
