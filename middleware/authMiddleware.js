const jwt = require('jsonwebtoken');

// Middleware to protect routes with JWT authentication
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};
