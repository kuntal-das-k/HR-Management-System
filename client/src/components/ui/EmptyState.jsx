import { motion } from 'framer-motion';
import { RiSearchLine } from 'react-icons/ri';

const EmptyState = ({
  icon: Icon = RiSearchLine,
  title = 'No data found',
  description = 'Nothing to show here yet.',
  action,
  actionLabel,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center mb-4">
      <Icon className="text-4xl text-primary-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
    <p className="text-sm text-gray-400 max-w-xs mb-6">{description}</p>
    {action && (
      <button onClick={action} className="btn-primary">
        {actionLabel || 'Add New'}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
