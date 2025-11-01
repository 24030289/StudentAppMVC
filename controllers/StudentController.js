const Student = require('../models/Student');

const StudentController = {
    // List all students
    listStudents: (req, res) => {
        Student.getAllStudents((err, students) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error retrieving students',
                    details: err
                });
            }
            res.render('index', { students: students });
        });
    },

    // Get student details by ID
    getStudent: (req, res) => {
        const studentId = req.params.id;
        Student.getStudentById(studentId, (err, student) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error retrieving student',
                    details: err
                });
            }
            if (!student) {
                return res.status(404).json({
                    error: 'Student not found'
                });
            }
            res.render('student', { student: student });
        });
    },

    // Show add student form
    showAddForm: (req, res) => {
        res.render('addStudent');
    },

    // Add new student
    addStudent: (req, res) => {
        const studentData = {
            name: req.body.name,
            dob: req.body.dob,
            contact: req.body.contact,
            image: req.body.image || 'default.jpg'
        };

        Student.addStudent(studentData, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error adding student',
                    details: err
                });
            }
            res.redirect('/students');
        });
    },

    // Show edit student form
    showEditForm: (req, res) => {
        const studentId = req.params.id;
        Student.getStudentById(studentId, (err, student) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error retrieving student',
                    details: err
                });
            }
            if (!student) {
                return res.status(404).json({
                    error: 'Student not found'
                });
            }
            res.render('editStudent', { student: student });
        });
    },

    // Update student
    updateStudent: (req, res) => {
        const studentId = req.params.id;
        const studentData = {
            name: req.body.name,
            dob: req.body.dob,
            contact: req.body.contact,
            image: req.body.image
        };

        Student.updateStudent(studentId, studentData, (err, success) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error updating student',
                    details: err
                });
            }
            if (!success) {
                return res.status(404).json({
                    error: 'Student not found'
                });
            }
            res.redirect('/students');
        });
    },

    

    // Delete student
    deleteStudent: (req, res) => {
        const studentId = req.params.id;
        Student.deleteStudent(studentId, (err, success) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error deleting student',
                    details: err
                });
            }
            if (!success) {
                return res.status(404).json({
                    error: 'Student not found'
                });
            }
            res.redirect('/students');
        });
    }
};

module.exports = StudentController;