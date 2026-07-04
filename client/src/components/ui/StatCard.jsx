import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, trendLabel, suffix = '', prefix = '' }) => {
  const colorMap = {
    primary: {
      bg: 'from-primary-500 to-primary-600',
      light: 'bg-primary-50',
      text: 'text-primary-600',
      shadow: 'shadow-primary-200/50',
    },
    success: {
      bg: 'from-success-500 to-emerald-600',
      light: 'bg-success-50',
      text: 'text-success-600',
      shadow: 'shadow-success-200/50',
    },
    warning: {
      bg: 'from-warning-500 to-amber-600',
      light: 'bg-warning-50',
      text: 'text-warning-600',
      shadow: 'shadow-warning-200/50',
    },
    danger: {
      bg: 'from-danger-500 to-rose-600',
      light: 'bg-danger-50',
      text: 'text-danger-600',
      shadow: 'shadow-danger-200/50',
    },
    indigo: {
      bg: 'from-indigo-500 to-violet-600',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
      shadow: 'shadow-indigo-200/50',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
            >
              {value ?? '—'}
            </motion.span>
            {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
          </div>
          {(trend !== undefined) && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-success-600' : 'text-danger-500'}`}>
              <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
              {trendLabel && <span className="text-gray-400 font-normal">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg ${c.shadow} flex-shrink-0`}>
          {Icon && <Icon className="text-white text-2xl" />}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
