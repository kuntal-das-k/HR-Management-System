const { sendError } = require('../utils/sendResponse');

/**
 * Global error handler middleware
 * Must be added LAST in Express middleware chain
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 'A record with this information already exists.', 409);
  }

  // MySQL not null violation
  if (err.code === 'ER_BAD_NULL_ERROR') {
    return sendError(res, 'Required field is missing.', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired.', 401);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'File size too large. Maximum 5MB allowed.', 400);
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return sendError(res, message, statusCode);
};

/**
 * 404 handler — for undefined routes
 */
const notFound = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found.`, 404);
};

module.exports = { errorHandler, notFound };
