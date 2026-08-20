import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Eye, EyeOff, Lock, Mail, Stethoscope, AlertCircle, Shield, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const validateForm = () => {
    const newErrors = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
      setErrors({ 
        general: 'Invalid email or password. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast.info('Password reset feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19456B] to-[#0d2c4a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#16C79A] to-[#11698E]">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">ShifoOnline</h1>
              <p className="text-[#16C79A] font-medium">Doctor Portal</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-[#16C79A]/80 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <p className="text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#16C79A]/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#16C79A]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#16C79A] focus:border-[#16C79A] transition-all duration-300 text-black placeholder-[#16C79A]/50 ${
                    errors.email ? 'border-red-500' : 'border-[#16C79A]/30'
                  }`}
                  placeholder="doctor@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#16C79A]/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#16C79A]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 pl-10 pr-12 py-3 border  rounded-xl focus:ring-2 focus:ring-[#16C79A] focus:border-[#16C79A] transition-all duration-300 text-black placeholder-[#16C79A]/50 ${
                    errors.password ? 'border-red-500' : 'border-[#16C79A]/30'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#16C79A]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#16C79A]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#16C79A] border-[#16C79A]/30 rounded focus:ring-[#16C79A] bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#16C79A]/80">
                  Remember me
                </label>
              </div>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#16C79A] hover:text-white transition-all duration-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16C79A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <LogIn className="h-5 w-5" />
                  Sign In to Dashboard
                </div>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
            <p className="text-sm font-medium text-[#16C79A] mb-2">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#16C79A]/80">Email:</span>
                <span className="font-mono text-white">doctor@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#16C79A]/80">Password:</span>
                <span className="font-mono text-white">doctor123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-[#16C79A]/80">
            Having trouble signing in?{' '}
            <a href="mailto:support@shifoonline.com" className="text-[#16C79A] hover:text-white font-medium transition-all duration-300">
              Contact Support
            </a>
          </p>
          
          <div className="mt-4 pt-4 border-t border-[#16C79A]/20">
            <p className="text-sm text-[#16C79A]/60">
              © {new Date().getFullYear()} ShifoOnline Hospital System. All rights reserved.
            </p>
            <p className="text-xs text-[#16C79A]/40 mt-1">
              Secure access for authorized medical personnel only
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#16C79A]/60">
          <Shield className="h-4 w-4" />
          <span>256-bit SSL Encryption</span>
        </div>
      </div>
    </div>
  )
}

export default Login