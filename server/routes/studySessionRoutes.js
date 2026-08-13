const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    addStudySession,
    getStudySessions,
    updateStudySession,
    deleteStudySession,
    completeStudySession
} = require("../controllers/studySessionController");

router.post("/", authMiddleware, addStudySession);

router.get("/", authMiddleware, getStudySessions);

router.put("/:id", authMiddleware, updateStudySession);

router.put("/:id/complete", authMiddleware, completeStudySession);

router.delete("/:id", authMiddleware, deleteStudySession);
module.exports = router;