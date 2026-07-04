import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiBriefcaseLine, RiArrowLeftLine, RiHome2Line } from 'react-icons/ri';

const NotFoundPage = () => (
  <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {/* Large 404 */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <span className="text-[120px] font-display font-bold text-gradient leading-none select-none">404</span>
      </motion.div>

      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center mx-auto mb-6 shadow-glow">
        <RiBriefcaseLine className="text-white text-3xl" />
      </div>

      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => window.history.back()} className="btn-secondary">
          <RiArrowLeftLine /> Go Back
        </button>
        <Link to="/" className="btn-primary">
          <RiHome2Line /> Home
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
