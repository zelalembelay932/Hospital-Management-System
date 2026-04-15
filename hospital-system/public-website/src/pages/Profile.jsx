import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaLock, FaCalendarAlt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put('http://localhost:5000/api/users/profile', formData, config);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put('http://localhost:5000/api/users/change-password', {
        currentPassword: changePassword.currentPassword,
        newPassword: changePassword.newPassword
      }, config);

      toast.success('Password changed successfully');
      setChangePassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-[#0b3561] to-[#0f4989] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-[#58aefc]/80 mt-2">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] rounded-2xl shadow-xl border border-[#58aefc]/20">
            <div className="p-6 border-b border-[#58aefc]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#58aefc]/20 to-[#58aefc]/10 rounded-xl border border-[#58aefc]/20">
                    <FaUser className="text-xl text-[#58aefc]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                </div>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                    editing
                      ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 text-[#16C79A] hover:bg-gradient-to-r hover:from-[#16C79A]/20 hover:to-[#11698E]/20 border border-[#16C79A]/20'
                  }`}
                  disabled={loading}
                >
                  {editing ? (
                    <>
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaSave />
                      )}
                      Save Changes
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#16C79A]/80 mb-2">
                    <FaUser className="text-[#16C79A]" />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-xl text-white placeholder:text-[#58aefc]/60 focus:outline-none focus:ring-2 focus:ring-[#58aefc] focus:border-transparent"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-[#0b3561] to-[#0f4989] border border-[#58aefc]/20 rounded-xl text-white">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#16C79A]/80 mb-2">
                    <FaEnvelope className="text-[#16C79A]" />
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-xl text-white placeholder:text-[#58aefc]/60 focus:outline-none focus:ring-2 focus:ring-[#58aefc] focus:border-transparent"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-[#0b3561] to-[#0f4989] border border-[#58aefc]/20 rounded-xl text-white">
                      {user?.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#16C79A]/80 mb-2">
                    <FaPhone className="text-[#16C79A]" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-xl text-white placeholder:text-[#58aefc]/60 focus:outline-none focus:ring-2 focus:ring-[#58aefc] focus:border-transparent"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+252 61 123 4567"
                    />
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-[#0b3561] to-[#0f4989] border border-[#58aefc]/20 rounded-xl text-white">
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#16C79A]/80 mb-2">
                    <FaMapMarkerAlt className="text-[#16C79A]" />
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-xl text-white placeholder:text-[#58aefc]/60 focus:outline-none focus:ring-2 focus:ring-[#58aefc] focus:border-transparent min-h-[100px] resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Your address..."
                    />
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-[#0b3561] to-[#0f4989] border border-[#58aefc]/20 rounded-xl text-white">
                      {user?.address || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient ID */}
              <div className="mt-8 pt-8 border-t border-[#58aefc]/20">
                <label className="text-sm font-medium text-[#58aefc]/80 mb-3 block">Patient ID</label>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-[#0b3561] to-[#0f4989] rounded-xl border border-[#58aefc]/20">
                    <span className="font-mono font-bold text-white text-lg tracking-wider">
                      {user?._id?.slice(-8) || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-[#16C79A]/80">
                    Use this ID for all hospital-related communications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 mt-8">
            <div className="p-6 border-b border-[#16C79A]/20">
              <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#145fb8]/20 to-[#145fb8]/10 rounded-xl border border-[#58aefc]/20">
                  <FaShieldAlt className="text-xl text-[#145fb8]" />
                </div>
                <h2 className="text-xl font-semibold text-white">Medical Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#16C79A]/80 mb-2">Blood Type</label>
                  <div className="p-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] border border-[#16C79A]/20 rounded-xl text-white">
                    O+
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#16C79A]/80 mb-2">Allergies</label>
                  <div className="p-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] border border-[#16C79A]/20 rounded-xl text-white">
                    None known
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#16C79A]/80 mb-2">Chronic Conditions</label>
                  <div className="p-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] border border-[#16C79A]/20 rounded-xl text-white">
                    None
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#16C79A]/80 mb-2">Current Medications</label>
                  <div className="p-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] border border-[#16C79A]/20 rounded-xl text-white">
                    None
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#16C79A] to-[#11698E] rounded-full blur-sm opacity-30"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-[#16C79A] to-[#11698E] flex items-center justify-center text-white font-bold text-4xl border-4 border-[#19456B]">
                  {user?.name?.charAt(0) || 'P'}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
              <p className="text-[#16C79A]">Patient</p>
              <div className="mt-4">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 text-[#16C79A] font-medium rounded-xl hover:bg-gradient-to-r hover:from-[#16C79A]/20 hover:to-[#11698E]/20 transition-all duration-300 border border-[#16C79A]/20">
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-[#16C79A]/20 to-[#16C79A]/10 rounded-xl border border-[#16C79A]/20">
                <FaLock className="text-xl text-[#16C79A]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#16C79A]/80 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white placeholder:text-[#16C79A]/60 focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent"
                  value={changePassword.currentPassword}
                  onChange={(e) => setChangePassword({...changePassword, currentPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#16C79A]/80 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white placeholder:text-[#16C79A]/60 focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent"
                  value={changePassword.newPassword}
                  onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#16C79A]/80 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white placeholder:text-[#16C79A]/60 focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent"
                  value={changePassword.confirmPassword}
                  onChange={(e) => setChangePassword({...changePassword, confirmPassword: e.target.value})}
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={loading || !changePassword.currentPassword || !changePassword.newPassword}
                className={`w-full py-3 text-white font-bold rounded-xl transition-all duration-300 ${
                  loading || !changePassword.currentPassword || !changePassword.newPassword
                    ? 'bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/30 cursor-not-allowed border border-[#16C79A]/10'
                    : 'bg-gradient-to-r from-[#16C79A] to-[#11698E] hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-[#11698E]/20 to-[#11698E]/10 rounded-xl border border-[#16C79A]/20">
                <FaCheckCircle className="text-xl text-[#11698E]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Account Status</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#16C79A]/80">Account Created:</span>
                <span className="font-medium text-white">March 15, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#16C79A]/80">Status:</span>
                <span className="px-3 py-1 bg-gradient-to-r from-[#16C79A]/20 to-[#16C79A]/10 text-[#16C79A] text-xs font-medium rounded-full border border-[#16C79A]/20">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#16C79A]/80">Last Login:</span>
                <span className="font-medium text-white">Today, 10:30 AM</span>
              </div>
            </div>
          </div>

          {/* Medical Records Summary */}
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-xl border border-emerald-500/20">
                <FaCalendarAlt className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Medical Records</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#16C79A]/80">Total Appointments:</span>
                <span className="font-bold text-white">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#16C79A]/80">Completed:</span>
                <span className="font-bold text-emerald-400">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#16C79A]/80">Upcoming:</span>
                <span className="font-bold text-[#16C79A]">3</span>
              </div>
              <div className="pt-3 border-t border-[#16C79A]/20">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 text-[#16C79A] font-medium rounded-xl hover:bg-gradient-to-r hover:from-[#16C79A]/20 hover:to-[#11698E]/20 transition-all duration-300 border border-[#16C79A]/20">
                  View Medical History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;