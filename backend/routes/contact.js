// routes/contact.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // your mysql2 connection

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Name, email, and message are required.');
  }

  const sql = `INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, subject || null, message], (err) => {
    if (err) {
      console.error('Error inserting contact:', err);
      return res.status(500).send('Error saving contact');
    }
    res.send('Message received');
  });
});

module.exports = router;
