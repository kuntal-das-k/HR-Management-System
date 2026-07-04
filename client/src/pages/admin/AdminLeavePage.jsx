import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leaveService, employeeService } from '../../services';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { RiSearchLine, RiFileTextLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';

const statusConfig = {
  pending:  { badge: 'badge-warning', label: 'Pending' },
  approved: { badge: 'badge-success', label: 'Approved' },
  rejected: { badge: 'badge-danger',  label: 'Rejected' },
};

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [actionModal, setActionModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    employeeService.getDepartments().then(r => setDepartments(r.data.data || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchLeaves(1), 300);
    return () => clearTimeout(t);
  }, [filterStatus, search, department]);

  const fetchLeaves = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await leaveService.getAll({ status: filterStatus || undefined, search, department, page, limit: 20 });
      setLeaves(data.data || []);
      setPagination(data.pagination || pagination);
    } catch {}
    setLoading(false);
  };

  const openAction = (leave, action) => {
    setSelectedLeave({ ...leave, action });
    reset({ status: action });
    setActionModal(true);
  };

  const onAction = async (data) => {
    setSaving(true);
    try {
      await leaveService.updateStatus(selectedLeave.id, { status: selectedLeave.action, admin_comment: data.admin_comment });
      toast.success(`Leave ${selectedLeave.action}!`);
      setActionModal(false);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">Leave Requests</h1>
        <p className="text-sm text-gray-400">Manage all employee leave requests</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-36">
          <option value="">All Status</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={department} onChange={e => setDepartment(e.target.value)} className="input-field w-40">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.department} value={d.department}>{d.department}</option>)}
        </select>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Rejected', value: leaves.filter(l => l.status === 'rejected').length, color: 'text-danger-500', bg: 'bg-danger-50' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? <SkeletonTable rows={8} cols={7} /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={RiFileTextLine} title="No leave requests" description="No requests match your current filters." />
                </td></tr>
              ) : leaves.map(leave => (
                <tr key={leave.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={leave.avatar ? `http://localhost:5000${leave.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(leave.employee_name || 'E')}&background=4338ca&color=fff&bold=true`}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{leave.employee_name}</p>
                        <p className="text-xs text-gray-400">{leave.department}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="capitalize font-medium">{leave.leave_type}</span></td>
                  <td className="text-sm text-gray-500">
                    {new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td><span className="font-semibold">{leave.total_days}d</span></td>
                  <td className="max-w-xs">
                    <p className="text-sm text-gray-500 truncate">{leave.reason}</p>
                    {leave.admin_comment && <p className="text-xs text-gray-400 italic mt-0.5">"{leave.admin_comment}"</p>}
                  </td>
                  <td>
                    <span className={statusConfig[leave.status]?.badge || 'badge-gray'}>
                      {statusConfig[leave.status]?.label || leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === 'pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openAction(leave, 'approved')}
                          className="btn-icon text-success-600 hover:bg-success-50"
                          title="Approve"
                        >
                          <RiCheckLine />
                        </button>
                        <button
                          onClick={() => openAction(leave, 'rejected')}
                          className="btn-icon text-danger-500 hover:bg-danger-50"
                          title="Reject"
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={actionModal}
        onClose={() => setActionModal(false)}
        title={`${selectedLeave?.action === 'approved' ? '✅ Approve' : '❌ Reject'} Leave Request`}
        footer={
          <>
            <button onClick={() => setActionModal(false)} className="btn-secondary">Cancel</button>
            <button
              form="action-form"
              type="submit"
              disabled={saving}
              className={selectedLeave?.action === 'approved' ? 'btn-success' : 'btn-danger'}
            >
              {saving ? 'Processing...' : (selectedLeave?.action === 'approved' ? 'Approve' : 'Reject')}
            </button>
          </>
        }
      >
        {selectedLeave && (
          <form id="action-form" onSubmit={handleSubmit(onAction)} className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <p className="font-semibold text-gray-700 dark:text-gray-200">{selectedLeave.employee_name}</p>
              <p className="text-sm text-gray-500 mt-0.5 capitalize">
                {selectedLeave.leave_type} leave · {selectedLeave.total_days} days ·{' '}
                {new Date(selectedLeave.start_date).toLocaleDateString()} – {new Date(selectedLeave.end_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">"{selectedLeave.reason}"</p>
            </div>
            <div>
              <label className="input-label">Comment (optional)</label>
              <textarea
                rows={3}
                placeholder="Add a comment for the employee..."
                className="input-field resize-none"
                {...register('admin_comment')}
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminLeavePage;
