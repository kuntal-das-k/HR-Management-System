import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dashboardService, attendanceService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import ActivityTimeline from '../../components/ui/ActivityTimeline';
import { SkeletonStats, SkeletonCard } from '../../components/ui/Skeleton';
import {
  RiCalendarCheckLine, RiFileTextLine, RiMoneyDollarCircleLine,
  RiTimeLine, RiCheckLine, RiArrowRightLine, RiLoginBoxLine, RiLogoutBoxLine
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressBar = ({ value, color = 'primary' }) => {
  const colorMap = { primary: 'from-primary-500 to-primary-400', success: 'from-success-500 to-emerald-400', warning: 'from-warning-500 to-amber-400' };
  return (
    <div className="progress-bar h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.primary}`}
      />
    </div>
  );
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getEmployee();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceService.checkIn();
      toast.success('✅ Checked in successfully!');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      await attendanceService.checkOut();
      toast.success('👋 Checked out successfully!');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const todayAtt = data?.todayAttendance;
  const isCheckedIn = !!todayAtt?.check_in;
  const isCheckedOut = !!todayAtt?.check_out;
  const attPercent = data?.attendance?.attendancePercent || 0;

  const attChartData = {
    labels: ['Present', 'Absent', 'Half Day', 'Leave'],
    datasets: [{
      data: [
        data?.attendance?.summary?.present || 0,
        data?.attendance?.summary?.absent || 0,
        data?.attendance?.summary?.half_day || 0,
        data?.attendance?.summary?.leave || 0,
      ],
      backgroundColor: ['#4f46e5', '#f43f5e', '#f59e0b', '#3b82f6'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const leaveTypes = Object.entries(data?.leaveBalance || {}).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome + Check-in Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-6 text-white shadow-glow"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ffffff&color=4338ca&bold=true&size=80`}
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
            />
            <div>
              <p className="text-white/70 text-sm">Welcome back</p>
              <h1 className="text-2xl font-display font-bold">{user?.name}</h1>
              <p className="text-white/70 text-sm">{user?.designation} · {user?.department}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="text-white/60 text-xs">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            {/* Attendance status */}
            <div className="flex items-center gap-2">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-all shadow-md"
                >
                  <RiLoginBoxLine />
                  {checkingIn ? 'Checking in...' : 'Check In'}
                </button>
              ) : !isCheckedOut ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                  className="flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all border border-white/30"
                >
                  <RiLogoutBoxLine />
                  {checkingOut ? 'Checking out...' : 'Check Out'}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-success-500/20 text-white text-sm px-4 py-2 rounded-xl border border-white/20">
                  <RiCheckLine /> Done for today
                </div>
              )}
            </div>

            {isCheckedIn && (
              <p className="text-white/60 text-xs">
                In: {todayAtt.check_in?.slice(0,5)}
                {isCheckedOut && ` · Out: ${todayAtt.check_out?.slice(0,5)}`}
                {todayAtt.work_hours > 0 && ` · ${parseFloat(todayAtt.work_hours).toFixed(1)}h`}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? <SkeletonStats /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Attendance %" value={`${attPercent}%`} icon={RiCalendarCheckLine} color="primary" />
          <StatCard
            title="Days Present"
            value={data?.attendance?.summary?.present || 0}
            icon={RiCheckLine}
            color="success"
            suffix={` / ${(data?.attendance?.summary?.present || 0) + (data?.attendance?.summary?.absent || 0)} days`}
          />
          <StatCard
            title="Paid Leave Left"
            value={data?.leaveBalance?.paid?.remaining ?? '—'}
            icon={RiFileTextLine}
            color="warning"
          />
          <StatCard
            title="Net Salary"
            value={data?.salary?.net_salary ? `₹${Number(data.salary.net_salary).toLocaleString('en-IN')}` : '—'}
            icon={RiMoneyDollarCircleLine}
            color="indigo"
          />
        </div>
      )}

      {/* Charts + Leave Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Doughnut */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">This Month's Attendance</h2>
          <div className="h-44">
            {loading ? <div className="skeleton h-full rounded-xl" /> : (
              <Doughnut
                data={attChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 } } } },
                  cutout: '65%',
                }}
              />
            )}
          </div>
        </div>

        {/* Leave Balance */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">Leave Balance</h2>
            <Link to="/leave" className="text-sm text-primary-600 font-medium flex items-center gap-1">
              Apply <RiArrowRightLine />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {leaveTypes.map(([type, bal]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{type} Leave</span>
                    <span className="text-gray-500">{bal.remaining}/{bal.total} days left</span>
                  </div>
                  <ProgressBar
                    value={(bal.remaining / bal.total) * 100}
                    color={bal.remaining > bal.total * 0.5 ? 'success' : bal.remaining > 0 ? 'warning' : 'primary'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Leaves + Activity + Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leaves */}
        <div className="glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">My Leaves</h2>
            <Link to="/leave" className="text-sm text-primary-600 font-medium flex items-center gap-1">View all <RiArrowRightLine /></Link>
          </div>
          <div className="space-y-2">
            {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />) :
              data?.recentLeaves?.slice(0, 4).map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">{leave.leave_type}</p>
                    <p className="text-xs text-gray-400">{new Date(leave.start_date).toLocaleDateString()} · {leave.total_days}d</p>
                  </div>
                  <span className={`badge ${leave.status === 'approved' ? 'badge-success' : leave.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {leave.status}
                  </span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Activity */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Recent Activity</h2>
          <ActivityTimeline activities={data?.recentActivities?.slice(0, 5) || []} loading={loading} />
        </div>

        {/* Upcoming Holidays */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Upcoming Holidays</h2>
          {loading ? (
            <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
          ) : data?.upcomingHolidays?.length ? (
            <div className="space-y-2">
              {data.upcomingHolidays.map(holiday => {
                const holidayDate = new Date(holiday.date);
                return (
                  <div key={holiday.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center text-primary-600">
                      <span className="text-[10px] font-semibold uppercase">{holidayDate.toLocaleDateString('en', { month: 'short' })}</span>
                      <span className="text-base font-bold leading-none">{holidayDate.getDate()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{holiday.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{holiday.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm py-6">No upcoming holidays</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
