import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import ActivityTimeline from '../../components/ui/ActivityTimeline';
import { SkeletonStats } from '../../components/ui/Skeleton';
import {
  RiTeamLine, RiCalendarCheckLine, RiFileTextLine,
  RiBuildingLine, RiMoneyDollarCircleLine, RiUserAddLine,
  RiArrowRightLine, RiCheckLine, RiCloseLine, RiTimeLine
} from 'react-icons/ri';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getAdmin();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Chart configs
  const deptChartData = {
    labels: data?.charts?.departmentDistribution?.map(d => d.department) || [],
    datasets: [{
      data: data?.charts?.departmentDistribution?.map(d => d.count) || [],
      backgroundColor: ['#4f46e5','#3b82f6','#06b6d4','#10b981','#f59e0b','#f43f5e','#8b5cf6','#ec4899'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const attendanceTrendData = {
    labels: data?.charts?.attendanceTrend?.map(d => new Date(d.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Present',
        data: data?.charts?.attendanceTrend?.map(d => d.present) || [],
        backgroundColor: 'rgba(79,70,229,0.15)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4f46e5',
        pointRadius: 4,
      },
      {
        label: 'Absent',
        data: data?.charts?.attendanceTrend?.map(d => d.absent) || [],
        backgroundColor: 'rgba(244,63,94,0.10)',
        borderColor: '#f43f5e',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f43f5e',
        pointRadius: 4,
      },
    ],
  };

  const leaveChartData = {
    labels: data?.charts?.leaveByType?.map(d => d.leave_type.charAt(0).toUpperCase() + d.leave_type.slice(1)) || [],
    datasets: [{
      data: data?.charts?.leaveByType?.map(d => d.count) || [],
      backgroundColor: ['#4f46e5','#3b82f6','#10b981','#f59e0b','#f43f5e','#8b5cf6'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } },
    },
    cutout: '65%',
  };

  const statusBadge = (status) => {
    if (status === 'approved') return <span className="badge-success">Approved</span>;
    if (status === 'rejected') return <span className="badge-danger">Rejected</span>;
    return <span className="badge-warning">Pending</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/employees" className="btn-primary hidden sm:flex">
          <RiUserAddLine /> Add Employee
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? <SkeletonStats /> : (
        <motion.div
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <StatCard title="Total Employees" value={data?.stats?.totalEmployees} icon={RiTeamLine} color="primary" trend={8} trendLabel="vs last month" />
          </motion.div>
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <StatCard title="Present Today" value={data?.stats?.presentToday} icon={RiCalendarCheckLine} color="success" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Pending Leaves" value={data?.stats?.pendingLeaves} icon={RiFileTextLine} color="warning" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Departments" value={data?.stats?.departments} icon={RiBuildingLine} color="indigo" />
          </motion.div>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">Attendance Trend (7 Days)</h2>
          </div>
          <div className="h-52">
            {loading ? (
              <div className="skeleton h-full rounded-xl" />
            ) : data?.charts?.attendanceTrend?.length ? (
              <Line data={attendanceTrendData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">No attendance data yet</div>
            )}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">Departments</h2>
          </div>
          <div className="h-52">
            {loading ? (
              <div className="skeleton h-full rounded-xl" />
            ) : data?.charts?.departmentDistribution?.length ? (
              <Doughnut data={deptChartData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leaves */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">Recent Leave Requests</h2>
            <Link to="/admin/leaves" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <RiArrowRightLine />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <div className="skeleton w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-1/3 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              ))
            ) : data?.recentLeaves?.length ? data.recentLeaves.map(leave => (
              <div key={leave.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <img
                  src={leave.avatar ? `http://localhost:5000${leave.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(leave.name)}&background=4338ca&color=fff&bold=true&size=40`}
                  alt={leave.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{leave.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {leave.leave_type} · {leave.total_days} day(s) · {new Date(leave.start_date).toLocaleDateString()}
                  </p>
                </div>
                {statusBadge(leave.status)}
              </div>
            )) : <p className="text-center text-gray-400 text-sm py-6">No leave requests</p>}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
          </div>
          <ActivityTimeline activities={data?.recentActivities || []} loading={loading} />
        </div>
      </div>

      {/* Leave Type Distribution */}
      {!loading && data?.charts?.leaveByType?.length > 0 && (
        <div className="glass-card p-5">
          <div className="section-header">
            <h2 className="section-title">Leave Distribution (This Month)</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="h-48">
              <Doughnut data={leaveChartData} options={doughnutOptions} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.charts.leaveByType.map((item, i) => (
                <div key={item.leave_type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: leaveChartData.datasets[0].backgroundColor[i] }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{item.leave_type}</p>
                    <p className="text-xs text-gray-400">{item.count} requests</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
