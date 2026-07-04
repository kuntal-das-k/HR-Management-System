import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import toast from 'react-hot-toast';
import {
  RiMailLine, RiLockPasswordLine,
  RiUserLine, RiEyeLine, RiEyeOffLine, RiPhoneLine, RiBuildingLine,
  RiArrowRightLine
} from 'react-icons/ri';
import logo from '../assets/logo.png';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setError, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      const user = await login({ email: data.email, password: data.password });
      toast.success(`Welcome to HRMS, ${data.name}! 🎉`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && Array.isArray(serverErrors)) {
        serverErrors.forEach(error => {
          // express-validator returns error.path (formerly error.param)
          const fieldName = error.path || error.param;
          if (fieldName) {
            setError(fieldName, { type: 'server', message: error.msg });
          }
        });
      } else {
        toast.error(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
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
                Join thousands of teams <br />
                <span className="text-[#B58A59]">using HRMS</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-md">
                Create an account today and streamline your HR operations with our all-in-one management solution.
              </p>

              {/* Feature points */}
              <div className="space-y-4">
                {[
                  'Quick and easy setup',
                  'Secure data management',
                  'Customizable employee roles',
                  '24/7 dedicated support',
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
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg my-auto pt-8 pb-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={logo} alt="HRMS Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">HRmanager</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-500">Join our platform and manage your team efficiently</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' }
                    })}
                  />
                </div>
                {errors.name && <p className="input-error">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10"
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                <div className="relative">
                  <RiBuildingLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10 appearance-none" {...register('department')}>
                    <option value="">Select Department</option>
                    {['Engineering', 'Design', 'Marketing', 'Finance', 'HR', 'Sales', 'Management', 'Operations'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10 pr-10"
                    {...register('password', {
                      required: 'Password is required',
                      validate: {
                        strongPassword: (v) => 
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(v) ||
                          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
                {errors.password && <p className="input-error">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A59] focus:border-transparent placeholder-gray-400 transition-all duration-200 pl-10"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: v => v === password || 'Passwords do not match'
                    })}
                  />
                </div>
                {errors.confirmPassword && <p className="input-error">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-[#1EB952] has-[:checked]:border-[#1EB952] has-[:checked]:bg-[#1EB952]/10 transition-all">
                  <input type="radio" value="employee" defaultChecked {...register('role')} className="accent-[#1EB952]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Employee</p>
                    <p className="text-xs text-gray-400">Standard access</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-[#1EB952] has-[:checked]:border-[#1EB952] has-[:checked]:bg-[#1EB952]/10 transition-all">
                  <input type="radio" value="admin" {...register('role')} className="accent-[#1EB952]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Admin</p>
                    <p className="text-xs text-gray-400">Full access</p>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#B58A59] hover:bg-[#9B7348] text-white px-8 py-3 rounded-full font-medium transition-colors text-base shadow-sm flex items-center justify-center gap-2 mt-4">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>Create Account <RiArrowRightLine /></>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1EB952] hover:text-[#1AA348] font-semibold transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
