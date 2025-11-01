# Copilot instructions — StudentListApp (Express + EJS)

Purpose
- Help an AI coding agent be productive in this small MVC-style Express app that lists students and supports image uploads.

Quick architecture summary
- Single Express app (entry: `app.js`) implements all routes and DB queries. There is a `controllers/` and `models/` folder but they are currently empty — canonical logic lives in `app.js`.
- Views are server-rendered EJS templates in `views/` (`index.ejs`, `student.ejs`, `addStudent.ejs`, `editStudent.ejs`).
- Static assets served from `public/`; uploaded images are saved to `public/images` and referenced as `images/<filename>` in EJS templates.
- DB access: `app.js` currently creates a `mysql2` connection inline (hard-coded creds). There is also a `db.js` which expects env variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) via `dotenv` — prefer `db.js` for new work.

Key routes and shapes (copy these examples when modifying behavior)
- GET / — list students: SELECT * FROM students -> render `index.ejs` with `students` array.
- GET /student/:id — SELECT * FROM students WHERE studentId = ? -> render `student.ejs` with `student` object.
- GET /addStudent, POST /addStudent (multer single file `image`) — INSERT INTO students (name, dob, contact, image) VALUES (?, ?, ?, ?)
- GET /editStudent/:id, POST /editStudent/:id (multer single file `image`) — UPDATE students SET name=?, dob=?, contact=?, image=? WHERE studentId = ?
- GET /deleteStudent/:id — DELETE FROM students WHERE studentId = ?

Important implementation patterns
- DB queries use `connection.query(sql, params, callback)` (callback style). New changes should follow this pattern unless migrating to promises/async — keep changes small and consistent.
- File uploads use `multer.diskStorage` configured in `app.js` with destination `public/images` and `file.originalname` for filename. The app stores only the filename in the DB. When rendering, templates use `<img src="images/<%= student.image %>">`.
- Dates: `index.ejs` converts stored DOB strings to JS Date and formats with `toLocaleDateString` before rendering.
- Views rely on EJS templating and direct object properties from DB rows (e.g., `students[i].studentId`, `students[i].name`).

Conventions and gotchas specific to this repo
- Two DB patterns exist: inline connection in `app.js` (hard-coded values) and `db.js` (dotenv). Prefer `db.js` for new code and remove/replace inline connection to avoid duplication.
- `package.json` lists dependencies (express, ejs, multer, mysql2) but contains no `start` script. To run locally use `node app.js`.
- `controllers/` and `models/` are placeholders. If adding controllers, keep routes in `app.js` or move logic to `controllers/StudentController.js` and require it from `app.js` (preserve existing route URLs).
- DB table expected columns: `studentId`, `name`, `dob`, `contact`, `image`. Use these exact names when writing SQL or mapping results.

Run / debug steps (how a dev runs the app)
1. npm install
2. Ensure MySQL is running and a database with the expected schema exists. The app uses table `students` in DB (example DB name in app.js: `c237_studentlistapp`).
3. Preferred: create a `.env` with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME and switch `app.js` to use `db.js` (or update `db.js` to export the same connection used by `app.js`).
4. Start server: `node app.js` (server listens on PORT env or 3001 by default). Open http://localhost:3001

When editing code, examples to follow
- Use existing SQL parameter style: `connection.query(sql, [param1, param2], (err, results) => { ... })`.
- When adding/maintaining uploads, keep multer storage destination `public/images` and store `req.file.filename` in DB.
- Keep rendering data shapes matching DB row fields used in views. E.g., when passing a student to `student.ejs`, ensure it has `studentId, name, dob, contact, image`.

Suggested small improvements (safe, low-risk)
- Add a `start` script to `package.json` ("start": "node app.js").
- Consolidate DB connection: pick `db.js` + `.env` and remove hard-coded connection from `app.js`.
- Add minimal validation around file uploads (file type/size) and null-safe image rendering in templates.

Files to inspect when making changes
- `app.js` — main routes and business logic
- `db.js` — canonical DB connection (preferred)
- `views/*.ejs` — UI templates
- `public/images/` — uploaded images storage
- `controllers/StudentController.js`, `models/Student.js` — currently empty; new controller/model code should mirror data shapes above

If anything in these instructions is unclear or you need me to reference a specific file or add examples (controller refactor, `.env` template, SQL schema) tell me which part to expand.
