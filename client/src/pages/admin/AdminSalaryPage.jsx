import { useEffect, useState } from 'react';
import { salaryService, employeeService } from '../../services';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiSearchLine, RiMoneyDollarCircleLine, RiEditLine, RiPlayLine } from 'react-icons/ri';

const AdminSalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [totals, setTotals] = useState({});
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [payrollModal, setPayrollModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const { register: regPayroll, handleSubmit: handlePayroll } = useForm({
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    }
  });

  useEffect(() => {
    employeeService.getDepartments().then(r => setDepartments(r.data.data || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSalaries(), 300);
    return () => clearTimeout(t);
  }, [search, department]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const { data } = await salaryService.getAll({ search, department });
      setSalaries(data.data.salaries || []);
      setTotals(data.data.totals || {});
    } catch {}
    setLoading(false);
  };

  const openEdit = (emp) => {
    setSelectedEmp(emp);
    reset(emp);
    setEditModal(true);
  };

  const onSaveSalary = async (data) => {
    setSaving(true);
    try {
      await salaryService.update(selectedEmp.user_id, data);
      toast.success('Salary updated!');
      setEditModal(false);
      fetchSalaries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const onProcessPayroll = async (data) => {
    setSaving(true);
    try {
      await salaryService.processPayroll(data);
      toast.success(`Payroll for ${data.month}/${data.year} processed!`);
      setPayrollModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const fmt = (val) => val ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title text-2xl">Payroll Management</h1>
          <p className="text-sm text-gray-400">Manage employee salaries and process payroll</p>
        </div>
        <button onClick={() => setPayrollModal(true)} className="btn-primary">
          <RiPlayLine /> Process Payroll
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Monthly Payroll', value: fmt(totals.total_payroll), color: 'text-primary-600' },
          { label: 'Average Salary',        value: fmt(totals.avg_salary),    color: 'text-success-600' },
          { label: 'Employees on Payroll',  value: totals.count || 0,         color: 'text-indigo-600' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
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
        <select value={department} onChange={e => setDepartment(e.target.value)} className="input-field w-40">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.department} value={d.department}>{d.department}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? <SkeletonTable rows={8} cols={6} /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar ? `http://localhost:5000${s.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || 'E')}&background=4338ca&color=fff&bold=true`}
                        className="w-8 h-8 rounded-lg object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.employee_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-500">{s.department}</td>
                  <td>{fmt(s.basic_salary)}</td>
                  <td>{fmt(s.gross_salary)}</td>
                  <td className="text-danger-500">
                    -{fmt((Number(s.pf_deduction) + Number(s.tax_deduction) + Number(s.other_deductions)).toFixed(0))}
                  </td>
                  <td className="font-bold text-primary-600">{fmt(s.net_salary)}</td>
                  <td>
                    <button onClick={() => openEdit(s)} className="btn-icon text-primary-600">
                      <RiEditLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Salary Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={`Edit Salary — ${selectedEmp?.name}`}
        size="lg"
        footer={
          <>
            <button onClick={() => setEditModal(false)} className="btn-secondary">Cancel</button>
            <button form="salary-edit-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <form id="salary-edit-form" onSubmit={handleSubmit(onSaveSalary)} className="grid grid-cols-2 gap-4">
          {[
            ['basic_salary', 'Basic Salary'],
            ['hra', 'HRA'],
            ['transport_allowance', 'Transport Allowance'],
            ['medical_allowance', 'Medical Allowance'],
            ['other_allowances', 'Other Allowances'],
            ['bonus', 'Bonus'],
            ['pf_deduction', 'PF Deduction'],
            ['tax_deduction', 'Tax Deduction'],
            ['other_deductions', 'Other Deductions'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="input-label">{label}</label>
              <input type="number" step="0.01" className="input-field" {...register(name)} />
            </div>
          ))}
          <div>
            <label className="input-label">Effective From</label>
            <input type="date" className="input-field" {...register('effective_from')} />
          </div>
        </form>
      </Modal>

      {/* Process Payroll Modal */}
      <Modal
        isOpen={payrollModal}
        onClose={() => setPayrollModal(false)}
        title="Process Monthly Payroll"
        footer={
          <>
            <button onClick={() => setPayrollModal(false)} className="btn-secondary">Cancel</button>
            <button form="payroll-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Processing...' : 'Process Payroll'}
            </button>
          </>
        }
      >
        <form id="payroll-form" onSubmit={handlePayroll(onProcessPayroll)} className="space-y-4">
          <p className="text-sm text-gray-500">This will process salary for all active employees and send notifications.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Month</label>
              <select className="input-field" {...regPayroll('month')}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Year</label>
              <select className="input-field" {...regPayroll('year')}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-xl text-xs text-warning-700 dark:text-warning-300">
            ⚠️ This action will mark salaries as paid and notify all employees. Proceed with caution.
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSalaryPage;
