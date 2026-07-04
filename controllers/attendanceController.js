const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/sendResponse');
const QRCode = require('qrcode');

/**
 * POST /api/attendance/checkin
 * Employee checks in for the day
 */
const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];

    // Check if already checked in today
    const [existing] = await pool.query(
      'SELECT id, check_in, check_out FROM attendance WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (existing.length && existing[0].check_in) {
      return sendError(res, 'Already checked in today.', 409);
    }

    if (existing.length) {
      // Update existing absent record
      await pool.query(
        'UPDATE attendance SET check_in = ?, status = "present" WHERE user_id = ? AND date = ?',
        [now, userId, today]
      );
    } else {
      // Create new attendance record
      await pool.query(
        'INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, "present")',
        [userId, today, now]
      );
    }

    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [userId, 'check_in', `Checked in at ${now}`]
    );

    return sendSuccess(res, { checkIn: now, date: today }, 'Checked in successfully!');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/attendance/checkout
 * Employee checks out
 */
const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];

    const [existing] = await pool.query(
      'SELECT id, check_in, check_out FROM attendance WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (!existing.length || !existing[0].check_in) {
      return sendError(res, 'You have not checked in today.', 400);
    }

    if (existing[0].check_out) {
      return sendError(res, 'Already checked out today.', 409);
    }

    // Calculate work hours
    const checkInTime = existing[0].check_in;
    const [hIn, mIn, sIn] = checkInTime.split(':').map(Number);
    const [hOut, mOut, sOut] = now.split(':').map(Number);
    const workHours = ((hOut * 3600 + mOut * 60 + sOut) - (hIn * 3600 + mIn * 60 + sIn)) / 3600;

    // Determine status based on hours
    let status = 'present';
    if (workHours < 4.5) status = 'half_day';

    await pool.query(
      'UPDATE attendance SET check_out = ?, work_hours = ?, status = ? WHERE user_id = ? AND date = ?',
      [now, workHours.toFixed(2), status, userId, today]
    );

    await pool.query(
      'INSERT INTO activity_log (user_id, action, description) VALUES (?, ?, ?)',
      [userId, 'check_out', `Checked out at ${now}. Hours: ${workHours.toFixed(2)}`]
    );

    return sendSuccess(res, { checkOut: now, workHours: workHours.toFixed(2), status }, 'Checked out successfully!');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/today
 * Get today's attendance status for current user
 */
const getTodayAttendance = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
      [req.user.id, today]
    );
    return sendSuccess(res, rows[0] || { status: 'absent', date: today });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/my
 * Get attendance history for current user with date range
 */
const getMyAttendance = async (req, res, next) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let whereClause = 'WHERE user_id = ?';
    const params = [req.user.id];

    if (startDate && endDate) {
      whereClause += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (month && year) {
      whereClause += ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(month, year);
    } else {
      // Default: current month
      const now = new Date();
      whereClause += ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(now.getMonth() + 1, now.getFullYear());
    }

    const [rows] = await pool.query(
      `SELECT * FROM attendance ${whereClause} ORDER BY date DESC`,
      params
    );

    // Calculate summary
    const summary = {
      present: rows.filter(r => r.status === 'present').length,
      absent: rows.filter(r => r.status === 'absent').length,
      halfDay: rows.filter(r => r.status === 'half_day').length,
      leave: rows.filter(r => r.status === 'leave').length,
      totalHours: rows.reduce((sum, r) => sum + parseFloat(r.work_hours || 0), 0).toFixed(2),
    };

    return sendSuccess(res, { records: rows, summary });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/all
 * Admin: Get all employees' attendance
 */
const getAllAttendance = async (req, res, next) => {
  try {
    const { date, department, search } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    let whereClause = 'WHERE a.date = ? AND u.role = "employee"';
    const params = [targetDate];

    if (department) {
      whereClause += ' AND e.department = ?';
      params.push(department);
    }
    if (search) {
      whereClause += ' AND (u.name LIKE ? OR e.employee_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(
      `SELECT a.*, u.name, u.avatar, e.employee_id, e.department, e.designation
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN employees e ON u.id = e.user_id
       ${whereClause}
       ORDER BY u.name`,
      params
    );

    // Get employees who haven't marked attendance
    const [allEmployees] = await pool.query(
      `SELECT u.id, u.name, u.avatar, e.employee_id, e.department, e.designation
       FROM users u
       LEFT JOIN employees e ON u.id = e.user_id
       WHERE u.role = "employee" AND u.is_active = 1
       AND u.id NOT IN (SELECT user_id FROM attendance WHERE date = ?)`,
      [targetDate]
    );

    const absent = allEmployees.map(emp => ({ ...emp, status: 'absent', date: targetDate, check_in: null, check_out: null }));

    return sendSuccess(res, {
      records: [...rows, ...absent],
      date: targetDate,
      summary: {
        present: rows.filter(r => r.status === 'present').length,
        absent: absent.length + rows.filter(r => r.status === 'absent').length,
        halfDay: rows.filter(r => r.status === 'half_day').length,
        leave: rows.filter(r => r.status === 'leave').length,
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/stats
 * Monthly stats for current user
 */
const getAttendanceStats = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();
    const userId = req.query.userId && req.user.role === 'admin' ? req.query.userId : req.user.id;

    const [rows] = await pool.query(
      'SELECT status, COUNT(*) as count FROM attendance WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY status',
      [userId, month, year]
    );

    const stats = { present: 0, absent: 0, half_day: 0, leave: 0 };
    rows.forEach(r => { stats[r.status] = r.count; });

    // Working days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const totalWorkingDays = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month - 1, i + 1);
      return d.getDay() !== 0 && d.getDay() !== 6;
    }).filter(Boolean).length;

    const attendancePercent = totalWorkingDays > 0
      ? Math.round(((stats.present + stats.half_day * 0.5) / totalWorkingDays) * 100)
      : 0;

    return sendSuccess(res, { stats, totalWorkingDays, attendancePercent });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attendance/qr
 * Generate QR code for check-in
 */
const generateQR = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const payload = JSON.stringify({
      userId: req.user.id,
      date: today,
      action: 'checkin',
      token: require('crypto').createHash('sha256').update(`${req.user.id}-${today}-qr`).digest('hex').slice(0, 16),
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: { dark: '#4338CA', light: '#FFFFFF' },
      width: 300,
    });

    return sendSuccess(res, { qr: qrDataUrl, date: today }, 'QR code generated.');
  } catch (err) {
    next(err);
  }
};

module.exports = { checkIn, checkOut, getTodayAttendance, getMyAttendance, getAllAttendance, getAttendanceStats, generateQR };
