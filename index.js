const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

// Create a pool object that connects to your PostgreSQL database using the connection string
const pool = new Pool({
  connectionString: process.env.PG_CONNECT,
});

// Query a user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

// Implement authentication system
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token });
      } else {
        res.status(401).send('Invalid password');
      }
    } else {
      res.status(401).send('Invalid username');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
