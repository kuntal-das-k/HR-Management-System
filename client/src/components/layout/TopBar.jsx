import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dashboardService } from '../../services';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiMenuLine, RiSunLine, RiMoonLine, RiNotification3Line,
  RiSearchLine, RiCheckDoubleLine
} from 'react-icons/ri';
import { formatDistanceToNow } from 'date-fns';

const TopBar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await dashboardService.getNotifications();
      setNotifications(data.data || []);
      setUnread((data.data || []).filter(n => !n.is_read).length);
    } catch {}
  };

  const markRead = async () => {
    try {
      await dashboardService.markNotificationsRead();
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch {}
  };

  const notifTypeColors = {
    success: 'bg-success-100 text-success-600',
    error: 'bg-danger-100 text-danger-600',
    warning: 'bg-warning-100 text-warning-600',
    info: 'bg-primary-100 text-primary-600',
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 gap-4 sticky top-0 z-10">
      {/* Left: Toggle + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="btn-icon hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          <RiMenuLine className="text-xl" />
        </button>

        <div className="relative hidden sm:flex items-center">
          <RiSearchLine className="absolute left-3 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-800 border-none rounded-xl w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button onClick={toggleTheme} className="btn-icon">
          {isDark ? <RiSunLine className="text-xl text-warning-500" /> : <RiMoonLine className="text-xl" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(prev => !prev)}
            className="btn-icon relative"
          >
            <RiNotification3Line className="text-xl" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 glass-card overflow-hidden z-20 shadow-glass-lg"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Notifications</h3>
                    {unread > 0 && (
                      <button onClick={markRead} className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
                        <RiCheckDoubleLine />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-slate-700 last:border-0 ${!n.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notifTypeColors[n.type]?.split(' ')[0]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{n.title}</p>
                          <p className="text-xs text-gray-500 truncate-2 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <button
          onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <img
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4338ca&color=fff&bold=true&size=64`}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
