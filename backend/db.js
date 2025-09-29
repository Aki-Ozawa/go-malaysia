//this is for how to connect to MySQL and shares that connection pool. 
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aki4910123',
  database: 'go_malaysia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL pool connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL database via pool!');
  connection.release(); // important to release it!
});

// make this value available to other files: 
module.exports = pool;


