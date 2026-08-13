const Notification = require("../models/Notification");

// ==========================================
// Create Notification
// ==========================================

const createNotification = async (req, res) => {

    try {

        const {
            title,
            message,
            type
        } = req.body;

        if (!title || !message) {

            return res.status(400).json({
                message: "Title and message are required"
            });

        }

        const notification =
            await Notification.create({

                user: req.user.id,

                title,

                message,

                type: type || "general"

            });

        res.status(201).json({

            message: "Notification Created Successfully",

            notification

        });

    } catch (error) {

        console.error(
            "Create Notification Error:",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ==========================================
// Get User Notifications
// ==========================================

const getNotifications = async (req, res) => {

    try {

        const notifications =
            await Notification
                .find({
                    user: req.user.id
                })
                .sort({
                    createdAt: -1
                });

        res.status(200).json(
            notifications
        );

    } catch (error) {

        console.error(
            "Get Notifications Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Mark Notification as Read
// ==========================================

const markAsRead = async (req, res) => {

    try {

        const notification =
            await Notification.findOneAndUpdate(

                {
                    _id: req.params.id,

                    user: req.user.id
                },

                {
                    isRead: true
                },

                {
                    new: true
                }

            );

        if (!notification) {

            return res.status(404).json({

                message: "Notification Not Found"

            });

        }

        res.status(200).json({

            message: "Notification Marked as Read",

            notification

        });

    } catch (error) {

        console.error(
            "Mark Notification Error:",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ==========================================
// Mark All Notifications as Read
// ==========================================

const markAllAsRead = async (req, res) => {

    try {

        await Notification.updateMany(

            {
                user: req.user.id,

                isRead: false
            },

            {
                isRead: true
            }

        );

        res.status(200).json({

            message: "All Notifications Marked as Read"

        });

    } catch (error) {

        console.error(
            "Mark All Notifications Error:",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ==========================================
// Delete Notification
// ==========================================

const deleteNotification = async (req, res) => {

    try {

        const notification =
            await Notification.findOneAndDelete({

                _id: req.params.id,

                user: req.user.id

            });

        if (!notification) {

            return res.status(404).json({

                message: "Notification Not Found"

            });

        }

        res.status(200).json({

            message:
                "Notification Deleted Successfully"

        });

    } catch (error) {

        console.error(
            "Delete Notification Error:",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


module.exports = {

    createNotification,

    getNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification

};