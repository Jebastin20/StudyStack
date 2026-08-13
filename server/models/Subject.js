const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    // User who owns this subject
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Subject", subjectSchema);