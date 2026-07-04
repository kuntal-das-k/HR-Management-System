const express = require('express');
const router = express.Router();
const {
  getMySalary, getAllSalaries, getSalaryByUser,
  updateSalary, processMonthlyPayroll
} = require('../controllers/salaryController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/my', authenticate, getMySalary);
router.get('/', authenticate, authorize('admin'), getAllSalaries);
router.post('/process', authenticate, authorize('admin'), processMonthlyPayroll);
router.get('/:userId', authenticate, authorize('admin'), getSalaryByUser);
router.put('/:userId', authenticate, authorize('admin'), updateSalary);

module.exports = router;
