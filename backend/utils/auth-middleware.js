const jwt = require('jsonwebtoken');
const { setAuthCookie, removeAuthCookie } = require('../utils/auth-cookies');

const authenticateUser = (req, res, next) => {
  // 1. Try to get token from cookies first
  let token = req.cookies?.user_token;

  // 2. Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains user ID
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { authenticateUser };