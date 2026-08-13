const cron = require("node-cron");

const StudySession = require("../models/StudySession");
const Notification = require("../models/Notification");

// ==========================================
// Study Session Reminder Scheduler
// ==========================================

const startNotificationScheduler = () => {

    // Run every minute
    cron.schedule("* * * * *", async () => {

        try {

            const now = new Date();

            // Get sessions that are not completed
            const sessions = await StudySession.find({
                completed: false
            }).populate("subject", "name");


            for (const session of sessions) {

                if (!session.studyDate || !session.startTime) {
                    continue;
                }


                // ==========================================
                // Combine Study Date + Start Time
                // ==========================================

                const sessionDate =
                    new Date(session.studyDate);

                const [hours, minutes] =
                    session.startTime.split(":");

                sessionDate.setHours(
                    Number(hours),
                    Number(minutes),
                    0,
                    0
                );


                // ==========================================
                // Difference in Minutes
                // ==========================================

                const difference =
                    (sessionDate.getTime() - now.getTime())
                    / (1000 * 60);


                // ==========================================
                // Reminder Window
                // 0–10 minutes before session
                // ==========================================

                if (
                    difference >= 0 &&
                    difference <= 10
                ) {

                    // ==========================================
                    // Check Duplicate Notification
                    // ==========================================

                    const existingNotification =
                        await Notification.findOne({

                            user: session.user,

                            type: "study_reminder",

                            sessionId: session._id

                        });


                    if (existingNotification) {
                        continue;
                    }


                    // ==========================================
                    // Create Notification
                    // ==========================================

                    await Notification.create({

                        user: session.user,

                        title:
                            "Study Session Reminder ⏰",

                        message:
                            `Your ${
                                session.subject
                                    ? session.subject.name
                                    : "study"
                            } session starts in ${Math.ceil(
                                difference
                            )} minutes.`,

                        type: "study_reminder",

                        sessionId: session._id

                    });


                    console.log(
                        "🔔 Study reminder created:",
                        session._id
                    );

                }

            }

        } catch (error) {

            console.error(
                "Notification Scheduler Error:",
                error
            );

        }

    });


    console.log(
        "🔔 Notification Scheduler Started"
    );

};


module.exports = startNotificationScheduler;