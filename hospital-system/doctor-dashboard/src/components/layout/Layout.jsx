import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer' // Now this import will work

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {/* Navbar - Mobile & Desktop */}
          <div className="lg:hidden">
            <Navbar />
          </div>

          {/* Content Area */}
          <div className="h-[calc(100vh-64px)] lg:h-screen overflow-y-auto">
            <div className="min-h-[calc(100vh-200px)]">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout