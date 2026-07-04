import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative w-full ${sizeMap[size]} glass-card shadow-glass-lg max-h-[90vh] flex flex-col z-10`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                <button onClick={onClose} className="btn-icon">
                  <RiCloseLine className="text-xl" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
