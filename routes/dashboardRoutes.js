const express = require('express');
const router = express.Router();
const {
  getAdminDashboard, getEmployeeDashboard,
  getNotifications, markNotificationsRead, getHolidays
} = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/admin', authenticate, authorize('admin'), getAdminDashboard);
router.get('/employee', authenticate, getEmployeeDashboard);
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/read', authenticate, markNotificationsRead);
router.get('/holidays', authenticate, getHolidays);

module.exports = router;
