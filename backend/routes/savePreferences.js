const express = require('express');
const router = express.Router();
const db = require('../db');

// Save user preferences from questionnaire
router.post('/save-preferences', (req, res) => {
  const data = req.body;

  // Validate essential fields
  if (!data.recommendationType || !data.month || !data.preference || !data.weather) {
    return res.status(400).json({ message: 'Missing essential preferences.' });
  }

  const sql = `
    INSERT INTO recommendations (
      user_id, category, region, cuisine, diet, budget, duration, style,
      interests, items, activities, level, month, preference, weather
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.user_id || null,
    data.recommendationType || null,
    data.region || null,
    data.cuisine || null,
    data.diet || null,
    data.budget || null,
    data.duration || null,
    data.style || null,
    data.interests || null,
    data.items || null,
    data.activities || null,
    data.level || null,
    data.month || null,
    data.preference || null,
    data.weather || null
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Failed to save preferences:', err);
      return res.status(500).json({ message: 'Failed to save preferences' });
    }

    console.log('✅ Preferences saved with ID:', result.insertId);
    res.status(200).json({
      message: 'Preferences saved successfully!',
      insertedId: result.insertId,
      savedData: data
    });
  });
});

module.exports = router;
