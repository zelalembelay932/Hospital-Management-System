import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaHospital,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useState, } from 'react';

const Sidebar = () => {
   const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/doctors', icon: FaUserMd, label: 'Doctors' },
    { path: '/patients', icon: FaUsers, label: 'Patients' },
    { path: '/appointments', icon: FaCalendarAlt, label: 'Appointments' },
    { path: '/reports', icon: FaChartBar, label: 'Reports' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg shadow-md"
      >
        {collapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </button>

      <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#19456B] to-[#0d2c4a] text-white z-40 flex flex-col shadow-2xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Logo Section */}
        <div className={`p-6 border-b border-[#16C79A]/20 transition-all duration-300 ${collapsed ? 'px-4' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className={`p-3 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-xl shadow-lg ${collapsed ? 'p-2.5' : ''}`}>
              <FaHospital className={`${collapsed ? 'text-lg' : 'text-2xl'}`} />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#16C79A] bg-clip-text text-transparent">
                  MedCare Pro
                </h2>
                <p className="text-sm text-[#16C79A]/70 mt-1">Hospital Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="mb-6">
            {!collapsed && (
              <p className="text-xs uppercase tracking-wider text-[#16C79A]/70 font-semibold mb-4 px-2">
                Main Menu
              </p>
            )}
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white shadow-lg'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {/* Animated Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className={`flex items-center ${collapsed ? '' : 'gap-3'} relative z-10`}>
                      <div className={`relative ${collapsed ? '' : 'p-2'}`}>
                        <item.icon className={`${collapsed ? 'text-xl' : 'text-lg'} transition-transform group-hover:scale-110`} />
                      </div>
                      
                      {!collapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    
                    {/* Active Indicator */}
                    <div className={({ isActive }) => 
                      `absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#16C79A] rounded-r-full transition-all duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`
                    } />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-[#16C79A]/20">
          {!collapsed && (
            <div className="mb-4 p-3 bg-gradient-to-r from-[#11698E]/30 to-[#19456B]/30 rounded-lg border border-[#16C79A]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center">
                  <span className="font-bold">AD</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Admin User</p>
                  <p className="text-xs text-[#16C79A]/70">Super Admin</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} w-full py-3 text-[#16C79A] hover:text-white hover:bg-red-900/20 rounded-xl transition-all duration-200 group`}
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 group-hover:from-red-500/20 group-hover:to-red-600/20 group-hover:scale-110 transition-transform">
              <FaSignOutAlt />
            </div>
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 hidden lg:flex items-center justify-center w-6 h-10 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-r-lg shadow-lg hover:scale-105 transition-transform"
        >
          <FaBars size={12} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;