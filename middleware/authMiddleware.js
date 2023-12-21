const jwt = require('jsonwebtoken');
const jwtsecret = require('../config/jwt-secret');
const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');
  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.split(' ')[1], jwtsecret);
    req.userId = decoded.userId; // Attach user ID to the request for future use
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;