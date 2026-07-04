import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import toast from 'react-hot-toast';
import {
  RiBriefcaseLine, RiMailLine, RiLockPasswordLine,
  RiUserLine, RiEyeLine, RiEyeOffLine, RiPhoneLine, RiBuildingLine
} from 'react-icons/ri';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      const user = await login({ email: data.email, password: data.password });
      toast.success(`Welcome to HRMSPro, ${data.name}! 🎉`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-glow">
              <RiBriefcaseLine className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-2xl text-gradient">HRMSPro</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join thousands of teams using HRMSPro</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input-field pl-10"
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
                <label className="input-label">Email Address</label>
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

              {/* Phone */}
              <div>
                <label className="input-label">Phone Number</label>
                <div className="relative">
                  <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    className="input-field pl-10"
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="input-label">Department</label>
                <div className="relative">
                  <RiBuildingLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className="input-field pl-10" {...register('department')}>
                    <option value="">Select Department</option>
                    {['Engineering', 'Design', 'Marketing', 'Finance', 'HR', 'Sales', 'Management', 'Operations'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 chars (uppercase, lowercase, number, symbol)"
                    className="input-field pl-10 pr-10"
                    {...register('password', {
                      required: 'Password is required',
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                        message: 'Password must be at least 8 characters and include an uppercase, a lowercase, a number, and a symbol (@$!%*?&#)'
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
                <label className="input-label">Confirm Password</label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    className="input-field pl-10"
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
              <label className="input-label">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 cursor-pointer hover:border-primary-400 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20 transition-all">
                  <input type="radio" value="employee" defaultChecked {...register('role')} className="accent-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Employee</p>
                    <p className="text-xs text-gray-400">Standard access</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 cursor-pointer hover:border-primary-400 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20 transition-all">
                  <input type="radio" value="admin" {...register('role')} className="accent-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin</p>
                    <p className="text-xs text-gray-400">Full access</p>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account 🚀'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
