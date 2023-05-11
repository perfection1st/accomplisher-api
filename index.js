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

// USER REGISTRATION
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email already exists in the database
    const countQuery = 'SELECT COUNT(*) FROM users WHERE email = $1';
    console.log('Existence check query:', countQuery);
    console.log('Existence check query parameters:', [email]);

    const result = await pool.query(countQuery, [email]);
    console.log('Existence check query result:', result);

    const count = parseInt(result.rows[0].count, 10);
    if (count > 0) {
      return res.status(409).send('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery = 'INSERT INTO users (email, password, created_on) VALUES ($1, $2, $3)';
    console.log('Registration query:', insertQuery);
    console.log('Registration query parameters:', [email, '***', new Date()]);

    await pool.query(insertQuery, [email, hashedPassword, new Date()]);

    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// USER LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
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
      res.status(401).send('Invalid email');
    }
  } catch (err) {
    console.error(err); // Remove in production
    res.status(500).send('Error querying database');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
