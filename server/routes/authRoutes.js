const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'),
  body('role').optional().isIn(['admin', 'employee']).withMessage('Invalid role'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'),
];

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePasswordRules, changePassword);

module.exports = router;
