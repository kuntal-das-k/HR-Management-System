const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  applyLeave, getMyLeaves, getAllLeaves,
  updateLeaveStatus, cancelLeave, getLeaveBalance
} = require('../controllers/leaveController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const leaveRules = [
  body('leave_type').isIn(['paid', 'sick', 'casual', 'unpaid', 'maternity', 'paternity']).withMessage('Invalid leave type'),
  body('start_date').isDate().withMessage('Valid start date required'),
  body('end_date').isDate().withMessage('Valid end date required'),
  body('reason').trim().notEmpty().withMessage('Reason is required').isLength({ min: 5, max: 500 }),
];

router.post('/', authenticate, leaveRules, applyLeave);
router.get('/my', authenticate, getMyLeaves);
router.get('/balance', authenticate, getLeaveBalance);
router.get('/', authenticate, authorize('admin'), getAllLeaves);
router.put('/:id', authenticate, authorize('admin'), updateLeaveStatus);
router.delete('/:id', authenticate, cancelLeave);

module.exports = router;
