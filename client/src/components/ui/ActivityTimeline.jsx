import { motion, AnimatePresence } from 'framer-motion';
import { RiCheckLine, RiErrorWarningLine, RiInformationLine, RiCloseLine } from 'react-icons/ri';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
  check_in:      { color: 'text-success-600', bg: 'bg-success-100', icon: '🟢' },
  check_out:     { color: 'text-blue-600',    bg: 'bg-blue-100',    icon: '🔵' },
  leave_apply:   { color: 'text-warning-600', bg: 'bg-warning-100', icon: '📝' },
  leave_approve: { color: 'text-success-600', bg: 'bg-success-100', icon: '✅' },
  leave_reject:  { color: 'text-danger-500',  bg: 'bg-danger-100',  icon: '❌' },
  profile_update:{ color: 'text-primary-600', bg: 'bg-primary-100', icon: '👤' },
  salary_update: { color: 'text-indigo-600',  bg: 'bg-indigo-100',  icon: '💰' },
  login:         { color: 'text-gray-600',    bg: 'bg-gray-100',    icon: '🔑' },
  register:      { color: 'text-success-600', bg: 'bg-success-100', icon: '🎉' },
  default:       { color: 'text-gray-600',    bg: 'bg-gray-100',    icon: '📌' },
};

const ActivityTimeline = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return <p className="text-center text-gray-400 text-sm py-6">No recent activity</p>;
  }

  return (
    <div className="relative space-y-1">
      {/* Vertical line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary-200 via-gray-200 to-transparent dark:from-primary-800 dark:via-slate-700" />

      {activities.map((activity, i) => {
        const config = typeConfig[activity.action] || typeConfig.default;
        return (
          <motion.div
            key={activity.id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3 relative pl-1"
          >
            {/* Dot */}
            <div className={`relative z-10 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 text-sm shadow-sm`}>
              {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 glass-card px-3 py-2 mb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {activity.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                  {activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : ''}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
