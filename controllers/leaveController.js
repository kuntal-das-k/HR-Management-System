const { pool } = require('../config/db');
const { sendSuccess, sendError, sendPaginated } = require('../utils/sendResponse');
const { validationResult } = require('express-validator');

/**
 * POST /api/leave
 * Employee applies for leave
 */
const applyLeave = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', 422, errors.array());

    const { leave_type, start_date, end_date, reason } = req.body;
    const userId = req.user.id;

    // Calculate total days (excluding weekends)
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end < start) return sendError(res, 'End date cannot be before start date.', 400);

    let totalDays = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) totalDays++;
      current.setDate(current.getDate() + 1);
    }

    if (totalDays === 0) return sendError(res, 'Leave dates fall on weekends only.', 400);

    // Check for overlapping leaves
    const [overlapping] = await pool.query(
      `SELECT id FROM leave_requests 
       WHERE user_id = ? AND status NOT IN ('rejected', 'cancelled')
       AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?))`,
      [userId, end_date, start_date, start_date, start_date]
    );
    if (overlapping.length) return sendError(res, 'You already have a leave request for these dates.', 409);

    const [result] = await pool.query(
      'INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, total_days, reason) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, leave_type, start_date, end_date, totalDays, reason]
    );

    // Notify admins
    const [admins] = await pool.query('SELECT id FROM users WHERE role = "admin"');
    for (const admin of admins) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [admin.id, 'New Leave Request', `${req.user.name} applied for ${totalDays} day(s) of ${leave_type} leave.`, 'info']
      );
    }

    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [userId, 'leave_apply', `Applied for ${leave_type} leave from ${start_date} to ${end_date}`]
    );

    return sendSuccess(res, { id: result.insertId, totalDays }, 'Leave application submitted successfully!', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leave/my
 * Employee: Get own leave history
 */
const getMyLeaves = async (req, res, next) => {
  try {
    const { status, year } = req.query;
    let where = 'WHERE lr.user_id = ?';
    const params = [req.user.id];

    if (status) { where += ' AND lr.status = ?'; params.push(status); }
    if (year) { where += ' AND YEAR(lr.start_date) = ?'; params.push(year); }

    const [rows] = await pool.query(
      `SELECT lr.*, u.name as approved_by_name
       FROM leave_requests lr
       LEFT JOIN users u ON lr.approved_by = u.id
       ${where} ORDER BY lr.created_at DESC`,
      params
    );

    // Summary counts
    const [summary] = await pool.query(
      `SELECT status, COUNT(*) as count, SUM(total_days) as days
       FROM leave_requests WHERE user_id = ? AND YEAR(start_date) = YEAR(CURDATE())
       GROUP BY status`,
      [req.user.id]
    );

    return sendSuccess(res, { leaves: rows, summary });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leave
 * Admin: Get all leave requests
 */
const getAllLeaves = async (req, res, next) => {
  try {
    const { status, department, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const params = [];

    if (status) { where += ' AND lr.status = ?'; params.push(status); }
    if (department) { where += ' AND e.department = ?'; params.push(department); }
    if (search) {
      where += ' AND (u.name LIKE ? OR e.employee_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(
      `SELECT lr.*, u.name as employee_name, u.avatar, e.employee_id, e.department, e.designation,
              au.name as approved_by_name
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       LEFT JOIN employees e ON u.id = e.user_id
       LEFT JOIN users au ON lr.approved_by = au.id
       ${where}
       ORDER BY lr.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       LEFT JOIN employees e ON u.id = e.user_id ${where}`,
      params
    );

    return sendPaginated(res, rows, countResult[0].total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/leave/:id
 * Admin: Approve or reject leave
 */
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
      return sendError(res, 'Invalid status.', 400);
    }

    const [leave] = await pool.query('SELECT * FROM leave_requests WHERE id = ?', [id]);
    if (!leave.length) return sendError(res, 'Leave request not found.', 404);

    if (leave[0].status !== 'pending') {
      return sendError(res, 'Only pending leave requests can be updated.', 400);
    }

    await pool.query(
      'UPDATE leave_requests SET status = ?, admin_comment = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
      [status, admin_comment || null, req.user.id, id]
    );

    // If approved, mark attendance as leave for those dates
    if (status === 'approved') {
      const start = new Date(leave[0].start_date);
      const end = new Date(leave[0].end_date);
      const current = new Date(start);
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          const dateStr = current.toISOString().split('T')[0];
          await pool.query(
            `INSERT INTO attendance (user_id, date, status) VALUES (?, ?, 'leave')
             ON DUPLICATE KEY UPDATE status = 'leave'`,
            [leave[0].user_id, dateStr]
          );
        }
        current.setDate(current.getDate() + 1);
      }
    }

    // Notify employee
    const statusMsg = status === 'approved' ? '✅ approved' : '❌ rejected';
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [
        leave[0].user_id,
        `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `Your leave request has been ${statusMsg}.${admin_comment ? ` Comment: ${admin_comment}` : ''}`,
        status === 'approved' ? 'success' : 'error'
      ]
    );

    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.id, `leave_${status}`, `Leave #${id} ${status} by admin`]
    );

    return sendSuccess(res, {}, `Leave ${status} successfully.`);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/leave/:id
 * Employee: Cancel own pending leave
 */
const cancelLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [leave] = await pool.query(
      'SELECT * FROM leave_requests WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!leave.length) return sendError(res, 'Leave request not found.', 404);
    if (leave[0].status !== 'pending') return sendError(res, 'Only pending requests can be cancelled.', 400);

    await pool.query('UPDATE leave_requests SET status = "cancelled" WHERE id = ?', [id]);
    return sendSuccess(res, {}, 'Leave request cancelled.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leave/balance
 * Get leave balance for current user
 */
const getLeaveBalance = async (req, res, next) => {
  try {
    const userId = req.query.userId && req.user.role === 'admin' ? req.query.userId : req.user.id;
    const year = new Date().getFullYear();

    const [rows] = await pool.query(
      `SELECT leave_type, SUM(total_days) as used
       FROM leave_requests
       WHERE user_id = ? AND status = 'approved' AND YEAR(start_date) = ?
       GROUP BY leave_type`,
      [userId, year]
    );

    const limits = { paid: 15, sick: 10, casual: 8, unpaid: 30, maternity: 90, paternity: 7 };
    const balance = {};
    Object.keys(limits).forEach(type => {
      const used = rows.find(r => r.leave_type === type)?.used || 0;
      balance[type] = { total: limits[type], used, remaining: Math.max(0, limits[type] - used) };
    });

    return sendSuccess(res, balance);
  } catch (err) {
    next(err);
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, cancelLeave, getLeaveBalance };
