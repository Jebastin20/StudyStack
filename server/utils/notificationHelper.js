const Notification = require("../models/Notification");

// ==========================================
// Create Notification Helper
// ==========================================

const createNotification = async (
    user,
    title,
    message,
    type = "general"
) => {

    try {

        const notification =
            await Notification.create({

                user,
                title,
                message,
                type

            });

        return notification;

    } catch (error) {

        console.error(
            "Notification Creation Error:",
            error.message
        );

        return null;

    }

};

module.exports = createNotification;