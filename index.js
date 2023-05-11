const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('pages'));
app.use(express.json());

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

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the username already exists in the database
    const { rowCount } = await pool.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    if (rowCount > 0) {
      return res.status(409).send('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
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
