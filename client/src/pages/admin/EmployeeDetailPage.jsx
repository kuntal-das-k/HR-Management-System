import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { employeeService, attendanceService, leaveService } from '../../services';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  RiArrowLeftLine, RiEditLine, RiUserLine, RiMailLine,
  RiPhoneLine, RiBuildingLine, RiCalendarLine, RiMapPinLine,
  RiShieldLine, RiMoneyDollarCircleLine
} from 'react-icons/ri';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attStats, setAttStats] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [empRes, attRes, leaveRes] = await Promise.all([
        employeeService.getById(id),
        attendanceService.getStats({ userId: id }),
        leaveService.getMy({ userId: id }),
      ]);
      setEmployee(empRes.data.data);
      setAttStats(attRes.data.data);
      setLeaves(leaveRes.data.data?.leaves?.slice(0, 5) || []);
      reset(empRes.data.data);
    } catch {
      toast.error('Failed to load employee');
      navigate('/admin/employees');
    }
    setLoading(false);
  };

  const onSave = async (data) => {
    setSaving(true);
    try {
      await employeeService.update(id, data);
      toast.success('Employee updated!');
      setEditModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-48 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const avatarUrl = employee.avatar
    ? `http://localhost:5000${employee.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=4338ca&color=fff&bold=true&size=128`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/admin/employees')} className="btn-ghost text-sm">
          <RiArrowLeftLine /> Back to Employees
        </button>
        <button onClick={() => setEditModal(true)} className="btn-primary">
          <RiEditLine /> Edit Employee
        </button>
      </div>

      {/* Profile Header */}
      <div className="glass-card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary-600 to-secondary-600" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
            <img src={avatarUrl} alt={employee.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl" />
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{employee.name}</h1>
              <p className="text-gray-500">{employee.designation} · {employee.department}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-primary">{employee.employee_id}</span>
                <span className={`badge ${employee.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{employee.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {[
              { label: 'Email', icon: RiMailLine, value: employee.email },
              { label: 'Phone', icon: RiPhoneLine, value: employee.phone || '—' },
              { label: 'Joined', icon: RiCalendarLine, value: employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : '—' },
              { label: 'Type', icon: RiShieldLine, value: employee.employment_type?.replace('_', ' ') || '—' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <item.icon className="text-primary-600 text-base" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Stats */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Attendance (This Month)</h2>
          {attStats ? (
            <div className="space-y-3">
              {[
                { label: 'Present',    value: attStats.stats.present,   color: 'text-success-600', bg: 'bg-success-50' },
                { label: 'Absent',     value: attStats.stats.absent,    color: 'text-danger-500',  bg: 'bg-danger-50' },
                { label: 'Half Day',   value: attStats.stats.half_day,  color: 'text-warning-600', bg: 'bg-warning-50' },
                { label: 'Leave',      value: attStats.stats.leave,     color: 'text-primary-600', bg: 'bg-primary-50' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{s.label}</span>
                  <span className={`text-xl font-bold ${s.color}`}>{s.value || 0}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance Rate</span>
                  <span className="text-lg font-bold text-primary-600">{attStats.attendancePercent}%</span>
                </div>
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm">No data</p>}
        </div>

        {/* Recent Leaves */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Recent Leaves</h2>
          {leaves.length ? (
            <div className="space-y-2">
              {leaves.map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <div>
                    <p className="text-sm font-medium capitalize">{leave.leave_type}</p>
                    <p className="text-xs text-gray-400">{new Date(leave.start_date).toLocaleDateString()} · {leave.total_days}d</p>
                  </div>
                  <span className={`badge ${leave.status === 'approved' ? 'badge-success' : leave.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-6">No leave requests</p>}
        </div>

        {/* Salary Info */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Salary Information</h2>
          {employee.salary ? (
            <div className="space-y-3">
              {[
                { label: 'Basic Salary',  value: employee.salary.basic_salary },
                { label: 'Gross Salary',  value: employee.salary.gross_salary },
                { label: 'Net Salary',    value: employee.salary.net_salary, highlight: true },
                { label: 'Bonus',         value: employee.salary.bonus },
              ].map(s => (
                <div key={s.label} className={`flex justify-between items-center py-2 px-3 rounded-xl ${s.highlight ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <span className={`text-sm ${s.highlight ? 'font-bold text-primary-700 dark:text-primary-300' : 'text-gray-500'}`}>{s.label}</span>
                  <span className={`font-semibold ${s.highlight ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    ₹{Number(s.value || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-6">No salary record</p>}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Employee"
        size="lg"
        footer={
          <>
            <button onClick={() => setEditModal(false)} className="btn-secondary">Cancel</button>
            <button form="edit-emp-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-emp-form" onSubmit={handleSubmit(onSave)} className="grid grid-cols-2 gap-4">
          {[
            { name: 'name',         label: 'Full Name',      type: 'text' },
            { name: 'phone',        label: 'Phone',          type: 'tel' },
            { name: 'department',   label: 'Department',     type: 'text' },
            { name: 'designation',  label: 'Designation',    type: 'text' },
            { name: 'joining_date', label: 'Joining Date',   type: 'date' },
          ].map(f => (
            <div key={f.name}>
              <label className="input-label">{f.label}</label>
              <input type={f.type} className="input-field" {...register(f.name)} />
            </div>
          ))}
          <div>
            <label className="input-label">Status</label>
            <select className="input-field" {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div>
            <label className="input-label">Employment Type</label>
            <select className="input-field" {...register('employment_type')}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="input-label">Address</label>
            <textarea rows={2} className="input-field resize-none" {...register('address')} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeDetailPage;
