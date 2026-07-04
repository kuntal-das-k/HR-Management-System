const express = require('express');
const router = express.Router();
const {
  getAllEmployees, getEmployeeById, updateEmployee,
  uploadAvatar, deleteEmployee, getDepartments, getEmployeeStats
} = require('../controllers/employeeController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', authenticate, authorize('admin'), getAllEmployees);
router.get('/departments', authenticate, getDepartments);
router.get('/stats', authenticate, authorize('admin'), getEmployeeStats);
router.get('/:id', authenticate, getEmployeeById);
router.put('/:id', authenticate, updateEmployee);
router.post('/:id/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.delete('/:id', authenticate, authorize('admin'), deleteEmployee);

module.exports = router;
