const jwt = require('jsonwebtoken');

/**
 * Authenticates a user request.
 * Accepts a JWT from either:
 * 1. The HttpOnly 'user_token' cookie (localhost / same-domain)
 * 2. A 'Authorization: Bearer <token>' header (Vercel → Render cross-domain proxy)
 */
const authenticateUser = (req, res, next) => {
  // 1. Try Authorization Bearer header first (cross-domain proxy)
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Fall back to HttpOnly cookie (localhost dev)
  if (!token) {
    token = req.cookies.user_token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateUser };