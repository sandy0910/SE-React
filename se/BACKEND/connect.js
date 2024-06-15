const mysql = require('mysql2');
const express = require('express');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'se'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err.stack);
    process.exit(1); // Exit the process or handle the error as appropriate
  }
  console.log('Connected to MySQL server');
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
