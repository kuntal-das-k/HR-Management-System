# 🏢 HR Management System (HRmanager)

A full-stack Human Resource Management System built with **React + Vite** (frontend) and **Node.js + Express + MySQL** (backend).

## 📁 Project Structure

```
HR Management System/
├── client/          # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & Theme context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components (admin, employee, public)
│   │   └── services/     # API service layer (Axios)
│   └── ...
├── server/          # Express backend
│   ├── config/      # Database & JWT config + SQL schema
│   ├── controllers/ # Route handlers
│   ├── middlewares/  # Auth, role, upload, error middlewares
│   ├── routes/      # Express route definitions
│   ├── utils/       # Response utilities
│   └── uploads/     # Avatar uploads directory
└── README.md
```

## ✨ Features

- **Authentication**: JWT-based login/register with role-based access (Admin/Employee)
- **Employee Management**: CRUD operations, avatar upload, department management
- **Attendance Tracking**: Check-in/out, QR code attendance, calendar view, PDF export
- **Leave Management**: Apply, approve/reject, leave balance tracking
- **Salary & Payroll**: Salary breakdown, payslip PDF download, payroll processing
- **Dashboard**: Admin analytics with charts, activity timeline, notifications
- **Dark Mode**: Full dark/light theme toggle
- **Responsive**: Mobile-friendly layout with collapsible sidebar

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MySQL** (v8+)
- **npm**

### 1. Database Setup

```bash
# Connect to MySQL and run the schema
mysql -u root -p < server/config/database.sql

# (Optional) Seed with sample data
mysql -u root -p hrms_db < server/config/seed.sql
```

### 2. Server Setup

```bash
cd server

# Create your environment file
cp .env.example .env   # or create .env manually

# Install dependencies
npm install

# Start development server
npm run dev
```

**`.env` file (server)**:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hrms_db

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

### 3. Client Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## 🛠 Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend   | Node.js, Express 5                          |
| Database  | MySQL with mysql2 driver                    |
| Auth      | JWT (jsonwebtoken + bcryptjs)               |
| Charts    | Chart.js + react-chartjs-2                  |
| PDF       | jsPDF                                       |
| Calendar  | FullCalendar                                |
| Icons     | react-icons (Remix Icon set)                |

## 📋 API Endpoints

| Method | Endpoint                       | Auth     | Description              |
|--------|--------------------------------|----------|--------------------------|
| POST   | `/api/auth/register`           | Public   | Register new user        |
| POST   | `/api/auth/login`              | Public   | Login                    |
| GET    | `/api/auth/me`                 | User     | Get current user         |
| PUT    | `/api/auth/change-password`    | User     | Change password          |
| GET    | `/api/employees`               | Admin    | List all employees       |
| GET    | `/api/employees/:id`           | User     | Get employee details     |
| PUT    | `/api/employees/:id`           | User     | Update employee profile  |
| POST   | `/api/employees/:id/avatar`    | User     | Upload avatar            |
| DELETE | `/api/employees/:id`           | Admin    | Deactivate employee      |
| POST   | `/api/attendance/checkin`      | User     | Check in                 |
| POST   | `/api/attendance/checkout`     | User     | Check out                |
| GET    | `/api/attendance/today`        | User     | Today's status           |
| GET    | `/api/attendance/my`           | User     | My attendance history    |
| GET    | `/api/attendance/all`          | Admin    | All attendance records   |
| POST   | `/api/leave`                   | User     | Apply for leave          |
| GET    | `/api/leave/my`                | User     | My leave requests        |
| GET    | `/api/leave`                   | Admin    | All leave requests       |
| PUT    | `/api/leave/:id`               | Admin    | Approve/reject leave     |
| GET    | `/api/salary/my`               | User     | My salary details        |
| GET    | `/api/salary`                  | Admin    | All salaries             |
| PUT    | `/api/salary/:userId`          | Admin    | Update salary            |
| POST   | `/api/salary/process`          | Admin    | Process monthly payroll  |
| GET    | `/api/dashboard/admin`         | Admin    | Admin dashboard data     |
| GET    | `/api/dashboard/employee`      | User     | Employee dashboard data  |

## 📄 License

ISC
