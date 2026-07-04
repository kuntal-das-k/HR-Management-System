import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { employeeService } from '../services';
import { authService } from '../services';
import { useForm } from 'react-hook-form';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  RiUserLine, RiEditLine, RiMailLine, RiPhoneLine,
  RiBuildingLine, RiBriefcaseLine, RiCalendarLine,
  RiMapPinLine, RiLockPasswordLine, RiCameraLine,
  RiShieldLine, RiHeartLine
} from 'react-icons/ri';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="text-primary-600 text-base" />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: errPwd }, watch } = useForm();
  const newPass = watch('newPassword');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await employeeService.getById(user.id);
      setProfile(data.data);
      reset(data.data);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSaveProfile = async (formData) => {
    setSaving(true);
    try {
      await employeeService.update(user.id, formData);
      updateUser({ name: formData.name });
      toast.success('Profile updated successfully!');
      setEditModal(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (formData) => {
    setSaving(true);
    try {
      await authService.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      toast.success('Password changed successfully!');
      setPasswordModal(false);
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await employeeService.uploadAvatar(user.id, formData);
      updateUser({ avatar: data.data.avatar });
      toast.success('Profile photo updated!');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const avatarUrl = profile?.avatar
    ? `http://localhost:5000${profile.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=4338ca&color=fff&bold=true&size=128`;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-48 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="lg:col-span-2 skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cover / Hero */}
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img src={avatarUrl} alt={profile?.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md hover:bg-primary-700 transition-colors"
                title="Change photo"
              >
                {uploadingAvatar ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <RiCameraLine className="text-sm" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{profile?.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">{profile?.designation} · {profile?.department}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-primary">{profile?.employee_id}</span>
                <span className={`badge ${profile?.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                  {profile?.status}
                </span>
                <span className="badge-gray capitalize">{profile?.employment_type?.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setEditModal(true)} className="btn-primary">
                <RiEditLine /> Edit Profile
              </button>
              <button onClick={() => setPasswordModal(true)} className="btn-secondary">
                <RiLockPasswordLine />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-2">Personal Information</h2>
          <InfoRow icon={RiUserLine} label="Full Name" value={profile?.name} />
          <InfoRow icon={RiMailLine} label="Email" value={profile?.email} />
          <InfoRow icon={RiPhoneLine} label="Phone" value={profile?.phone} />
          <InfoRow icon={RiCalendarLine} label="Date of Birth" value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : null} />
          <InfoRow icon={RiUserLine} label="Gender" value={profile?.gender?.charAt(0).toUpperCase() + (profile?.gender?.slice(1) || '')} />
          <InfoRow icon={RiHeartLine} label="Blood Group" value={profile?.blood_group} />
          <InfoRow icon={RiMapPinLine} label="Address" value={profile?.address} />
        </div>

        {/* Work Info */}
        <div className="glass-card p-5">
          <h2 className="section-title mb-2">Work Information</h2>
          <InfoRow icon={RiBriefcaseLine} label="Employee ID" value={profile?.employee_id} />
          <InfoRow icon={RiBuildingLine} label="Department" value={profile?.department} />
          <InfoRow icon={RiBriefcaseLine} label="Designation" value={profile?.designation} />
          <InfoRow icon={RiCalendarLine} label="Joining Date" value={profile?.joining_date ? new Date(profile.joining_date).toLocaleDateString() : null} />
          <InfoRow icon={RiShieldLine} label="Employment Type" value={profile?.employment_type?.replace('_', ' ')} />
          <InfoRow icon={RiShieldLine} label="Role" value={profile?.role} />
        </div>

        {/* Emergency + Quick Actions */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="section-title mb-2">Emergency Contact</h2>
            <InfoRow icon={RiUserLine} label="Contact Name" value={profile?.emergency_contact} />
            <InfoRow icon={RiPhoneLine} label="Phone" value={profile?.emergency_phone} />
          </div>

          <div className="glass-card p-5">
            <h2 className="section-title mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button onClick={() => setEditModal(true)} className="btn-secondary w-full justify-center">
                <RiEditLine /> Edit Profile
              </button>
              <button onClick={() => setPasswordModal(true)} className="btn-ghost w-full justify-center text-gray-600">
                <RiLockPasswordLine /> Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Profile"
        size="lg"
        footer={
          <>
            <button onClick={() => setEditModal(false)} className="btn-secondary">Cancel</button>
            <button form="edit-profile-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-profile-form" onSubmit={handleSubmit(onSaveProfile)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
            { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
            { name: 'blood_group', label: 'Blood Group', type: 'select', options: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
            { name: 'emergency_contact', label: 'Emergency Contact', type: 'text' },
            { name: 'emergency_phone', label: 'Emergency Phone', type: 'tel' },
          ].map(field => (
            <div key={field.name} className={field.name === 'address' ? 'sm:col-span-2' : ''}>
              <label className="input-label">{field.label}</label>
              {field.type === 'select' ? (
                <select className="input-field" {...register(field.name)}>
                  <option value="">Select {field.label}</option>
                  {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={field.type} className="input-field" {...register(field.name, field.required ? { required: `${field.label} is required` } : {})} />
              )}
              {errors[field.name] && <p className="input-error">{errors[field.name].message}</p>}
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="input-label">Address</label>
            <textarea rows={2} className="input-field resize-none" {...register('address')} />
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModal}
        onClose={() => setPasswordModal(false)}
        title="Change Password"
        footer={
          <>
            <button onClick={() => setPasswordModal(false)} className="btn-secondary">Cancel</button>
            <button form="change-password-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </>
        }
      >
        <form id="change-password-form" onSubmit={handlePwd(onChangePassword)} className="space-y-4">
          <div>
            <label className="input-label">Current Password</label>
            <input type="password" className="input-field" placeholder="Enter current password" {...regPwd('currentPassword', { required: 'Required' })} />
            {errPwd.currentPassword && <p className="input-error">{errPwd.currentPassword.message}</p>}
          </div>
          <div>
            <label className="input-label">New Password</label>
            <input type="password" className="input-field" placeholder="Min. 6 characters" {...regPwd('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            {errPwd.newPassword && <p className="input-error">{errPwd.newPassword.message}</p>}
          </div>
          <div>
            <label className="input-label">Confirm New Password</label>
            <input type="password" className="input-field" placeholder="Repeat new password" {...regPwd('confirmPassword', { required: 'Required', validate: v => v === newPass || 'Passwords do not match' })} />
            {errPwd.confirmPassword && <p className="input-error">{errPwd.confirmPassword.message}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
