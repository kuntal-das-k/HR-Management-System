import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  RiBriefcaseLine, RiMailLine, RiLockPasswordLine,
  RiEyeLine, RiEyeOffLine, RiArrowRightLine
} from 'react-icons/ri';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-mesh">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)`
        }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <RiBriefcaseLine className="text-white text-xl" />
            </div>
            <span className="font-display text-2xl font-bold text-white">HRMSPro</span>
          </div>

          {/* Center content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
                Manage your team with confidence
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                The modern HR platform that makes people management simple, transparent, and effective.
              </p>

              {/* Feature points */}
              <div className="space-y-3">
                {[
                  'Complete attendance & leave tracking',
                  'Automated payroll processing',
                  'Real-time analytics & insights',
                  'AI-powered HR assistant',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/90">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom */}
          <p className="text-white/50 text-sm">© 2026 HRMSPro. All rights reserved.</p>
        </div>

        {/* Floating cards decoration */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-8 top-1/3 w-48 glass-card p-4 bg-white/10 border-white/20"
        >
          <p className="text-white/60 text-xs mb-1">Present Today</p>
          <p className="text-white text-2xl font-bold">189</p>
          <div className="h-1.5 bg-white/20 rounded-full mt-2">
            <div className="h-full w-3/4 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
              <RiBriefcaseLine className="text-white text-base" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">HRMSPro</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="input-field pl-10"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                  })}
                />
              </div>
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="input-field pl-10 pr-10"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <p className="input-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign in <RiArrowRightLine /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">🔑 Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Admin</p>
                <p>admin@hrms.com</p>
                <p>Admin@123</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Employee</p>
                <p>alice@hrms.com</p>
                <p>Emp@123</p>
              </div>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
