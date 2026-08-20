import React from 'react'
import { Heart, Shield, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">ShifoOnline</h2>
                <p className="text-sm text-blue-600">Advanced Hospital Management</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              A comprehensive hospital management system designed to streamline 
              medical operations and enhance patient care through digital innovation.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant • Secure • Reliable</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/appointments" className="text-gray-600 hover:text-blue-600">
                  Appointments
                </a>
              </li>
              <li>
                <a href="/schedule" className="text-gray-600 hover:text-blue-600">
                  Schedule
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </a>
              </li>
              <li>
                <a href="/notifications" className="text-gray-600 hover:text-blue-600">
                  Notifications
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">+251 994942373 </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">support@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">Oromia, Adama</span>
              </li>
            </ul>
            
            {/* Emergency Contact */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Emergency Contact</p>
              <p className="text-lg font-bold text-red-600">+251 994942373</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © {currentYear}ETH Hospital System. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Version 2.1.0 • Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Help Center
              </a>
            </div>
          </div>

          {/* Made with love */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" /> by the ETH Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer