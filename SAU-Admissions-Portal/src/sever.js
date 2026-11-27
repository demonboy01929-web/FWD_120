const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('Database opening error: ', err.message);
  else console.log('Connected to the SQLite database.');
});

// Create Applicants Table
db.run(`CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  mode TEXT,
  level TEXT,
  programme TEXT,
  passwordHash TEXT,
  status TEXT,
  submittedOn DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 1. Register / Submit Application Endpoint
app.post('/api/apply', async (req, res) => {
  try {
    const { name, email, phone, mode, level, programme, password } = req.body;
    
    // Hash password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Generate unique Student ID
    const studentId = `SAU26-${Math.floor(100000 + Math.random() * 900000)}`;
    const status = 'Submitted';

    const query = `INSERT INTO applicants (studentId, name, email, phone, mode, level, programme, passwordHash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [studentId, name, email, phone, mode, level, programme, passwordHash, status], function(err) {
      if (err) {
        return res.status(400).json({ error: 'Email already registered or invalid data.' });
      }
      res.status(201).json({ message: 'Application submitted successfully!', studentId });
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error during application processing.' });
  }
});

// 2. Student Portal Login Endpoint
app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body; // identifier can be studentId or email

  const query = `SELECT * FROM applicants WHERE studentId = ? OR email = ?`;
  db.get(query, [identifier, identifier], async (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: 'Invalid Student ID/Email or password.' });
    }

    const match = await bcrypt.compare(password, row.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid Student ID/Email or password.' });
    }

    // Return applicant data (excluding password hash)
    const { passwordHash, ...applicantData } = row;
    res.json({ message: 'Login successful', applicant: applicantData });
  });
});

app.listen(PORT, () => {
  console.log(`SAU Admissions backend running on http://localhost:${PORT}`);
});