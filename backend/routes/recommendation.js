const express = require('express');
const router = express.Router();
const db = require('../db');

// Example: POST /api/recommend
router.post('/recommend', (req, res) => {
  const { age, gender, interests, budget, travelStyle } = req.body;

  if (!age || !interests || !budget || !travelStyle) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  // Example SQL logic (customize to your DB)
  const sql = `
    SELECT * FROM recommendations
    WHERE 
      interest IN (?) AND 
      budget <= ? AND 
      travel_style = ?
    LIMIT 5
  `;

  db.query(sql, [interests, budget, travelStyle], (err, results) => {
    if (err) {
      console.error('❌ Error fetching recommendations:', err);
      return res.status(500).json({ message: 'Failed to get recommendations.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No matching recommendations found.' });
    }

    res.status(200).json({ message: 'Recommendations found', results });
  });
});

module.exports = router;
