const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/sendResponse');

/**
 * GET /api/salary/my
 * Employee views own salary
 */
const getMySalary = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM salary WHERE user_id = ?',
      [req.user.id]
    );
    if (!rows.length) return sendError(res, 'Salary record not found.', 404);

    const [history] = await pool.query(
      'SELECT * FROM salary_history WHERE user_id = ? ORDER BY year DESC, month DESC LIMIT 12',
      [req.user.id]
    );

    return sendSuccess(res, { current: rows[0], history });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/salary
 * Admin: Get all salaries
 */
const getAllSalaries = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND (u.name LIKE ? OR e.employee_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (department) {
      where += ' AND e.department = ?';
      params.push(department);
    }

    const [rows] = await pool.query(
      `SELECT s.*, u.name, u.avatar, e.employee_id, e.department, e.designation
       FROM salary s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN employees e ON u.id = e.user_id
       ${where}
       ORDER BY s.net_salary DESC`,
      params
    );

    const [totals] = await pool.query(
      'SELECT SUM(net_salary) as total_payroll, AVG(net_salary) as avg_salary, COUNT(*) as count FROM salary'
    );

    return sendSuccess(res, { salaries: rows, totals: totals[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/salary/:userId
 * Admin: Get salary for specific employee
 */
const getSalaryByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT s.*, u.name, e.employee_id, e.department, e.designation
       FROM salary s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN employees e ON u.id = e.user_id
       WHERE s.user_id = ?`,
      [userId]
    );
    if (!rows.length) return sendError(res, 'Salary record not found.', 404);

    const [history] = await pool.query(
      'SELECT * FROM salary_history WHERE user_id = ? ORDER BY year DESC, month DESC LIMIT 12',
      [userId]
    );

    return sendSuccess(res, { current: rows[0], history });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/salary/:userId
 * Admin: Update salary
 */
const updateSalary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      basic_salary, hra, transport_allowance, medical_allowance,
      other_allowances, pf_deduction, tax_deduction, other_deductions,
      bonus, effective_from
    } = req.body;

    const [existing] = await pool.query('SELECT id FROM salary WHERE user_id = ?', [userId]);

    if (existing.length) {
      await pool.query(
        `UPDATE salary SET
          basic_salary = COALESCE(?, basic_salary),
          hra = COALESCE(?, hra),
          transport_allowance = COALESCE(?, transport_allowance),
          medical_allowance = COALESCE(?, medical_allowance),
          other_allowances = COALESCE(?, other_allowances),
          pf_deduction = COALESCE(?, pf_deduction),
          tax_deduction = COALESCE(?, tax_deduction),
          other_deductions = COALESCE(?, other_deductions),
          bonus = COALESCE(?, bonus),
          effective_from = COALESCE(?, effective_from)
         WHERE user_id = ?`,
        [basic_salary, hra, transport_allowance, medical_allowance,
         other_allowances, pf_deduction, tax_deduction, other_deductions,
         bonus, effective_from, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO salary (user_id, basic_salary, hra, transport_allowance, medical_allowance,
          other_allowances, pf_deduction, tax_deduction, other_deductions, bonus, effective_from)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, basic_salary || 0, hra || 0, transport_allowance || 0, medical_allowance || 0,
         other_allowances || 0, pf_deduction || 0, tax_deduction || 0, other_deductions || 0,
         bonus || 0, effective_from || new Date().toISOString().split('T')[0]]
      );
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.id, 'salary_update', `Salary updated for user ID ${userId}`]
    );

    return sendSuccess(res, {}, 'Salary updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/salary/process-monthly
 * Admin: Process monthly salary (add to history)
 */
const processMonthlyPayroll = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const [salaries] = await pool.query('SELECT * FROM salary');

    for (const s of salaries) {
      const totalDeductions = parseFloat(s.pf_deduction) + parseFloat(s.tax_deduction) + parseFloat(s.other_deductions);
      await pool.query(
        `INSERT INTO salary_history (user_id, month, year, basic_salary, gross_salary, net_salary, bonus, total_deductions, paid_on, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'paid')
         ON DUPLICATE KEY UPDATE status = 'paid', paid_on = CURDATE()`,
        [s.user_id, month, year, s.basic_salary, s.gross_salary, s.net_salary, s.bonus, totalDeductions]
      );

      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [s.user_id, 'Salary Credited', `Your salary for ${month}/${year} has been processed.`, 'success']
      );
    }

    return sendSuccess(res, {}, `Payroll processed for ${month}/${year} successfully.`);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMySalary, getAllSalaries, getSalaryByUser, updateSalary, processMonthlyPayroll };
