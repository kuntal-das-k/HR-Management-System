const express = require('express');
const router = express.Router();
const {
  checkIn, checkOut, getTodayAttendance,
  getMyAttendance, getAllAttendance, getAttendanceStats, generateQR
} = require('../controllers/attendanceController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/checkin', authenticate, checkIn);
router.post('/checkout', authenticate, checkOut);
router.get('/today', authenticate, getTodayAttendance);
router.get('/my', authenticate, getMyAttendance);
router.get('/all', authenticate, authorize('admin'), getAllAttendance);
router.get('/stats', authenticate, getAttendanceStats);
router.get('/qr', authenticate, generateQR);

module.exports = router;
