import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message)
      throw new Error('Request timeout. Please check your connection.')
    }
    
    if (!error.response) {
      console.error('Network error:', error.message)
      throw new Error('Network error. Please check your connection.')
    }
    
    // Handle specific error messages
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Something went wrong'
    
    throw new Error(errorMessage)
  }
)

export default api