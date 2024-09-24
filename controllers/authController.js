const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { generateToken } = require('../utils/tokenUtils');

// User Signup
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = uuidv4();

  const query = `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, name, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ message: 'User already exists.' });
    }
    const token = generateToken(userId);
    res.status(201).json({ token });
  });
};

// User Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);
    res.json({ token });
  });
};
