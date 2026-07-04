import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiUserLine, RiCalendarCheckLine, RiFileTextLine,
  RiMoneyDollarCircleLine, RiBarChartBoxLine, RiShieldLine,
  RiArrowRightLine, RiBriefcaseLine, RiTeamLine, RiCheckboxCircleLine
} from 'react-icons/ri';

const features = [
  { icon: RiTeamLine,               title: 'Employee Management',    desc: 'Manage employee profiles, roles, departments, and records with ease.' },
  { icon: RiCalendarCheckLine,      title: 'Attendance Tracking',    desc: 'Check-in/out with QR codes, view daily, weekly, and monthly reports.' },
  { icon: RiFileTextLine,           title: 'Leave Management',       desc: 'Apply for leaves, track approvals, and manage leave balances effortlessly.' },
  { icon: RiMoneyDollarCircleLine,  title: 'Payroll Processing',     desc: 'Calculate salaries, bonuses, and deductions with full payslip generation.' },
  { icon: RiBarChartBoxLine,        title: 'Analytics Dashboard',    desc: 'Beautiful charts for attendance trends, department stats and growth.' },
  { icon: RiShieldLine,             title: 'Role-Based Access',      desc: 'Secure JWT authentication with separate admin and employee portals.' },
];

const stats = [
  { value: '500+', label: 'Companies' },
  { value: '50K+', label: 'Employees' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* ---- NAV ---- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow">
              <RiBriefcaseLine className="text-white text-base" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">HRMSPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm font-medium text-gray-600">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-secondary-200/30 dark:bg-secondary-900/10 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold rounded-full mb-6 border border-primary-200 dark:border-primary-700">
              🚀 Built for Modern Teams
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              The{' '}
              <span className="text-gradient">HR Platform</span>
              <br />Your Team Deserves
            </h1>

            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Streamline your entire HR workflow — from attendance and leaves to payroll and analytics — in one beautiful, intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-3 shadow-glow">
                Start Free <RiArrowRightLine />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-glass-lg border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Total Employees', value: '247', color: 'from-primary-500 to-primary-600' },
                  { label: 'Present Today',   value: '189', color: 'from-success-500 to-emerald-600' },
                  { label: 'Pending Leaves',  value: '12',  color: 'from-warning-500 to-amber-600'   },
                  { label: 'Departments',     value: '8',   color: 'from-secondary-500 to-blue-600'  },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card p-4">
                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 glass-card p-4 h-32 flex items-center justify-center">
                  <div className="w-full flex items-end gap-2 h-20">
                    {[65, 80, 55, 90, 75, 88, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="glass-card p-4 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-8 border-primary-200 border-t-primary-600 rotate-45" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl font-display font-bold mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4"
            >
              Everything you need to manage HR
            </motion.h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A complete HR suite designed for the modern workplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 group cursor-default hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-12 text-white shadow-glow-lg"
          >
            <h2 className="text-4xl font-display font-bold mb-4">Ready to get started?</h2>
            <p className="text-white/80 text-lg mb-8">Join thousands of companies managing their HR with HRMSPro.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-2xl hover:shadow-lg transition-all duration-200 text-base">
              Create Free Account <RiArrowRightLine />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-gray-100 dark:border-slate-800 py-8 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
            <RiBriefcaseLine className="text-white text-sm" />
          </div>
          <span className="font-display font-bold text-gradient text-base">HRMSPro</span>
        </div>
        <p>© 2026 HRMSPro. Built for the hackathon 🏆</p>
      </footer>
    </div>
  );
};

export default LandingPage;
