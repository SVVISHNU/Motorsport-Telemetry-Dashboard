const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'f1_telemetry_super_secret_jwt_key_2026';

module.exports = function (req, res, next) {
  const tokenHeader = req.header('Authorization');
  if (!tokenHeader) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    const token = tokenHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
