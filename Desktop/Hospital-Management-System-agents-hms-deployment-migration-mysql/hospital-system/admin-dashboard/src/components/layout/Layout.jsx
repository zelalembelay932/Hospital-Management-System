import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from "../layout/Header"

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#19456B] to-[#0d2c4a] ">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - Scrollable */}
      <div className="ml-72 flex-1 flex flex-col min-h-screen">
        {/* Optional: If you have a Header component, it goes here */}
        <Header />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;