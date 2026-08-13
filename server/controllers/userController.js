const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            age,
            gender
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: "Registration Successful",
            user: userResponse
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({

    message: "Login Successful",

    token,

    user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        age: user.age,

        gender: user.gender

    }

});

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ==============================
// Get User Profile
// ==============================

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==============================
// Update User Profile
// ==============================

const updateProfile = async (req, res) => {

    try {

        const { name, age, gender } = req.body;

        const user = await User.findByIdAndUpdate(

            req.params.id,

            {
                name,
                age,
                gender
            },

            {
                new: true
            }

        ).select("-password");

        res.status(200).json({

            message: "Profile Updated Successfully",

            user

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==============================
// Upload Profile Picture
// ==============================

const uploadProfilePicture = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Please select a profile picture"
            });

        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                profilePicture: req.file.path
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            user
        });

    } catch (error) {

        console.error(
            "Profile picture error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};

// Export both functions
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    uploadProfilePicture
};