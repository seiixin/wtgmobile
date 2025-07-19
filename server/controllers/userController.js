const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// ✅ Register User
const registerUser = async (req, res) => {
    const { name, gender, dob, nationality, email, mobile, province, city, district, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            gender,
            dob,
            nationality,
            email,
            mobile,
            province,
            city,
            district,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration Error:', error.message || error);
        res.status(500).json({ message: 'Server Error', error: error.message || 'Something went wrong' });
    }
};

// ✅ Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Add this line to ensure avatar is sent
        const userObj = user.toObject();
        userObj.avatar = user.profileImage || "";
        res.status(200).json({ message: "Login successful", user: userObj });
    } catch (error) {
        console.error("Login Error:", error.message || error);
        res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
    }
};

// ✅ Get User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Fetch User Error:", error.message || error);
        res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
    }
};

// ✅ Update User Profile
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        Object.keys(updates).forEach((key) => {
            user[key] = updates[key];
        });

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Update User Error:", error.message || error);
        res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
    }
};

// ✅ Validate Password
const validatePassword = async (req, res) => {
    const { currentPassword } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ valid: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ valid: false, message: "Current password is incorrect" });
        }

        res.status(200).json({ valid: true, message: "Password is correct" });
    } catch (error) {
        console.error("Validate Password Error:", error.message || error);
        res.status(500).json({ valid: false, message: "Server Error", error: error.message || "Something went wrong" });
    }
};

// ✅ Update Password
const updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update Password Error:", error.message || error);
        res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
    }
};

// ✅ Upload Profile Image
const uploadProfileImage = async (req, res) => {
    const userId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = req.file.path; // Cloudinary URL

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profileImage = imageUrl;
        await user.save();

        res.status(200).json({ message: "Profile image updated successfully", imageUrl });
    } catch (error) {
        console.error("Upload Image Error:", error.message || error);
        res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
    }
};


// ✅ Find Email
const findEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        res.status(200).json({ message: "Email found", userId: user._id });
    } catch (error) {
        console.error("Find Email Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { registerUser, loginUser, getUserById, updateUser, validatePassword, updatePassword, uploadProfileImage, findEmail, resetPassword };
