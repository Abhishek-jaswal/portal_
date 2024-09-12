const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
    const filePath = path.join(__dirname, 'students.json');
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function writeData(data) {
    const filePath = path.join(__dirname, 'students.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const students = readData();

    if (students.some(student => student.email === email)) {
        return res.json({ success: false, message: 'User already registered!' });
    }

    students.push({ name, email, password, score: 0 });
    writeData(students);
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const students = readData();

    const user = students.find(student => student.email === email && student.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid credentials.' });
    }
});

app.post('/submit-exam', (req, res) => {
    const { email, score } = req.body;
    const students = readData();

    const user = students.find(student => student.email === email);
    if (user) {
        user.score = score;
        writeData(students);
        res.json({ success: true, score });
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
