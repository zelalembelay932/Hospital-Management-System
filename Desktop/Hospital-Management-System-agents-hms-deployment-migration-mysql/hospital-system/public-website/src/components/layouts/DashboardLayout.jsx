import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaHistory, 
  FaUser, 
  FaBell, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight
} from 'react-icons/fa';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/patient/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/patient/book-appointment', icon: FaCalendarAlt, label: 'Book Appointment' },
    { path: '/patient/appointments', icon: FaHistory, label: 'My Appointments' },
    { path: '/patient/profile', icon: FaUser, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0d2c4a] to-[#19456B]">
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 shadow-sm border-b border-[#16C79A]/20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#16C79A]/10 text-[#16C79A] transition-all"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-xl font-bold text-white">
            Patient Dashboard
          </h1>
          <div className="w-10 flex items-center justify-center">
            <FaBell className="text-[#16C79A]" size={18} />
          </div>
        </div>
      </div>

      <div className="flex h-full">
        
        {/* Sidebar - Modern & Clean */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-[#0d2c4a] to-[#19456B]
            shadow-2xl
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            overflow-y-auto border-r border-[#16C79A]/20
          `}
        >
          <div className="flex flex-col h-full">
            
            {/* User Info - Elegant Design */}
            <div className="p-6 border-b border-[#16C79A]/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#16C79A] to-[#11698E] rounded-full blur-sm opacity-30"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center text-white font-bold text-xl">
                    {user?.name?.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-white text-lg">{user?.name}</h2>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 rounded-full border border-[#16C79A]/30">
                      <p className="text-xs font-medium text-[#16C79A]">Patient</p>
                    </div>
                    <div className="w-2 h-2 bg-[#16C79A] rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation - Clean & Modern */}
            <nav className="flex-1 p-5">
              <p className="text-xs uppercase tracking-wider text-[#16C79A]/80 font-semibold mb-4 px-2">
                Navigation
              </p>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white shadow-lg'
                          : 'text-white/90 hover:bg-gradient-to-r hover:from-[#16C79A]/10 hover:to-[#11698E]/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          location.pathname === item.path 
                            ? 'bg-white/20' 
                            : 'bg-[#16C79A]/10 group-hover:bg-[#16C79A]/20'
                        }`}>
                          <item.icon className={
                            location.pathname === item.path 
                              ? 'text-white' 
                              : 'text-[#16C79A] group-hover:text-white'
                          } />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {location.pathname === item.path ? (
                        <FaChevronRight className="text-white" />
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaChevronRight className="text-[#16C79A]" size={12} />
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer & Logout */}
            <div className="p-5 border-t border-[#16C79A]/20">
              <div className="space-y-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-xl transition-all duration-300 group border border-red-500/20"
                >
                  <div className="p-2.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20">
                    <FaSignOutAlt size={14} className="text-red-400" />
                  </div>
                  <span className="font-medium text-white/90">Logout</span>
                </button>
              </div>

              {/* Branding */}
              <div className="mt-6 pt-4 border-t border-[#16C79A]/20">
                <p className="text-center text-xs text-[#16C79A]/60">
                  © {new Date().getFullYear()} MedCare
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="ml-0 lg:ml-72 flex-1 h-screen overflow-y-auto pt-16 lg:pt-0">
          {/* Desktop Top Bar */}
          <div className="hidden lg:flex items-center justify-between bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 backdrop-blur-sm border-b border-[#16C79A]/20 px-8 py-5">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-[#16C79A]/80 text-sm mt-1">
                Welcome back! Your health journey continues here.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 hover:bg-gradient-to-r hover:from-[#16C79A]/10 hover:to-[#11698E]/10 rounded-full transition-all duration-300 border border-[#16C79A]/20">
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-[#16C79A]/10 hover:to-[#11698E]/10 transition-all duration-300 border border-[#16C79A]/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#16C79A] to-[#11698E] flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-[#16C79A]">Patient</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-[#19456B]/50 to-[#0d2c4a]/50 rounded-2xl shadow-xl border border-[#16C79A]/20 p-6 backdrop-blur-sm">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;