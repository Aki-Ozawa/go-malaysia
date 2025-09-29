const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/save-preferences', (req, res) => {
  const preferences = req.body;

  // Example insert query (adjust fields/table to match your DB)
  const sql = 'INSERT INTO preferences (category, budget, weather) VALUES (?, ?, ?)';
  db.query(sql, [preferences.category, preferences.budget, preferences.weather], (err, result) => {
    if (err) {
      return res.status(500).send('Failed to save preferences');
    }
    res.send('Preferences saved successfully!');
  });
});

module.exports = router;
