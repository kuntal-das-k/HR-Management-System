import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiTeamLine, RiCalendarCheckLine,
  RiFileTextLine, RiMoneyDollarCircleLine, RiUserLine,
  RiLogoutBoxLine, RiBarChartBoxLine, RiSettings3Line,
  RiShieldLine, RiMenuLine, RiCloseLine
} from 'react-icons/ri';
import { useState } from 'react';
import logo from '../../assets/logo.png';

const adminLinks = [
  { to: '/admin/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/admin/employees', icon: RiTeamLine, label: 'Employees' },
  { to: '/admin/attendance', icon: RiCalendarCheckLine, label: 'Attendance' },
  { to: '/admin/leaves', icon: RiFileTextLine, label: 'Leave Requests' },
  { to: '/admin/salary', icon: RiMoneyDollarCircleLine, label: 'Payroll' },
];

const employeeLinks = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/attendance', icon: RiCalendarCheckLine, label: 'Attendance' },
  { to: '/leave', icon: RiFileTextLine, label: 'My Leaves' },
  { to: '/salary', icon: RiMoneyDollarCircleLine, label: 'My Salary' },
  { to: '/profile', icon: RiUserLine, label: 'Profile' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : employeeLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 72 },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-slate-800 h-20">
        <img src={logo} alt="HRMS Logo" className="w-auto h-8 flex-shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-bold text-xl leading-none text-gray-900 dark:text-white tracking-tight">HRmanager</span>
              <p className="text-xs text-gray-400 mt-1">
                {isAdmin ? 'Admin Panel' : 'Employee Portal'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="text-xl flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  {link.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-2 pb-4 border-t border-gray-100 dark:border-slate-800 pt-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 mb-2">
            <img
              src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4338ca&color=fff&bold=true`}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-danger-500 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-900/20 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <RiLogoutBoxLine className="text-xl flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
