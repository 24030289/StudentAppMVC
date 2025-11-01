const db = require('../db');

const Student = {
    // Get all students
    getAllStudents: (callback) => {
        const sql = 'SELECT * FROM students';
        db.query(sql, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    },

    // Get student by ID
    getStudentById: (studentId, callback) => {
        const sql = 'SELECT * FROM students WHERE studentId = ?';
        db.query(sql, [studentId], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result[0]);
        });
    },

    // Add new student
    addStudent: (studentData, callback) => {
        const sql = 'INSERT INTO students (name, dob, contact, image) VALUES (?, ?, ?, ?)';
        db.query(sql, [
            studentData.name,
            studentData.dob,
            studentData.contact,
            studentData.image
        ], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result.insertId);
        });
    },

    // Update student
    updateStudent: (studentId, studentData, callback) => {
        const sql = 'UPDATE students SET name = ?, dob = ?, contact = ?, image = ? WHERE studentId = ?';
        db.query(sql, [
            studentData.name,
            studentData.dob,
            studentData.contact,
            studentData.image,
            studentId
        ], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result.affectedRows > 0);
        });
    },

    // Delete student
    deleteStudent: (studentId, callback) => {
        const sql = 'DELETE FROM students WHERE studentId = ?';
        db.query(sql, [studentId], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result.affectedRows > 0);
        });
    }
};

module.exports = Student;