const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    addSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

router.post("/", authMiddleware, addSubject);
router.get("/", authMiddleware, getSubjects);
router.put("/:id", authMiddleware, updateSubject);
router.delete("/:id", authMiddleware, deleteSubject);

module.exports = router;