const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');


// Register a new user
exports.register = async (req, res) => {
    const { username, email, password,  fullName, address, phone } = req.body;
    const profileImage = req.file ? req.file.path : null;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
            , profileImage,
            fullName,
            address,
            phone,

        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User login
// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token and include role in payload
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Return token + role + user info
    res.status(200).json({ 
      token, 
      role: user.role, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Get user profile
exports.getProfile = async (req, res) => {
const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const profileImage = req.file ? req.file.path : null;
    const { username, email, fullName, address, phone } = req.body;

    const updateData = { username, email, fullName, address, phone };
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }); // ✅ التصحيح هنا

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};


// Delete user account

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: Missing user info' });
  }

  try {
    const user = await User.findById(req.user.id); // ✅ التصحيح هنا

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateUserById = async (req, res) => {
  try {
    const profileImage = req.file ? req.file.path : null;
    const { username, email, fullName, address, phone, role } = req.body;

    const updateData = { username, email, fullName, address, phone, role };
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user by ID:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};
