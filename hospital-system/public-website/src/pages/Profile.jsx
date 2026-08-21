import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaEdit,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaShieldAlt,
  FaUser
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  address: ''
};

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/users/me');
        const profile = response.data?.user || response.data;
        setFormData({
          name: profile?.name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          address: profile?.address || ''
        });
        setUser(profile);
      } catch (error) {
        console.error('Profile load error:', error);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address || ''
        });
        toast.error(error.response?.data?.message || 'Could not load your complete profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [setUser]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const response = await api.put('/users/me', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      });
      const updatedUser = response.data?.user || response.data;
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || formData.email,
        phone: updatedUser.phone || '',
        address: updatedUser.address || ''
      });
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error('Your new password must contain at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('The new passwords do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully.');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.response?.data?.message || 'Could not change your password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-3 text-[#d5f7ee]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#16C79A] border-t-transparent" />
        Loading your profile…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#16C79A]/25 bg-gradient-to-r from-[#11698E]/25 to-[#0d2c4a]/45 p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#7ce8ca]">Account settings</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Your profile</h2>
        <p className="mt-2 text-sm text-[#d5f7ee]">
          Manage your personal details and keep your account secure.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-2xl border border-[#16C79A]/25 bg-[#0d2c4a]/45 p-6 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#16C79A] to-[#11698E] text-3xl font-bold text-white shadow-lg">
            {(formData.name || 'P').charAt(0).toUpperCase()}
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">{formData.name || 'Patient'}</h3>
          <p className="mt-1 break-all text-sm text-[#b9dfd7]">{formData.email}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#16C79A]/35 bg-[#16C79A]/10 px-3 py-1 text-sm font-semibold text-[#91f2d5]">
            <FaShieldAlt />
            Patient account
          </span>

          <div className="mt-6 border-t border-white/10 pt-5 text-left">
            <p className="mb-3 text-sm font-semibold text-[#b9dfd7]">Account benefits</p>
            <ul className="space-y-3 text-sm text-[#d5f7ee]">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#16C79A]" /> Book appointments online</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#16C79A]" /> Track appointment status</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#16C79A]" /> Receive secure updates</li>
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#16C79A]/25 bg-[#0d2c4a]/45 p-5 shadow-xl sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Personal information</h3>
                <p className="mt-1 text-sm text-[#b9dfd7]">Your email is used as your sign-in address.</p>
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#16C79A]/45 px-3 py-2 text-sm font-semibold text-[#91f2d5] transition hover:bg-[#16C79A]/10"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveProfile}>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><FaUser className="text-[#16C79A]" /> Full name</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={updateField}
                  disabled={!editing}
                  required
                  className="w-full rounded-xl border border-[#16C79A]/30 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/35 disabled:cursor-not-allowed disabled:opacity-65"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><FaEnvelope className="text-[#16C79A]" /> Email address</span>
                <input
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#16C79A]/20 bg-black/15 px-4 py-3 text-white/75 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><FaPhone className="text-[#16C79A]" /> Phone number</span>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={updateField}
                  disabled={!editing}
                  placeholder="+251 91 123 4567"
                  className="w-full rounded-xl border border-[#16C79A]/30 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/35 disabled:cursor-not-allowed disabled:opacity-65"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><FaMapMarkerAlt className="text-[#16C79A]" /> Address</span>
                <input
                  name="address"
                  value={formData.address}
                  onChange={updateField}
                  disabled={!editing}
                  placeholder="Your address"
                  className="w-full rounded-xl border border-[#16C79A]/30 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/35 disabled:cursor-not-allowed disabled:opacity-65"
                />
              </label>

              {editing && (
                <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#16C79A] to-[#11698E] px-5 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaSave />
                    {savingProfile ? 'Saving…' : 'Save changes'}
                  </button>
                  <button
                    type="button"
                    disabled={savingProfile}
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user?.name || formData.name,
                        email: user?.email || formData.email,
                        phone: user?.phone || '',
                        address: user?.address || ''
                      });
                    }}
                    className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </section>

          <section className="rounded-2xl border border-[#16C79A]/25 bg-[#0d2c4a]/45 p-5 shadow-xl sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C79A]/15 text-[#16C79A]"><FaLock /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Change password</h3>
                <p className="mt-1 text-sm text-[#b9dfd7]">Use a strong password with at least 6 characters.</p>
              </div>
            </div>

            <form className="grid gap-4 sm:grid-cols-3" onSubmit={changePassword}>
              {[
                ['currentPassword', 'Current password'],
                ['newPassword', 'New password'],
                ['confirmPassword', 'Confirm new password']
              ].map(([name, label]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
                  <input
                    name={name}
                    type="password"
                    value={passwordData[name]}
                    onChange={(event) => setPasswordData((previous) => ({ ...previous, [name]: event.target.value }))}
                    required
                    minLength={name === 'currentPassword' ? undefined : 6}
                    className="w-full rounded-xl border border-[#16C79A]/30 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/35"
                  />
                </label>
              ))}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#16C79A]/50 px-5 py-3 font-bold text-[#91f2d5] transition hover:bg-[#16C79A]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaLock />
                  {savingPassword ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
