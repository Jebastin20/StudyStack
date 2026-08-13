const Subject = require("../models/Subject");

// ==============================
// Add Subject
// ==============================

const addSubject = async (req, res) => {

    try {

        const { name } = req.body;

        const subject = await Subject.create({

            name,

            // Assign subject to logged-in user
            user: req.user.id

        });

        res.status(201).json({

            message: "Subject Added Successfully",

            subject

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==============================
// Get User's Subjects
// ==============================

const getSubjects = async (req, res) => {

    try {

        const subjects = await Subject
            .find({
                user: req.user.id
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json(subjects);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==============================
// Delete Subject
// ==============================

const deleteSubject = async (req, res) => {

    try {

        const subject = await Subject.findOneAndDelete({

            _id: req.params.id,

            // Only allow owner to delete
            user: req.user.id

        });

        if (!subject) {

            return res.status(404).json({

                message: "Subject not found"

            });

        }

        res.status(200).json({

            message: "Subject Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==============================
// Update Subject
// ==============================

const updateSubject = async (req, res) => {

    try {

        const updatedSubject = await Subject.findOneAndUpdate(

            {
                _id: req.params.id,

                // Only allow owner to update
                user: req.user.id
            },

            {
                name: req.body.name
            },

            {
                new: true
            }

        );

        if (!updatedSubject) {

            return res.status(404).json({

                message: "Subject not found"

            });

        }

        res.status(200).json({

            message: "Subject Updated Successfully",

            updatedSubject

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    addSubject,
    getSubjects,
    deleteSubject,
    updateSubject

};