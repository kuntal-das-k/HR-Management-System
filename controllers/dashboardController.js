const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/sendResponse');

/**
 * GET /api/dashboard/admin
 * Admin dashboard statistics
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Core stats in parallel
    const [
      [totalEmp],
      [presentToday],
      [pendingLeaves],
      [deptCount],
      [newHires],
      [payrollTotal],
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users WHERE role = "employee" AND is_active = 1'),
      pool.query('SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status IN ("present","half_day")', [today]),
      pool.query('SELECT COUNT(*) as count FROM leave_requests WHERE status = "pending"'),
      pool.query('SELECT COUNT(DISTINCT department) as count FROM employees'),
      pool.query('SELECT COUNT(*) as count FROM employees WHERE MONTH(joining_date) = MONTH(CURDATE()) AND YEAR(joining_date) = YEAR(CURDATE())'),
      pool.query('SELECT SUM(net_salary) as total FROM salary'),
    ]);

    // Attendance trend (last 7 days)
    const [attendanceTrend] = await pool.query(
      `SELECT DATE(date) as date,
              SUM(status IN ('present','half_day')) as present,
              SUM(status = 'absent') as absent
       FROM attendance
       WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(date)
       ORDER BY date`
    );

    // Department distribution
    const [deptDist] = await pool.query(
      `SELECT department, COUNT(*) as count FROM employees WHERE department IS NOT NULL GROUP BY department ORDER BY count DESC`
    );

    // Leave type distribution (current month)
    const [leaveByType] = await pool.query(
      `SELECT leave_type, COUNT(*) as count FROM leave_requests
       WHERE MONTH(start_date) = MONTH(CURDATE()) AND YEAR(start_date) = YEAR(CURDATE())
       GROUP BY leave_type`
    );

    // Monthly employee growth (last 6 months)
    const [empGrowth] = await pool.query(
      `SELECT DATE_FORMAT(joining_date, '%Y-%m') as month, COUNT(*) as count
       FROM employees
       WHERE joining_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(joining_date, '%Y-%m')
       ORDER BY month`
    );

    // Recent activities
    const [activities] = await pool.query(
      `SELECT al.*, u.name, u.avatar
       FROM activity_log al
       JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT 10`
    );

    // Recent leave requests
    const [recentLeaves] = await pool.query(
      `SELECT lr.*, u.name, u.avatar, e.employee_id, e.department
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       LEFT JOIN employees e ON u.id = e.user_id
       ORDER BY lr.created_at DESC LIMIT 5`
    );

    return sendSuccess(res, {
      stats: {
        totalEmployees: totalEmp[0].count,
        presentToday: presentToday[0].count,
        pendingLeaves: pendingLeaves[0].count,
        departments: deptCount[0].count,
        newHiresThisMonth: newHires[0].count,
        monthlyPayroll: payrollTotal[0].total || 0,
      },
      charts: {
        attendanceTrend,
        departmentDistribution: deptDist,
        leaveByType,
        employeeGrowth: empGrowth,
      },
      recentActivities: activities,
      recentLeaves,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/employee
 * Employee personal dashboard
 */
const getEmployeeDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [
      [todayAtt],
      [attStats],
      [leaveBalance],
      [recentActivities],
      [upcomingHolidays],
      [recentLeaves],
      [salary],
    ] = await Promise.all([
      pool.query('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [userId, today]),
      pool.query(
        `SELECT status, COUNT(*) as count FROM attendance
         WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
         GROUP BY status`, [userId, month, year]
      ),
      pool.query(
        `SELECT leave_type, SUM(total_days) as used
         FROM leave_requests WHERE user_id = ? AND status = 'approved' AND YEAR(start_date) = ?
         GROUP BY leave_type`, [userId, year]
      ),
      pool.query(
        `SELECT al.*, u.name FROM activity_log al
         JOIN users u ON al.user_id = u.id
         WHERE al.user_id = ? ORDER BY al.created_at DESC LIMIT 8`, [userId]
      ),
      pool.query(
        `SELECT * FROM holidays WHERE date >= CURDATE() ORDER BY date LIMIT 5`
      ),
      pool.query(
        `SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`, [userId]
      ),
      pool.query('SELECT net_salary, gross_salary, bonus FROM salary WHERE user_id = ?', [userId]),
    ]);

    // Build attendance summary
    const attSummary = { present: 0, absent: 0, half_day: 0, leave: 0 };
    attStats.forEach(r => { attSummary[r.status] = r.count; });

    const daysInMonth = new Date(year, month, 0).getDate();
    const totalWorkDays = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month - 1, i + 1);
      return d.getDay() !== 0 && d.getDay() !== 6 && new Date(year, month - 1, i + 1) <= now;
    }).filter(Boolean).length;
    const attendancePercent = totalWorkDays > 0 ? Math.round(((attSummary.present + attSummary.half_day * 0.5) / totalWorkDays) * 100) : 0;

    // Build leave balance
    const leaveLimits = { paid: 15, sick: 10, casual: 8, unpaid: 30 };
    const leaveBalanceMap = {};
    Object.keys(leaveLimits).forEach(type => {
      const used = leaveBalance.find(r => r.leave_type === type)?.used || 0;
      leaveBalanceMap[type] = { total: leaveLimits[type], used, remaining: Math.max(0, leaveLimits[type] - used) };
    });

    // Notifications
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    return sendSuccess(res, {
      todayAttendance: todayAtt[0] || { status: 'absent', date: today },
      attendance: { summary: attSummary, attendancePercent },
      leaveBalance: leaveBalanceMap,
      recentActivities,
      upcomingHolidays,
      recentLeaves,
      salary: salary[0] || null,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/dashboard/notifications/read
 */
const markNotificationsRead = async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    return sendSuccess(res, {}, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/holidays
 */
const getHolidays = async (req, res, next) => {
  try {
    const { year } = req.query;
    let where = year ? 'WHERE YEAR(date) = ?' : 'WHERE YEAR(date) = YEAR(CURDATE())';
    const params = year ? [year] : [];
    const [rows] = await pool.query(`SELECT * FROM holidays ${where} ORDER BY date`, params);
    return sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAdminDashboard, getEmployeeDashboard, getNotifications, markNotificationsRead, getHolidays };
