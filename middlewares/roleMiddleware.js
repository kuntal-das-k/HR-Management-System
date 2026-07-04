const { sendError } = require('../utils/sendResponse');

/**
 * Middleware: Restrict route to specific roles
 * Usage: authorize('admin') or authorize('admin', 'employee')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Access denied. Required role: ${roles.join(' or ')}.`, 403);
    }
    next();
  };
};

module.exports = { authorize };
