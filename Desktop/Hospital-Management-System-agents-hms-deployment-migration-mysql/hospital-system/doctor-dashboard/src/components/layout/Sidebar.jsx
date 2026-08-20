import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  Bell,
  Settings,
  LogOut,
  Stethoscope
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/schedule', icon: Clock, label: 'Schedule' },
    { path: '/availability', icon: Clock, label: 'Availability' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#19456B] to-[#0d2c4a] border-r border-[#16C79A]/20 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-[#16C79A]/20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#16C79A] to-[#11698E] p-3 rounded-xl shadow-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">MedCare</h1>
            <p className="text-sm text-[#16C79A]/80">Doctor Dashboard</p>
          </div>
        </div>
      </div>



      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
            {/* User Info */}
      <div className="p-6 border-b border-[#16C79A]/20">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">Dr. {user?.name}</p>
            <p className="text-sm text-[#16C79A]/80">{user?.specialization}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#16C79A]/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-[#16C79A] hover:text-white hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-xl w-full transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar