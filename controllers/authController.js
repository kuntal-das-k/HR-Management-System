const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateToken } = require('../config/jwt');
const { sendSuccess, sendError } = require('../utils/sendResponse');
const { validationResult } = require('express-validator');

/**
 * POST /api/auth/register
 * Register a new employee account
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }

    const { name, email, password, role = 'employee', department, designation, phone } = req.body;

    // Check for duplicate email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return sendError(res, 'Email already registered.', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [userResult] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    const userId = userResult.insertId;

    // Generate employee ID
    const empId = `EMP${String(userId).padStart(3, '0')}`;

    // Create employee record
    await pool.query(
      'INSERT INTO employees (user_id, employee_id, department, designation, phone, joining_date) VALUES (?, ?, ?, ?, ?, CURDATE())',
      [userId, empId, department || 'General', designation || 'Employee', phone || null]
    );

    // Create default salary record
    await pool.query(
      'INSERT INTO salary (user_id, basic_salary, effective_from) VALUES (?, 50000, CURDATE())',
      [userId]
    );

    const token = generateToken({ id: userId, role });

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [userId, 'register', `${name} registered as ${role}`]
    );

    return sendSuccess(res, {
      token,
      user: { id: userId, name, email, role }
    }, 'Registration successful!', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 422, errors.array());
    }

    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT u.*, e.employee_id, e.department, e.designation FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE u.email = ?',
      [email]
    );

    if (!rows.length) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const user = rows[0];

    if (!user.is_active) {
      return sendError(res, 'Your account has been deactivated. Please contact HR.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const token = generateToken({ id: user.id, role: user.role });

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
      [user.id, 'login', `${user.name} logged in`, req.ip]
    );

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        employeeId: user.employee_id,
        department: user.department,
        designation: user.designation,
      }
    }, 'Login successful!');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
const getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.avatar, u.created_at,
              e.employee_id, e.phone, e.department, e.designation,
              e.joining_date, e.address, e.gender, e.date_of_birth,
              e.employment_type, e.status, e.blood_group,
              e.emergency_contact, e.emergency_phone
       FROM users u
       LEFT JOIN employees e ON u.id = e.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!rows.length) return sendError(res, 'User not found.', 404);

    // Unread notification count
    const [notifRows] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );

    return sendSuccess(res, {
      ...rows[0],
      unreadNotifications: notifRows[0].count
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return sendError(res, 'Current password is incorrect.', 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    return sendSuccess(res, {}, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, changePassword };
