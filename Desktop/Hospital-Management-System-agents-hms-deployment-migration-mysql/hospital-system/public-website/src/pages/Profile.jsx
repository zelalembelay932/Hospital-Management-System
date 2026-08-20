import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaLock, FaCalendarAlt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
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
      const payload = { ...formData };
      await api.put('/users/me', payload);
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        currentPassword: changePassword.currentPassword,
        newPassword: changePassword.newPassword
      };
      await api.post('/auth/change-password', payload);
      toast.success('Password changed');
      setChangePassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      <div style={{ maxWidth: 600 }}>
        <div>
          <label>Name</label>
          <input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
        </div>
        <div>
          <label>Email</label>
          <input value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
        </div>
        <div>
          <label>Phone</label>
          <input value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
        </div>
        <div>
          <label>Address</label>
          <input value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} />
        </div>

        <div style={{ marginTop: 10 }}>
          <button onClick={handleSave} disabled={loading}>Save</button>
        </div>

        <hr />

        <h3>Change Password</h3>
        <div>
          <label>Current Password</label>
          <input type="password" value={changePassword.currentPassword} onChange={(e) => setChangePassword(prev => ({ ...prev, currentPassword: e.target.value }))} />
        </div>
        <div>
          <label>New Password</label>
          <input type="password" value={changePassword.newPassword} onChange={(e) => setChangePassword(prev => ({ ...prev, newPassword: e.target.value }))} />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input type="password" value={changePassword.confirmPassword} onChange={(e) => setChangePassword(prev => ({ ...prev, confirmPassword: e.target.value }))} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button onClick={handleChangePassword} disabled={loading}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
