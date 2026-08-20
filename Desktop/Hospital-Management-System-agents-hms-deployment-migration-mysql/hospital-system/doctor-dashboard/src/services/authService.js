import api from './api'

export const authService = {
  // Doctor login
  login: async (email, password) => {
    const response = await api.post('/auth/doctor/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      // Update localStorage with fresh data from server
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    } catch (error) {
      // Fallback to localStorage if API fails
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      // Check if data is FormData (for image upload) or regular object
      const isFormData = data instanceof FormData
      
      const config = isFormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {}
      
      const response = await api.put('/doctors/profile', data, config)
      
      // Update localStorage with new user data
      if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...response.data.user }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  },

  // Upload profile image separately (if needed)
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData()
    formData.append('profileImage', imageFile)
    
    const response = await api.post('/doctors/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (response.data.profileImageUrl) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      currentUser.profileImage = response.data.profileImageUrl
      localStorage.setItem('user', JSON.stringify(currentUser))
    }
    
    return response.data
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  // Update email notifications preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/users/notifications', preferences)
    return response.data
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete('/users/account', {
      data: { password }
    })
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null
  },

  // Get user profile from server
  getProfile: async (userId) => {
    const response = await api.get(`/doctors/${userId}/profile`)
    return response.data
  },

  // Sync local storage with server data
  syncUserData: async () => {
    try {
      const response = await api.get('/auth/me')
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
    } catch (error) {
      console.error('Sync error:', error)
      return null
    }
  },

  // For offline support - save profile locally temporarily
  saveProfileLocally: (profileData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...currentUser, ...profileData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Also save to a backup key
      localStorage.setItem('user_profile_backup', JSON.stringify(profileData))
      
      return true
    } catch (error) {
      console.error('Local save error:', error)
      return false
    }
  },

  // Get locally saved profile
  getLocalProfile: () => {
    try {
      const savedProfile = localStorage.getItem('user_profile_backup')
      return savedProfile ? JSON.parse(savedProfile) : null
    } catch (error) {
      console.error('Local load error:', error)
      return null
    }
  },

  // Clear local profile backup
  clearLocalProfile: () => {
    localStorage.removeItem('user_profile_backup')
  }
}