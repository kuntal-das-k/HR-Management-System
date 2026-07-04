import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  RiMailLine, RiLockPasswordLine,
  RiEyeLine, RiEyeOffLine, RiArrowRightLine
} from 'react-icons/ri';
import logo from '../assets/logo.png';

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
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#F4EBE0] to-[#E8D5BC]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)`
        }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="HRMS Logo" className="h-12 w-auto" />
            <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">HRmanager</span>
          </div>

          {/* Center content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-none text-gray-900 mb-6 dela-gothic-one-regular">
                Manage your team <br />
                <span className="text-[#B58A59]">with confidence</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-md">
                The modern HR platform that makes people management simple, transparent, and effective.
              </p>

              {/* Feature points */}
              <div className="space-y-4">
                {[
                  'Complete attendance & leave tracking',
                  'Automated payroll processing',
                  'Real-time analytics & insights',
                  'AI-powered HR assistant',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-800 font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#1EB952]/20 text-[#1EB952] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom */}
          <p className="text-gray-500 text-sm font-medium">© 2026 HRMS. All rights reserved.</p>
        </div>

        {/* Floating cards decoration */}

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
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={logo} alt="HRMS Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">HRmanager</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10 pr-10"
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

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-br from-[#FDF8F3] via-[#F4EBE0] to-[#E8D5BC] hover:bg-[#b59d88ff] text-black px-8 py-3 rounded-full font-medium transition-colors text-base shadow-sm flex items-center justify-center gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
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



          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1EB952] hover:text-[#1AA348] font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
