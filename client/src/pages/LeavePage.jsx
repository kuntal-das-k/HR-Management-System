import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { leaveService } from '../services';
import { useForm } from 'react-hook-form';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import {
  RiAddLine, RiFileTextLine, RiCheckLine, RiCloseLine,
  RiTimeLine, RiCalendarLine, RiInformationLine
} from 'react-icons/ri';

const statusConfig = {
  pending:  { badge: 'badge-warning',  icon: RiTimeLine,      label: 'Pending' },
  approved: { badge: 'badge-success',  icon: RiCheckLine,     label: 'Approved' },
  rejected: { badge: 'badge-danger',   icon: RiCloseLine,     label: 'Rejected' },
  cancelled:{ badge: 'badge-gray',     icon: RiCloseLine,     label: 'Cancelled' },
};

const leaveTypes = ['paid', 'sick', 'casual', 'unpaid', 'maternity', 'paternity'];
const leaveColors = { paid: '#4f46e5', sick: '#f43f5e', casual: '#10b981', unpaid: '#94a3b8', maternity: '#ec4899', paternity: '#3b82f6' };

const LeavePage = () => {
  const { user, isAdmin } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState({});
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const startDate = watch('start_date');

  useEffect(() => {
    fetchAll();
  }, [filterStatus]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [leavesRes, balanceRes] = await Promise.all([
        leaveService.getMy({ status: filterStatus || undefined }),
        leaveService.getBalance(),
      ]);
      setLeaves(leavesRes.data.data.leaves || []);
      setBalance(balanceRes.data.data || {});
    } catch {}
    setLoading(false);
  };

  const onApply = async (data) => {
    setSubmitting(true);
    try {
      await leaveService.apply(data);
      toast.success('✅ Leave application submitted!');
      setApplyModal(false);
      reset();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setSubmitting(false); }
  };

  const cancelLeave = async (id) => {
    if (!confirm('Cancel this leave request?')) return;
    try {
      await leaveService.cancel(id);
      toast.success('Leave cancelled');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title text-2xl">Leave Management</h1>
          <p className="text-sm text-gray-400">Apply for and track your leave requests</p>
        </div>
        <button onClick={() => setApplyModal(true)} className="btn-primary">
          <RiAddLine /> Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['paid', 'sick', 'casual', 'unpaid'].map(type => {
          const b = balance[type] || { total: 0, used: 0, remaining: 0 };
          return (
            <motion.div whileHover={{ y: -2 }} key={type} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide capitalize">{type} Leave</p>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: leaveColors[type] }} />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{b.remaining}</p>
              <p className="text-xs text-gray-400 mt-0.5">{b.used} used of {b.total}</p>
              <div className="progress-bar h-1.5 mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.total > 0 ? (b.remaining / b.total) * 100 : 0}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: leaveColors[type] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter + Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700 flex-wrap gap-3">
          <h2 className="section-title">My Leave Requests</h2>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input-field w-36"
          >
            <option value="">All Status</option>
            {Object.keys(statusConfig).map(s => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(7).fill(0).map((_, j) => <td key={j}><div className="skeleton h-4 rounded w-20" /></td>)}</tr>
              ))
            ) : leaves.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon={RiFileTextLine} title="No leave requests" description="You haven't applied for any leave yet." action={() => setApplyModal(true)} actionLabel="Apply for Leave" /></td></tr>
            ) : (
              leaves.map(leave => {
                const config = statusConfig[leave.status] || statusConfig.pending;
                return (
                  <tr key={leave.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: leaveColors[leave.leave_type] }} />
                        <span className="font-medium capitalize">{leave.leave_type}</span>
                      </div>
                    </td>
                    <td>{new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td>{new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><span className="font-semibold">{leave.total_days}</span></td>
                    <td className="max-w-xs truncate text-gray-500">{leave.reason}</td>
                    <td>
                      <span className={config.badge}>
                        {config.label}
                      </span>
                      {leave.admin_comment && (
                        <p className="text-xs text-gray-400 mt-1 italic">"{leave.admin_comment}"</p>
                      )}
                    </td>
                    <td>
                      {leave.status === 'pending' && (
                        <button onClick={() => cancelLeave(leave.id)} className="text-xs text-danger-500 hover:text-danger-700 font-medium">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyModal}
        onClose={() => { setApplyModal(false); reset(); }}
        title="Apply for Leave"
        footer={
          <>
            <button onClick={() => { setApplyModal(false); reset(); }} className="btn-secondary">Cancel</button>
            <button form="leave-form" type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </>
        }
      >
        <form id="leave-form" onSubmit={handleSubmit(onApply)} className="space-y-4">
          <div>
            <label className="input-label">Leave Type</label>
            <select className="input-field" {...register('leave_type', { required: 'Select a leave type' })}>
              <option value="">Select type</option>
              {leaveTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)} Leave</option>)}
            </select>
            {errors.leave_type && <p className="input-error">{errors.leave_type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Start Date</label>
              <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} {...register('start_date', { required: 'Start date required' })} />
              {errors.start_date && <p className="input-error">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="input-label">End Date</label>
              <input type="date" className="input-field" min={startDate || new Date().toISOString().split('T')[0]} {...register('end_date', { required: 'End date required' })} />
              {errors.end_date && <p className="input-error">{errors.end_date.message}</p>}
            </div>
          </div>

          <div>
            <label className="input-label">Reason</label>
            <textarea
              rows={3}
              placeholder="Brief description of reason..."
              className="input-field resize-none"
              {...register('reason', { required: 'Reason is required', minLength: { value: 5, message: 'Minimum 5 characters' } })}
            />
            {errors.reason && <p className="input-error">{errors.reason.message}</p>}
          </div>

          <div className="flex items-start gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-xs text-primary-700 dark:text-primary-300">
            <RiInformationLine className="mt-0.5 flex-shrink-0" />
            <p>Weekends are automatically excluded from leave count. Your request will be reviewed within 1-2 business days.</p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeavePage;
