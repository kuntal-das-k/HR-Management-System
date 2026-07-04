const { pool } = require('../config/db');
const { sendSuccess, sendError, sendPaginated } = require('../utils/sendResponse');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');

/**
 * GET /api/employees
 * Admin: Get all employees with search/filter/pagination
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const { search = '', department = '', page = 1, limit = 10, status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE u.role = "employee"';
    const params = [];

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ? OR e.employee_id LIKE ? OR e.designation LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (department) {
      whereClause += ' AND e.department = ?';
      params.push(department);
    }
    if (status) {
      whereClause += ' AND e.status = ?';
      params.push(status);
    }

    const [employees] = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar, u.is_active, u.created_at,
              e.employee_id, e.phone, e.department, e.designation,
              e.joining_date, e.employment_type, e.status, e.gender
       FROM users u
       LEFT JOIN employees e ON u.id = e.user_id
       ${whereClause}
       ORDER BY e.joining_date DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM users u LEFT JOIN employees e ON u.id = e.user_id ${whereClause}`,
      params
    );

    return sendPaginated(res, employees, countResult[0].total, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/employees/:id
 * Get single employee details (Admin or self)
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Employees can only view their own profile
    if (req.user.role === 'employee' && parseInt(id) !== req.user.id) {
      return sendError(res, 'Access denied.', 403);
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.avatar, u.is_active, u.created_at,
              e.employee_id, e.phone, e.department, e.designation,
              e.joining_date, e.address, e.gender, e.date_of_birth,
              e.employment_type, e.status, e.blood_group, e.emergency_contact, e.emergency_phone
       FROM users u
       LEFT JOIN employees e ON u.id = e.user_id
       WHERE u.id = ?`,
      [id]
    );

    if (!rows.length) return sendError(res, 'Employee not found.', 404);

    // Fetch salary info
    const [salary] = await pool.query(
      'SELECT basic_salary, gross_salary, net_salary, bonus FROM salary WHERE user_id = ?',
      [id]
    );

    return sendSuccess(res, { ...rows[0], salary: salary[0] || null });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/employees/:id
 * Update employee profile (Admin or self for limited fields)
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && parseInt(id) !== req.user.id) {
      return sendError(res, 'Access denied.', 403);
    }

    const {
      name, phone, address, gender, date_of_birth,
      emergency_contact, emergency_phone, blood_group,
      // Admin-only fields
      department, designation, employment_type, status, joining_date
    } = req.body;

    // Update users table
    if (name) {
      await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    }

    // Build dynamic employee update
    const empFields = {};
    if (phone !== undefined) empFields.phone = phone;
    if (address !== undefined) empFields.address = address;
    if (gender !== undefined) empFields.gender = gender;
    if (date_of_birth !== undefined) empFields.date_of_birth = date_of_birth;
    if (emergency_contact !== undefined) empFields.emergency_contact = emergency_contact;
    if (emergency_phone !== undefined) empFields.emergency_phone = emergency_phone;
    if (blood_group !== undefined) empFields.blood_group = blood_group;
    if (isAdmin && department !== undefined) empFields.department = department;
    if (isAdmin && designation !== undefined) empFields.designation = designation;
    if (isAdmin && employment_type !== undefined) empFields.employment_type = employment_type;
    if (isAdmin && status !== undefined) empFields.status = status;
    if (isAdmin && joining_date !== undefined) empFields.joining_date = joining_date;

    if (Object.keys(empFields).length) {
      const setClauses = Object.keys(empFields).map(k => `${k} = ?`).join(', ');
      await pool.query(
        `UPDATE employees SET ${setClauses} WHERE user_id = ?`,
        [...Object.values(empFields), id]
      );
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.id, 'profile_update', `Profile updated for user ID ${id}`]
    );

    return sendSuccess(res, {}, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/employees/:id/avatar
 * Upload profile picture
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400);

    const { id } = req.params;
    if (req.user.role === 'employee' && parseInt(id) !== req.user.id) {
      return sendError(res, 'Access denied.', 403);
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, id]);

    return sendSuccess(res, { avatar: avatarPath }, 'Avatar uploaded successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/employees/:id
 * Admin: Deactivate (soft delete) employee
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return sendError(res, 'Cannot deactivate yourself.', 400);
    }

    await pool.query('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
    await pool.query('UPDATE employees SET status = "inactive" WHERE user_id = ?', [id]);

    return sendSuccess(res, {}, 'Employee deactivated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/employees/departments
 * Get unique departments list
 */
const getDepartments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT department, COUNT(*) as count FROM employees WHERE department IS NOT NULL GROUP BY department ORDER BY department'
    );
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/employees/stats
 * Admin: Quick stats for dashboard
 */
const getEmployeeStats = async (req, res, next) => {
  try {
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = "employee" AND is_active = 1');
    const [deptResult] = await pool.query('SELECT COUNT(DISTINCT department) as count FROM employees WHERE department IS NOT NULL');
    const [newResult] = await pool.query('SELECT COUNT(*) as count FROM employees WHERE MONTH(joining_date) = MONTH(CURDATE()) AND YEAR(joining_date) = YEAR(CURDATE())');

    return sendSuccess(res, {
      totalEmployees: totalResult[0].total,
      totalDepartments: deptResult[0].count,
      newThisMonth: newResult[0].count,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  uploadAvatar,
  deleteEmployee,
  getDepartments,
  getEmployeeStats,
};
