-- ============================================================
-- HRMS Database Schema
-- Run this file to create the complete database structure
-- ============================================================

CREATE DATABASE IF NOT EXISTS hrms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hrms_db;

-- ============================================================
-- USERS TABLE (Authentication)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') DEFAULT 'employee',
  is_active TINYINT(1) DEFAULT 1,
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- EMPLOYEES TABLE (Profile & HR Data)
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  employee_id VARCHAR(20) NOT NULL UNIQUE,
  phone VARCHAR(20),
  department VARCHAR(100),
  designation VARCHAR(100),
  joining_date DATE,
  address TEXT,
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  blood_group VARCHAR(10),
  gender ENUM('male', 'female', 'other'),
  date_of_birth DATE,
  employment_type ENUM('full_time', 'part_time', 'contract', 'intern') DEFAULT 'full_time',
  status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
  manager_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ATTENDANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  check_in TIME DEFAULT NULL,
  check_out TIME DEFAULT NULL,
  status ENUM('present', 'absent', 'half_day', 'leave', 'holiday', 'weekend') DEFAULT 'absent',
  work_hours DECIMAL(5,2) DEFAULT 0.00,
  note TEXT DEFAULT NULL,
  check_in_location VARCHAR(255) DEFAULT NULL,
  check_out_location VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- LEAVE REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  leave_type ENUM('paid', 'sick', 'casual', 'unpaid', 'maternity', 'paternity') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL DEFAULT 1,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  admin_comment TEXT DEFAULT NULL,
  approved_by INT DEFAULT NULL,
  approved_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SALARY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS salary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  basic_salary DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  hra DECIMAL(10,2) DEFAULT 0.00,
  transport_allowance DECIMAL(10,2) DEFAULT 0.00,
  medical_allowance DECIMAL(10,2) DEFAULT 0.00,
  other_allowances DECIMAL(10,2) DEFAULT 0.00,
  pf_deduction DECIMAL(10,2) DEFAULT 0.00,
  tax_deduction DECIMAL(10,2) DEFAULT 0.00,
  other_deductions DECIMAL(10,2) DEFAULT 0.00,
  bonus DECIMAL(10,2) DEFAULT 0.00,
  gross_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary + hra + transport_allowance + medical_allowance + other_allowances + bonus) STORED,
  net_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary + hra + transport_allowance + medical_allowance + other_allowances + bonus - pf_deduction - tax_deduction - other_deductions) STORED,
  effective_from DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SALARY HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS salary_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  gross_salary DECIMAL(10,2) NOT NULL,
  net_salary DECIMAL(10,2) NOT NULL,
  bonus DECIMAL(10,2) DEFAULT 0.00,
  total_deductions DECIMAL(10,2) DEFAULT 0.00,
  paid_on DATE,
  status ENUM('pending', 'paid') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- HOLIDAYS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  date DATE NOT NULL UNIQUE,
  type ENUM('national', 'regional', 'company') DEFAULT 'national',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ACTIVITY LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_user ON leave_requests(user_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_activity_user ON activity_log(user_id);
