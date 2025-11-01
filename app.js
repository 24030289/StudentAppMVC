const express = require('express');
const multer = require('multer');
const app = express();
const StudentController = require('./controllers/StudentController');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({
    extended: false
}));

// Routes
// List all students
app.get('/', StudentController.listStudents);
app.get('/students', StudentController.listStudents);

// Get student details
app.get('/student/:id', StudentController.getStudent);

// Add student routes
app.get('/addStudent', StudentController.showAddForm);
app.post('/addStudent', upload.single('image'), (req, res) => {
    // Add image filename to request body if file was uploaded
    if (req.file) {
        req.body.image = req.file.filename;
    }
    StudentController.addStudent(req, res);
});

// Edit student routes
app.get('/editStudent/:id', StudentController.showEditForm);
app.post('/editStudent/:id', upload.single('image'), (req, res) => {
    // Add image filename to request body if file was uploaded
    if (req.file) {
        req.body.image = req.file.filename;
    } else {
        req.body.image = req.body.currentImage; // Keep existing image if no new upload
    }
    StudentController.updateStudent(req, res);
});

// Delete student
app.get('/deleteStudent/:id', StudentController.deleteStudent);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
