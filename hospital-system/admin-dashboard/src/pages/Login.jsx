import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaShieldAlt, FaHospital } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome, Administrator!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19456B] to-[#0d2c4a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20 rounded-full border border-[#16C79A]/30">
              <FaShieldAlt className="text-4xl text-[#16C79A]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-[#16C79A]/80 mt-2">Hospital Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label text-[#16C79A]/80">Admin Email</label>
              <div className="relative">
                <FaUserShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16C79A]/60" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                  placeholder="admin@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label text-[#16C79A]/80">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16C79A]/60" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg hover:opacity-90 transition-all font-semibold text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#16C79A]/20">
            <p className="text-center text-sm text-[#16C79A]/80">
              For patient access, visit:{' '}
              <a href="http://localhost:3000" className="text-[#16C79A] hover:text-white transition-colors underline">
                Public Website
              </a>
            </p>
            <p className="text-center text-sm text-[#16C79A]/80 mt-2">
              Doctor portal:{' '}
              <a href="http://localhost:3002" className="text-[#16C79A] hover:text-white transition-colors underline">
                Doctor Dashboard
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 rounded-lg border border-[#16C79A]/20">
          <div className="flex items-center justify-center text-sm text-[#16C79A]">
            <FaShieldAlt className="mr-2" />
            <span>Secure administrative access only</span>
          </div>
          <p className="text-xs text-[#16C79A]/70 mt-2 text-center">
            Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;