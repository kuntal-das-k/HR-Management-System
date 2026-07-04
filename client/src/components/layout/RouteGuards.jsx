import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Show spinner while auth is loading
const LoadingSpinner = () => (
  <div className="min-h-screen bg-mesh flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center animate-pulse">
        <svg className="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p className="text-sm text-gray-400 font-medium">Loading HRMSPro...</p>
    </div>
  </div>
);

// Require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children || <Outlet />;
};

// Require admin role
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children || <Outlet />;
};

// Redirect authenticated users away from auth pages
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  return children || <Outlet />;
};
