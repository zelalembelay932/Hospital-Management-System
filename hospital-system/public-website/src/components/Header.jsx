import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Hospital, User, Menu, X, 
  Home, Users, Phone, Info,
  LogOut, LayoutDashboard, Calendar,
  MessageSquare, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { to: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
    { to: '/doctors', label: 'Doctors', icon: <Users className="h-4 w-4" /> },
    { to: '/contact', label: 'Contact', icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                MedCare <span className="text-blue-600">Hospital</span>
              </h1>
              <p className="text-xs text-gray-500">Quality Healthcare for All</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>
                
                <Link
                  to="/patient/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  <User className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-100 mt-2 pt-4 pb-6 bg-white rounded-lg shadow-lg mx-2">
            <div className="flex flex-col gap-2">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200 px-4 py-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="p-1.5 bg-blue-50 rounded-md">
                    {link.icon}
                  </div>
                  {link.label}
                </Link>
              ))}

              {/* User Actions */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Patient Account</p>
                      </div>
                    </div>

                    {/* Dashboard Button */}
                    <Link
                      to="/patient/dashboard"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium mb-3 mx-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium mx-4"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 px-4">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Login
                    </Link>
                    
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;