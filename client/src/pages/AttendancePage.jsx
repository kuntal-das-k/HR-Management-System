import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import jsPDF from 'jspdf';
import {
  RiLoginBoxLine, RiLogoutBoxLine, RiCalendar2Line,
  RiDownloadLine, RiQrCodeLine, RiTimeLine, RiCheckLine
} from 'react-icons/ri';

const statusColor = {
  present:  { badge: 'badge-success',  dot: '#22c55e' },
  absent:   { badge: 'badge-danger',   dot: '#f43f5e' },
  half_day: { badge: 'badge-warning',  dot: '#f59e0b' },
  leave:    { badge: 'badge-primary',  dot: '#4f46e5' },
  holiday:  { badge: 'badge-gray',     dot: '#94a3b8' },
};

const AttendancePage = () => {
  const { user, isAdmin } = useAuth();
  const [todayAtt, setTodayAtt] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const [view, setView] = useState('list'); // list | calendar
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAll();
  }, [month, year]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [todayRes, myRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getMy({ month, year }),
      ]);
      setTodayAtt(todayRes.data.data);
      setRecords(myRes.data.data.records || []);
      setSummary(myRes.data.data.summary || {});
    } catch {}
    setLoading(false);
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceService.checkIn();
      toast.success('✅ Checked in!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally { setCheckingIn(false); }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      await attendanceService.checkOut();
      toast.success('👋 Checked out!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    } finally { setCheckingOut(false); }
  };

  const handleQR = async () => {
    try {
      const { data } = await attendanceService.generateQR();
      setQrData(data.data.qr || JSON.stringify({ userId: user.id, date: new Date().toISOString().split('T')[0] }));
      setQrModal(true);
    } catch { toast.error('Failed to generate QR'); }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Attendance Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Employee: ${user.name}  |  Month: ${month}/${year}`, 14, 30);
    doc.text(`Present: ${summary.present || 0}  Absent: ${summary.absent || 0}  Half Day: ${summary.halfDay || 0}  Leave: ${summary.leave || 0}`, 14, 38);

    let y = 50;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Date', 14, y);
    doc.text('Check In', 60, y);
    doc.text('Check Out', 100, y);
    doc.text('Hours', 140, y);
    doc.text('Status', 165, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    doc.line(14, y, 195, y);
    y += 4;

    records.forEach(r => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(new Date(r.date).toLocaleDateString(), 14, y);
      doc.text(r.check_in ? r.check_in.slice(0,5) : '-', 60, y);
      doc.text(r.check_out ? r.check_out.slice(0,5) : '-', 100, y);
      doc.text(r.work_hours ? `${parseFloat(r.work_hours).toFixed(1)}h` : '-', 140, y);
      doc.text(r.status || '-', 165, y);
      y += 6;
    });

    doc.save(`attendance_${user.name.replace(' ', '_')}_${month}_${year}.pdf`);
    toast.success('PDF downloaded!');
  };

  // Calendar events
  const calendarEvents = records.map(r => ({
    date: r.date,
    title: r.status?.replace('_', ' ') || 'absent',
    backgroundColor: statusColor[r.status]?.dot || '#94a3b8',
    borderColor: 'transparent',
    textColor: '#fff',
  }));

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title text-2xl">Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track your daily attendance</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleQR} className="btn-secondary text-sm">
            <RiQrCodeLine /> QR Code
          </button>
          <button onClick={exportPDF} className="btn-secondary text-sm">
            <RiDownloadLine /> Export PDF
          </button>
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 font-semibold' : 'text-gray-500'}`}>List</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 text-sm rounded-lg transition-all ${view === 'calendar' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 font-semibold' : 'text-gray-500'}`}>Calendar</button>
          </div>
        </div>
      </div>

      {/* Today Card */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <div className="flex items-center gap-3">
              {todayAtt?.check_in ? (
                <>
                  <div className="flex items-center gap-1.5 text-success-600 text-sm font-semibold">
                    <RiTimeLine /> In: {todayAtt.check_in.slice(0,5)}
                  </div>
                  {todayAtt?.check_out && (
                    <div className="flex items-center gap-1.5 text-danger-500 text-sm font-semibold">
                      <RiTimeLine /> Out: {todayAtt.check_out.slice(0,5)}
                    </div>
                  )}
                  {todayAtt?.work_hours > 0 && (
                    <span className="badge-primary">{parseFloat(todayAtt.work_hours).toFixed(1)}h worked</span>
                  )}
                </>
              ) : (
                <span className="text-gray-400 text-sm">Not checked in yet</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCheckIn}
              disabled={!!todayAtt?.check_in || checkingIn}
              className={`btn-success ${todayAtt?.check_in ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <RiLoginBoxLine />
              {checkingIn ? 'Checking in...' : 'Check In'}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!todayAtt?.check_in || !!todayAtt?.check_out || checkingOut}
              className={`btn-danger ${(!todayAtt?.check_in || todayAtt?.check_out) ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <RiLogoutBoxLine />
              {checkingOut ? 'Checking out...' : 'Check Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Present', value: summary.present || 0, color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Absent', value: summary.absent || 0, color: 'text-danger-500', bg: 'bg-danger-50' },
          { label: 'Half Day', value: summary.halfDay || 0, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Leave', value: summary.leave || 0, color: 'text-primary-600', bg: 'bg-primary-50' },
        ].map(s => (
          <motion.div whileHover={{ y: -2 }} key={s.label} className="glass-card p-4 text-center">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Month Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="input-field w-32"
        >
          {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="input-field w-24"
        >
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Content: List or Calendar */}
      {view === 'calendar' ? (
        <div className="glass-card p-5">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            height="auto"
            headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j}><div className="skeleton h-4 rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="No attendance records" description="No attendance data found for this period." />
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr key={r.id || r.date}>
                    <td className="font-medium">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                    <td>{r.check_in ? r.check_in.slice(0,5) : <span className="text-gray-300">—</span>}</td>
                    <td>{r.check_out ? r.check_out.slice(0,5) : <span className="text-gray-300">—</span>}</td>
                    <td>{r.work_hours > 0 ? `${parseFloat(r.work_hours).toFixed(1)}h` : <span className="text-gray-300">—</span>}</td>
                    <td>
                      <span className={statusColor[r.status]?.badge || 'badge-gray'}>
                        {r.status?.replace('_', ' ') || 'absent'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Modal */}
      <Modal isOpen={qrModal} onClose={() => setQrModal(false)} title="QR Code Check-In">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-4 bg-white rounded-2xl shadow-lg">
            <QRCodeSVG value={qrData || 'hrms-attendance'} size={200} fgColor="#4338CA" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Scan this QR code to mark your attendance for today.
            <br />Valid for: <strong>{new Date().toLocaleDateString()}</strong>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePage;
