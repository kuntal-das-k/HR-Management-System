-- ============================================================
-- HRMS Seed Data — Demo Accounts & Sample Records
-- Run AFTER database.sql
-- ============================================================

USE hrms_db;

-- ============================================================
-- USERS
-- Admin password: Admin@123
-- Employee password: Emp@123
-- (bcrypt hashed, cost factor 10)
-- ============================================================
INSERT INTO users (id, name, email, password, role, is_active) VALUES
(1, 'Admin User',      'admin@hrms.com',    '$2b$10$W7K/El5X0K1fZTPA3XIWC.K7R85M66lCvkYjSLR0I.jNYNivrVDTa', 'admin',    1),
(2, 'Alice Johnson',   'alice@hrms.com',    '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(3, 'Bob Smith',       'bob@hrms.com',      '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(4, 'Carol Williams',  'carol@hrms.com',    '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(5, 'David Brown',     'david@hrms.com',    '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(6, 'Eva Martinez',    'eva@hrms.com',      '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(7, 'Frank Lee',       'frank@hrms.com',    '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(8, 'Grace Kim',       'grace@hrms.com',    '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(9, 'Henry Davis',     'henry@hrms.com',    '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1),
(10,'Iris Wilson',     'iris@hrms.com',     '$2b$10$Y/Vq4b7D4mEjh55bfpUHqeQROutpAyfU/pg9tdVIX6X7XaYPP/Rxi', 'employee', 1);

-- ============================================================
-- EMPLOYEES
-- ============================================================
INSERT INTO employees (user_id, employee_id, phone, department, designation, joining_date, address, gender, employment_type, status) VALUES
(1,  'EMP001', '9800000001', 'Management',       'HR Manager',          '2022-01-01', '101 Main St, New York',        'male',   'full_time', 'active'),
(2,  'EMP002', '9800000002', 'Engineering',       'Senior Developer',    '2022-03-15', '202 Oak Ave, Los Angeles',     'female', 'full_time', 'active'),
(3,  'EMP003', '9800000003', 'Engineering',       'Backend Developer',   '2022-05-20', '303 Pine Rd, Chicago',         'male',   'full_time', 'active'),
(4,  'EMP004', '9800000004', 'Design',            'UI/UX Designer',      '2022-07-01', '404 Elm Blvd, Houston',        'female', 'full_time', 'active'),
(5,  'EMP005', '9800000005', 'Marketing',         'Marketing Manager',   '2022-09-10', '505 Birch Ln, Phoenix',        'male',   'full_time', 'active'),
(6,  'EMP006', '9800000006', 'Finance',           'Financial Analyst',   '2023-01-05', '606 Cedar St, Philadelphia',   'female', 'full_time', 'active'),
(7,  'EMP007', '9800000007', 'Engineering',       'DevOps Engineer',     '2023-03-22', '707 Maple Ave, San Antonio',   'male',   'full_time', 'active'),
(8,  'EMP008', '9800000008', 'HR',                'HR Executive',        '2023-06-14', '808 Walnut Dr, San Diego',     'female', 'full_time', 'active'),
(9,  'EMP009', '9800000009', 'Sales',             'Sales Executive',     '2023-08-01', '909 Cherry Ct, Dallas',        'male',   'full_time', 'active'),
(10, 'EMP010', '9800000010', 'Engineering',       'QA Engineer',         '2024-01-10', '1010 Spruce Way, San Jose',    'female', 'full_time', 'active');

-- ============================================================
-- SALARY
-- ============================================================
INSERT INTO salary (user_id, basic_salary, hra, transport_allowance, medical_allowance, other_allowances, pf_deduction, tax_deduction, other_deductions, bonus, effective_from) VALUES
(1,  80000, 32000, 5000, 3000, 5000, 9600,  8000, 2000, 10000, '2022-01-01'),
(2,  90000, 36000, 5000, 3000, 6000, 10800, 9000, 2000, 15000, '2022-03-15'),
(3,  75000, 30000, 5000, 3000, 5000, 9000,  7500, 2000, 10000, '2022-05-20'),
(4,  70000, 28000, 5000, 3000, 4000, 8400,  7000, 2000, 8000,  '2022-07-01'),
(5,  85000, 34000, 5000, 3000, 6000, 10200, 8500, 2000, 12000, '2022-09-10'),
(6,  72000, 28800, 5000, 3000, 4000, 8640,  7200, 2000, 9000,  '2023-01-05'),
(7,  88000, 35200, 5000, 3000, 6000, 10560, 8800, 2000, 13000, '2023-03-22'),
(8,  65000, 26000, 4000, 3000, 3000, 7800,  6500, 1500, 7000,  '2023-06-14'),
(9,  60000, 24000, 4000, 3000, 3000, 7200,  6000, 1500, 6000,  '2023-08-01'),
(10, 70000, 28000, 4000, 3000, 4000, 8400,  7000, 1500, 8000,  '2024-01-10');

-- ============================================================
-- HOLIDAYS 2024-2026
-- ============================================================
INSERT INTO holidays (name, date, type) VALUES
('New Year Day',          '2026-01-01', 'national'),
('Republic Day',          '2026-01-26', 'national'),
('Holi',                  '2026-03-25', 'national'),
('Good Friday',           '2026-04-10', 'national'),
('Labor Day',             '2026-05-01', 'national'),
('Independence Day',      '2026-08-15', 'national'),
('Gandhi Jayanti',        '2026-10-02', 'national'),
('Dussehra',              '2026-10-12', 'national'),
('Diwali',                '2026-11-01', 'national'),
('Christmas Day',         '2026-12-25', 'national');

-- ============================================================
-- LEAVE REQUESTS (sample)
-- ============================================================
INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, total_days, reason, status, approved_by, approved_at) VALUES
(2, 'casual',  '2026-06-15', '2026-06-16', 2, 'Personal work',            'approved', 1, '2026-06-14 10:00:00'),
(3, 'sick',    '2026-06-20', '2026-06-21', 2, 'Fever and cold',           'approved', 1, '2026-06-19 09:00:00'),
(4, 'paid',    '2026-07-01', '2026-07-05', 5, 'Planned vacation',         'pending',  NULL, NULL),
(5, 'casual',  '2026-07-10', '2026-07-10', 1, 'Family function',          'rejected', 1, '2026-07-09 11:00:00'),
(6, 'sick',    '2026-07-03', '2026-07-04', 2, 'Medical appointment',      'pending',  NULL, NULL),
(7, 'paid',    '2026-07-20', '2026-07-25', 6, 'Annual vacation',          'approved', 1, '2026-07-18 14:00:00'),
(8, 'unpaid',  '2026-06-25', '2026-06-26', 2, 'Emergency family matter',  'approved', 1, '2026-06-24 10:00:00');

-- ============================================================
-- ATTENDANCE (last 7 days sample — adjust dates as needed)
-- ============================================================
INSERT INTO attendance (user_id, date, check_in, check_out, status, work_hours) VALUES
(2, CURDATE() - INTERVAL 6 DAY, '09:02:00', '17:58:00', 'present', 8.93),
(2, CURDATE() - INTERVAL 5 DAY, '08:55:00', '18:05:00', 'present', 9.17),
(2, CURDATE() - INTERVAL 4 DAY, '09:10:00', '17:45:00', 'present', 8.58),
(2, CURDATE() - INTERVAL 3 DAY, '09:00:00', '14:00:00', 'half_day', 5.00),
(2, CURDATE() - INTERVAL 2 DAY, NULL, NULL, 'absent', 0),
(2, CURDATE() - INTERVAL 1 DAY, '09:05:00', '17:55:00', 'present', 8.83),
(3, CURDATE() - INTERVAL 6 DAY, '09:15:00', '18:00:00', 'present', 8.75),
(3, CURDATE() - INTERVAL 5 DAY, '09:00:00', '17:30:00', 'present', 8.50),
(3, CURDATE() - INTERVAL 4 DAY, '09:20:00', '18:10:00', 'present', 8.83),
(3, CURDATE() - INTERVAL 3 DAY, '09:00:00', '18:00:00', 'present', 9.00),
(3, CURDATE() - INTERVAL 2 DAY, '08:50:00', '17:50:00', 'present', 9.00),
(3, CURDATE() - INTERVAL 1 DAY, NULL, NULL, 'absent', 0),
(4, CURDATE() - INTERVAL 6 DAY, '09:30:00', '17:30:00', 'present', 8.00),
(4, CURDATE() - INTERVAL 5 DAY, NULL, NULL, 'absent', 0),
(4, CURDATE() - INTERVAL 4 DAY, '09:00:00', '18:00:00', 'present', 9.00),
(4, CURDATE() - INTERVAL 3 DAY, '09:00:00', '18:00:00', 'present', 9.00),
(4, CURDATE() - INTERVAL 2 DAY, '09:10:00', '18:05:00', 'present', 8.92),
(4, CURDATE() - INTERVAL 1 DAY, '09:00:00', '18:00:00', 'present', 9.00);

-- ============================================================
-- NOTIFICATIONS (sample)
-- ============================================================
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'Leave Approved',       'Your casual leave request for Jun 15-16 has been approved.', 'success', 0),
(3, 'Leave Approved',       'Your sick leave for Jun 20-21 has been approved.', 'success', 1),
(4, 'Leave Pending',        'Your leave request is pending admin approval.', 'info', 0),
(5, 'Leave Rejected',       'Your casual leave for Jul 10 was rejected. Please contact HR.', 'error', 0),
(2, 'Salary Credited',      'Your June salary has been processed successfully.', 'success', 0),
(1, 'New Leave Request',    'Employee Carol Williams applied for 5 days paid leave.', 'info', 0),
(1, 'New Leave Request',    'Employee Iris Wilson applied for 2 days sick leave.', 'info', 0);

-- ============================================================
-- ACTIVITY LOG (sample)
-- ============================================================
INSERT INTO activity_log (user_id, action, description) VALUES
(2, 'check_in',    'Alice checked in at 09:02 AM'),
(2, 'check_out',   'Alice checked out at 05:58 PM'),
(3, 'leave_apply', 'Bob applied for sick leave'),
(1, 'leave_approve', 'Admin approved Alice''s casual leave'),
(4, 'profile_update', 'Carol updated her profile information'),
(5, 'check_in',    'David checked in at 09:00 AM');
