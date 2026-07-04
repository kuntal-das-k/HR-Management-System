const { verifyToken } = require('../config/jwt');
const { sendError } = require('../utils/sendResponse');
const { pool } = require('../config/db');

/**
 * Middleware: Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch fresh user from DB (ensures token is not for deleted/deactivated user)
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, avatar FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows.length || !rows[0].is_active) {
      return sendError(res, 'User not found or account deactivated.', 401);
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired. Please login again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token.', 401);
    }
    return sendError(res, 'Authentication failed.', 500);
  }
};

module.exports = { authenticate };
