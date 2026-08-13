const StudySession = require("../models/StudySession");
const Subject = require("../models/Subject");
const Notification = require("../models/Notification");
const createNotification =
    require("../utils/notificationHelper");
// ==============================
// Add Study Session
// ==============================

const addStudySession = async (req, res) => {

    try {

        const {
            subject,
            goal,
            duration,
            unit,
            studyDate,
            startTime
        } = req.body;

        const subjectItem = await Subject.findOne({
            _id: subject,
            user: req.user.id
        });

        if (!subjectItem) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        const session = await StudySession.create({
            subject,
            goal,
            duration,
            unit,
            studyDate,
            startTime,
            user: req.user.id
        });

        res.status(201).json({

            message: "Study Session Added Successfully",

            session

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ==============================
// Get User's Study Sessions
// ==============================

const getStudySessions = async (req, res) => {

    try {

        const sessions = await StudySession

            .find({
                user: req.user.id
            })

            .populate("subject", "name")

            .sort({
                createdAt: -1
            });

        res.status(200).json(sessions);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ==============================
// Delete Study Session
// ==============================

const deleteStudySession = async (req, res) => {

    try {

        const session = await StudySession.findOneAndDelete({

            _id: req.params.id,

            // Only owner can delete
            user: req.user.id

        });

        if (!session) {

            return res.status(404).json({

                message: "Study Session not found"

            });

        }

        res.status(200).json({

            message: "Study Session Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ==============================
// Update Study Session
// ==============================

const updateStudySession = async (req, res) => {

    try {

        if (req.body.subject) {
            const subjectItem = await Subject.findOne({
                _id: req.body.subject,
                user: req.user.id
            });

            if (!subjectItem) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }
        }

        const session = await StudySession.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                subject: req.body.subject,
                goal: req.body.goal,
                duration: req.body.duration,
                unit: req.body.unit,
                studyDate: req.body.studyDate,
                startTime: req.body.startTime
            },
            {
                new: true
            }
        );

        if (!session) {

            return res.status(404).json({

                message: "Study Session not found"

            });

        }

        res.status(200).json({

            message: "Study Session Updated Successfully",

            session

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ==============================
// Complete Study Session
// ==============================

const completeStudySession = async (req, res) => {

    try {

        const session = await StudySession.findOneAndUpdate(

            {
                _id: req.params.id,
                user: req.user.id
            },

            {
                completed: true
            },

            {
                new: true
            }

        ).populate("subject", "name");


        if (!session) {

            return res.status(404).json({

                message: "Study Session not found"

            });

        }


        // ==============================
        // Create Completion Notification
        // ==============================

        await Notification.create({

            user: req.user.id,

            title: "Study Session Completed 🎉",

            message:
                `You completed your ${session.duration} ${session.unit} study session for ${session.subject.name}.`,

            type: "session_completed"

        });


        // ==============================
        // Response
        // ==============================

        res.status(200).json({

            message: "Study Session Completed",

            session

        });


    } catch (error) {

        console.error(
            "Complete Session Error:",
            error
        );

        res.status(500).json({

            message: error.message

        });

    }

};


// ==============================
// Export
// ==============================

module.exports = {
    addStudySession,
    getStudySessions,
    updateStudySession,
    deleteStudySession,
    completeStudySession
};