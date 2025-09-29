// It uses pool once to create tables. 
const db = require('./db');

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
)
`;

const createPreferencesTable = `
CREATE TABLE IF NOT EXISTS preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100),
  budget VARCHAR(50),
  weather VARCHAR(50)
)
`;

db.query(createUserTable, (err, result) => {
  if (err) {
    console.error("❌ Failed to create users table:", err);
  } else {
    console.log("✅ Users table created or already exists.");
  }
});

db.query(createPreferencesTable, (err, result) => {
  if (err) {
    console.error("❌ Failed to create preferences table:", err);
  } else {
    console.log("✅ Preferences table created or already exists.");
  }
});
