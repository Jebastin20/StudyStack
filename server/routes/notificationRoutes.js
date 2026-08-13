const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controllers/notificationController");


// ==========================================
// Create Notification
// ==========================================

router.post(
    "/",
    authMiddleware,
    createNotification
);


// ==========================================
// Get My Notifications
// ==========================================

router.get(
    "/",
    authMiddleware,
    getNotifications
);


// ==========================================
// Mark Notification as Read
// ==========================================

router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);


// ==========================================
// Mark All as Read
// ==========================================

router.put(
    "/read-all",
    authMiddleware,
    markAllAsRead
);


// ==========================================
// Delete Notification
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);


module.exports = router;