const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({

    // Subject used for this study session
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    // User who owns this study session
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    goal: {
        type: String,
        required: true,
        trim: true
    },

    duration: {
        type: Number,
        required: true,
        min: 1
    },

    unit: {
        type: String,
        enum: ["Minutes", "Hours"],
        default: "Hours"
    },

    studyDate: {
        type: Date,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("StudySession", studySessionSchema);