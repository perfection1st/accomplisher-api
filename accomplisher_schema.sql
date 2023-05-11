DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS meals CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  created_on DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  task TEXT NOT NULL,
  due_date DATE,
  important BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  workout_date DATE,
  workout_type TEXT,
  duration_minutes INTEGER,
  calories_burned INTEGER
);

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  meal_date DATE,
  meal_type TEXT,
  meal_name TEXT,
  calories INTEGER
);