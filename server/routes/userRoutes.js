const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/upload");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    uploadProfilePicture
} = require("../controllers/userController");


// ==============================
// Authentication
// ==============================

router.post("/register", registerUser);

router.post("/login", loginUser);


// ==============================
// Profile
// ==============================

router.get(
    "/profile/:id",
    authMiddleware,
    getProfile
);

router.put(
    "/profile/:id",
    authMiddleware,
    updateProfile
);


// ==============================
// Profile Picture
// ==============================

router.put(
    "/profile-picture",
    authMiddleware,
    upload.single("profilePicture"),
    uploadProfilePicture
);


module.exports = router;