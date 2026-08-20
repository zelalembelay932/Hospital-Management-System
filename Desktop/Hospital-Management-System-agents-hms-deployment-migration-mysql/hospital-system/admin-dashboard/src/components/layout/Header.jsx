import React, { useState } from 'react';
import { FaBell, FaSearch, FaCog, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-[#19456B] to-[#0d2c4a] border-b border-[#16C79A]/20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16C79A]/60" />
              <input
                type="text"
                placeholder="Search patients, doctors, appointments..."
                className="w-full pl-10 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-full relative transition-all duration-300">
                <FaBell className="text-[#16C79A]" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                  3
                </span>
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-full transition-all duration-300">
              <Link to="/settings">
                <FaCog className="text-[#16C79A]" />
              </Link>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#16C79A] to-[#11698E] text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                SA
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-white">System Admin</p>
                <p className="text-xs text-[#16C79A]/80">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;