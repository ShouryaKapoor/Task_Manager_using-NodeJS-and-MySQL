const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'kapoor13',
    database: 'task_manager'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

const secret = 'your_jwt_secret';

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
        if (err) throw err;
        res.send('User registered');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];
            const passwordIsValid = bcrypt.compareSync(password, user.password);

            if (passwordIsValid) {
                const token = jwt.sign({ id: user.id }, secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.json({ auth: true, token: token });
            } else {
                res.send('Invalid credentials');
            }
        } else {
            res.send('Invalid credentials');
        }
    });
});

app.post('/tasks', (req, res) => {
    const { user_id, title, description } = req.body;
    const query = 'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)';
    db.query(query, [user_id, title, description], (err, result) => {
        if (err) throw err;
        res.send('Task added');
    });
});

app.get('/tasks/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [user_id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const query = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
    db.query(query, [title, description, status, id], (err, result) => {
        if (err) throw err;
        res.send('Task updated');
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send('Task deleted');
    });
});

app.listen(3306, () => {
    console.log('Server running on port 3000');
});
