import { useEffect, useState } from 'react';
import { attendanceService, employeeService } from '../../services';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { RiSearchLine, RiCalendarCheckLine, RiDownloadLine } from 'react-icons/ri';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const statusColor = {
  present:  'badge-success',
  absent:   'badge-danger',
  half_day: 'badge-warning',
  leave:    'badge-primary',
  holiday:  'badge-gray',
};

const AdminAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');

  useEffect(() => {
    employeeService.getDepartments().then(r => setDepartments(r.data.data || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchAttendance(), 300);
    return () => clearTimeout(t);
  }, [date, search, department]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await attendanceService.getAll({ date, search, department });
      const d = data.data;
      setRecords(d.records || []);
      setSummary(d.summary || {});
    } catch {}
    setLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Attendance Report — ${date}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Present: ${summary.present || 0}  Absent: ${summary.absent || 0}  Half Day: ${summary.halfDay || 0}  Leave: ${summary.leave || 0}`, 14, 30);
    let y = 42;
    doc.setFont(undefined, 'bold');
    ['Name', 'Dept', 'Check In', 'Check Out', 'Hours', 'Status'].forEach((h, i) => doc.text(h, 14 + i * 30, y));
    doc.setFont(undefined, 'normal');
    y += 6;
    doc.line(14, y, 195, y);
    y += 4;
    records.forEach(r => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(r.name || '—', 14, y);
      doc.text(r.department || '—', 44, y);
      doc.text(r.check_in ? r.check_in.slice(0,5) : '-', 74, y);
      doc.text(r.check_out ? r.check_out.slice(0,5) : '-', 104, y);
      doc.text(r.work_hours ? `${parseFloat(r.work_hours).toFixed(1)}h` : '-', 134, y);
      doc.text(r.status || '-', 164, y);
      y += 6;
    });
    doc.save(`attendance_${date}.pdf`);
    toast.success('PDF downloaded!');
  };

  const filtered = records.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.employee_id?.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title text-2xl">Attendance Management</h1>
          <p className="text-sm text-gray-400">Daily attendance overview</p>
        </div>
        <button onClick={exportPDF} className="btn-secondary">
          <RiDownloadLine /> Export PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Present',   value: summary.present  || 0, color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Absent',    value: summary.absent   || 0, color: 'text-danger-500',  bg: 'bg-danger-50' },
          { label: 'Half Day',  value: summary.halfDay  || 0, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'On Leave',  value: summary.leave    || 0, color: 'text-primary-600', bg: 'bg-primary-50' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="input-field w-44"
        />
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
        {loading ? <SkeletonTable rows={10} cols={6} /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={RiCalendarCheckLine} title="No records" description="No attendance data for this date." />
                </td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id || i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={r.avatar ? `http://localhost:5000${r.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name || 'E')}&background=4338ca&color=fff&bold=true&size=40`}
                        className="w-8 h-8 rounded-lg object-cover"
                        alt=""
                      />
                      <span className="font-medium text-sm">{r.name}</span>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">{r.employee_id}</span></td>
                  <td className="text-gray-500">{r.department}</td>
                  <td className="font-medium text-success-600">{r.check_in ? r.check_in.slice(0,5) : '—'}</td>
                  <td className="font-medium text-danger-500">{r.check_out ? r.check_out.slice(0,5) : '—'}</td>
                  <td>{r.work_hours > 0 ? `${parseFloat(r.work_hours).toFixed(1)}h` : '—'}</td>
                  <td><span className={statusColor[r.status] || 'badge-gray'}>{r.status?.replace('_', ' ') || 'absent'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAttendancePage;
