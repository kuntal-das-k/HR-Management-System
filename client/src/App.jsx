import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/layout/RouteGuards';
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Public pages
import FeaturesPage from './pages/public/FeaturesPage';
import SolutionsPage from './pages/public/SolutionsPage';
import ResourcesPage from './pages/public/ResourcesPage';
import AboutUsPage from './pages/public/AboutUsPage';
import PricingPage from './pages/public/PricingPage';

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import SalaryPage from './pages/SalaryPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeListPage from './pages/admin/EmployeeListPage';
import EmployeeDetailPage from './pages/admin/EmployeeDetailPage';
import AdminLeavePage from './pages/admin/AdminLeavePage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';
import AdminSalaryPage from './pages/admin/AdminSalaryPage';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            <Route element={<PublicRoute />}>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Employee routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard"  element={<EmployeeDashboard />} />
                <Route path="/profile"    element={<ProfilePage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/leave"      element={<LeavePage />} />
                <Route path="/salary"     element={<SalaryPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/admin/dashboard"         element={<AdminDashboard />} />
                <Route path="/admin/employees"         element={<EmployeeListPage />} />
                <Route path="/admin/employees/:id"     element={<EmployeeDetailPage />} />
                <Route path="/admin/leaves"            element={<AdminLeavePage />} />
                <Route path="/admin/attendance"        element={<AdminAttendancePage />} />
                <Route path="/admin/salary"            element={<AdminSalaryPage />} />
                {/* Admin can also view their own profile */}
                <Route path="/admin/profile"           element={<ProfilePage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
