-- create some dummy users
INSERT INTO users (first_name, last_name, created_on, username, password)
VALUES ('John', 'Doe', '2022-01-01', 'johndoe', 'password123'),
       ('Jane', 'Smith', '2022-01-02', 'janesmith', 'password456'),
       ('Bob', 'Johnson', '2022-01-03', 'bobjohnson', 'password789');

-- create some dummy todos for the users
INSERT INTO todos (user_id, task, due_date, important, completed)
VALUES (1, 'Finish project proposal', '2022-01-10', true, false),
       (1, 'Buy groceries', '2022-01-15', false, true),
       (2, 'Call mom', '2022-01-12', true, false),
       (3, 'Pay rent', '2022-01-31', false, false);

-- create some dummy workouts for the users
INSERT INTO workouts (user_id, workout_date, workout_type, duration_minutes, calories_burned)
VALUES (1, '2022-01-01', 'Running', 30, 200),
       (1, '2022-01-02', 'Swimming', 60, 500),
       (2, '2022-01-01', 'Cycling', 45, 400),
       (3, '2022-01-02', 'Weightlifting', 90, 600);

-- create some dummy meals for the users
INSERT INTO meals (user_id, meal_date, meal_type, meal_name, calories)
VALUES (1, '2022-01-01', 'Breakfast', 'Oatmeal', 300),
       (1, '2022-01-01', 'Lunch', 'Sandwich', 500),
       (2, '2022-01-02', 'Dinner', 'Pizza', 800),
       (3, '2022-01-03', 'Snack', 'Apple', 100);
