import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { employeeService, leaveService, salaryService } from '../../services';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  RiSearchLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiTeamLine, RiFilterLine, RiEyeLine, RiMoreLine,
  RiUserLine
} from 'react-icons/ri';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [salaryModal, setSalaryModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [savingSalary, setSavingSalary] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    employeeService.getDepartments().then(r => setDepartments(r.data.data || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchEmployees(1), 300);
    return () => clearTimeout(timer);
  }, [search, department]);

  const fetchEmployees = async (page = pagination.page) => {
    setLoading(true);
    try {
      const { data } = await employeeService.getAll({ search, department, page, limit: pagination.limit });
      setEmployees(data.data || []);
      setPagination(data.pagination || pagination);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (emp) => {
    if (!confirm(`Deactivate ${emp.name}?`)) return;
    try {
      await employeeService.delete(emp.id);
      toast.success(`${emp.name} deactivated.`);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const openSalaryModal = (emp) => {
    setSelectedEmp(emp);
    setSalaryModal(true);
    // Fetch current salary to pre-fill
    salaryService.getByUser(emp.id).then(r => {
      if (r.data.data?.current) reset(r.data.data.current);
    }).catch(() => reset({}));
  };

  const onSaveSalary = async (data) => {
    setSavingSalary(true);
    try {
      await salaryService.update(selectedEmp.id, data);
      toast.success('Salary updated!');
      setSalaryModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSavingSalary(false); }
  };

  const statusColor = { active: 'badge-success', inactive: 'badge-danger', terminated: 'badge-danger' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title text-2xl">Employee Management</h1>
          <p className="text-sm text-gray-400">{pagination.total} total employees</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="input-field w-44"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.department} value={d.department}>{d.department} ({d.count})</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? <SkeletonTable rows={8} cols={6} /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={RiTeamLine} title="No employees found" description="Try adjusting your search or filters." />
                </td></tr>
              ) : employees.map(emp => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar ? `http://localhost:5000${emp.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=4338ca&color=fff&bold=true&size=40`}
                        alt={emp.name}
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">{emp.employee_id}</span></td>
                  <td>{emp.department || '—'}</td>
                  <td className="text-gray-500">{emp.designation || '—'}</td>
                  <td className="text-gray-500 text-xs">
                    {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <span className={statusColor[emp.status] || 'badge-gray'}>{emp.status || 'active'}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/employees/${emp.id}`)}
                        className="btn-icon text-primary-600"
                        title="View Details"
                      >
                        <RiEyeLine />
                      </button>
                      <button
                        onClick={() => openSalaryModal(emp)}
                        className="btn-icon text-success-600"
                        title="Edit Salary"
                      >
                        <span className="text-xs font-bold">₹</span>
                      </button>
                      <button
                        onClick={() => handleDelete(emp)}
                        className="btn-icon text-danger-500"
                        title="Deactivate"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).slice(
                Math.max(0, pagination.page - 3),
                Math.min(pagination.totalPages, pagination.page + 2)
              ).map(p => (
                <button
                  key={p}
                  onClick={() => fetchEmployees(p)}
                  className={`w-8 h-8 rounded-lg text-sm ${p === pagination.page ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Salary Edit Modal */}
      <Modal
        isOpen={salaryModal}
        onClose={() => setSalaryModal(false)}
        title={`Edit Salary — ${selectedEmp?.name}`}
        size="lg"
        footer={
          <>
            <button onClick={() => setSalaryModal(false)} className="btn-secondary">Cancel</button>
            <button form="salary-form" type="submit" disabled={savingSalary} className="btn-primary">
              {savingSalary ? 'Saving...' : 'Save Salary'}
            </button>
          </>
        }
      >
        <form id="salary-form" onSubmit={handleSubmit(onSaveSalary)} className="grid grid-cols-2 gap-4">
          {[
            { name: 'basic_salary',          label: 'Basic Salary' },
            { name: 'hra',                   label: 'HRA' },
            { name: 'transport_allowance',   label: 'Transport Allowance' },
            { name: 'medical_allowance',     label: 'Medical Allowance' },
            { name: 'other_allowances',      label: 'Other Allowances' },
            { name: 'bonus',                 label: 'Bonus' },
            { name: 'pf_deduction',          label: 'PF Deduction' },
            { name: 'tax_deduction',         label: 'Tax Deduction' },
            { name: 'other_deductions',      label: 'Other Deductions' },
          ].map(f => (
            <div key={f.name}>
              <label className="input-label">{f.label}</label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" {...register(f.name)} />
            </div>
          ))}
          <div>
            <label className="input-label">Effective From</label>
            <input type="date" className="input-field" {...register('effective_from')} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeListPage;
