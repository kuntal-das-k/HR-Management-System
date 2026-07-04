import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { salaryService } from '../services';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import jsPDF from 'jspdf';
import {
  RiMoneyDollarCircleLine, RiDownloadLine, RiArrowUpLine, RiArrowDownLine,
  RiPieChartLine, RiCalendarLine
} from 'react-icons/ri';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SalaryPage = () => {
  const { user } = useAuth();
  const [salary, setSalary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    try {
      const { data } = await salaryService.getMy();
      setSalary(data.data.current);
      setHistory(data.data.history || []);
    } catch {}
    setLoading(false);
  };

  const formatCurrency = (val) =>
    val ? `₹${Number(val).toLocaleString('en-IN')}` : '₹0';

  const breakdownData = salary ? {
    labels: ['Basic', 'HRA', 'Transport', 'Medical', 'Other', 'Bonus'],
    datasets: [{
      data: [
        salary.basic_salary, salary.hra, salary.transport_allowance,
        salary.medical_allowance, salary.other_allowances, salary.bonus
      ].map(Number),
      backgroundColor: ['#4f46e5','#3b82f6','#06b6d4','#10b981','#8b5cf6','#f59e0b'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  } : null;

  const historyChartData = history.length ? {
    labels: history.slice(0, 6).reverse().map(h => `${h.month}/${h.year}`),
    datasets: [{
      label: 'Net Salary',
      data: history.slice(0, 6).reverse().map(h => Number(h.net_salary)),
      backgroundColor: 'rgba(79,70,229,0.15)',
      borderColor: '#4f46e5',
      borderWidth: 2,
      borderRadius: 6,
    }],
  } : null;

  const downloadPayslip = () => {
    if (!salary) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('PAYSLIP', 14, 20);
    doc.setFontSize(11);
    doc.text(`Employee: ${user.name}`, 14, 32);
    doc.text(`Employee ID: ${user.employeeId || '—'}`, 14, 40);
    doc.text(`Department: ${user.department || '—'}`, 14, 48);
    doc.text(`Designation: ${user.designation || '—'}`, 14, 56);
    doc.line(14, 62, 195, 62);

    // Earnings
    doc.setFont(undefined, 'bold');
    doc.text('EARNINGS', 14, 72);
    doc.setFont(undefined, 'normal');
    const earnings = [
      ['Basic Salary', salary.basic_salary],
      ['HRA', salary.hra],
      ['Transport Allowance', salary.transport_allowance],
      ['Medical Allowance', salary.medical_allowance],
      ['Other Allowances', salary.other_allowances],
      ['Bonus', salary.bonus],
    ];
    let y = 80;
    earnings.forEach(([label, val]) => {
      doc.text(label, 14, y);
      doc.text(`Rs. ${Number(val).toLocaleString()}`, 140, y);
      y += 8;
    });
    doc.setFont(undefined, 'bold');
    doc.text('Gross Salary', 14, y);
    doc.text(`Rs. ${Number(salary.gross_salary).toLocaleString()}`, 140, y);
    y += 12;

    // Deductions
    doc.setFont(undefined, 'bold');
    doc.text('DEDUCTIONS', 14, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    const deductions = [
      ['PF Deduction', salary.pf_deduction],
      ['Tax Deduction', salary.tax_deduction],
      ['Other Deductions', salary.other_deductions],
    ];
    deductions.forEach(([label, val]) => {
      doc.text(label, 14, y);
      doc.text(`Rs. ${Number(val).toLocaleString()}`, 140, y);
      y += 8;
    });

    doc.line(14, y, 195, y);
    y += 6;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(13);
    doc.text('NET SALARY', 14, y);
    doc.text(`Rs. ${Number(salary.net_salary).toLocaleString()}`, 140, y);

    doc.save(`payslip_${user.name.replace(' ', '_')}.pdf`);
    toast.success('Payslip downloaded!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-64 rounded-2xl lg:col-span-2" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!salary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No salary information available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title text-2xl">My Salary</h1>
          <p className="text-sm text-gray-400">Effective from {new Date(salary.effective_from).toLocaleDateString()}</p>
        </div>
        <button onClick={downloadPayslip} className="btn-primary">
          <RiDownloadLine /> Download Payslip
        </button>
      </div>

      {/* Net Salary Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white shadow-glow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-1">
            <p className="text-white/70 text-sm mb-1">Net Salary</p>
            <p className="text-4xl font-display font-bold">{formatCurrency(salary.net_salary)}</p>
            <p className="text-white/60 text-xs mt-1">per month</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
            <p className="text-white/70 text-sm mb-1">Gross Salary</p>
            <p className="text-2xl font-bold">{formatCurrency(salary.gross_salary)}</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
            <p className="text-white/70 text-sm mb-1">Total Bonus</p>
            <p className="text-2xl font-bold">{formatCurrency(salary.bonus)}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Earnings Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Basic Salary',        value: salary.basic_salary,         type: 'earning' },
              { label: 'HRA',                  value: salary.hra,                  type: 'earning' },
              { label: 'Transport Allowance',  value: salary.transport_allowance,  type: 'earning' },
              { label: 'Medical Allowance',    value: salary.medical_allowance,    type: 'earning' },
              { label: 'Other Allowances',     value: salary.other_allowances,     type: 'earning' },
              { label: 'Bonus',                value: salary.bonus,                type: 'earning', highlight: true },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between py-2 px-3 rounded-xl ${item.highlight ? 'bg-warning-50 dark:bg-warning-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800'} transition-colors`}>
                <div className="flex items-center gap-2">
                  <RiArrowUpLine className="text-success-500 text-sm" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(item.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 px-3 bg-success-50 dark:bg-success-900/10 rounded-xl">
              <span className="font-bold text-success-700">Gross Total</span>
              <span className="font-bold text-success-700">{formatCurrency(salary.gross_salary)}</span>
            </div>
          </div>
        </div>

        {/* Deductions + Doughnut */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="section-title mb-4">Deductions</h2>
            <div className="space-y-3">
              {[
                { label: 'PF Deduction',    value: salary.pf_deduction },
                { label: 'Tax Deduction',   value: salary.tax_deduction },
                { label: 'Other',           value: salary.other_deductions },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <div className="flex items-center gap-2">
                    <RiArrowDownLine className="text-danger-500 text-sm" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-danger-500">-{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="glass-card p-5">
            <h2 className="section-title mb-3">Salary Composition</h2>
            <div className="h-44">
              {breakdownData && (
                <Doughnut data={breakdownData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { padding: 8, font: { size: 10 } } } },
                  cutout: '60%',
                }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Salary History */}
      {history.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Salary History</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48">
              {historyChartData && (
                <Bar data={historyChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.04)' } } },
                  borderRadius: 6,
                }} />
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Net Salary</th>
                    <th>Bonus</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td>{h.month}/{h.year}</td>
                      <td className="font-semibold">{formatCurrency(h.net_salary)}</td>
                      <td>{formatCurrency(h.bonus)}</td>
                      <td><span className={h.status === 'paid' ? 'badge-success' : 'badge-warning'}>{h.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPage;
