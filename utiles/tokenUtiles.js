const jwt = require('jsonwebtoken');

// Generate a JWT token for a user
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, 'your_jwt_secret', { expiresIn: '24h' });
};
