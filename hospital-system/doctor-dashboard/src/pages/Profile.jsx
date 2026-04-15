import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Phone, MapPin, Briefcase, Award, Calendar, 
  Save, Upload, Camera, Edit2, Check, X, Lock, Bell, Trash2,
  Stethoscope, DollarSign, Building, GraduationCap, Settings,
  CheckCircle, XCircle, AlertTriangle, Clock, Users, Star,
  Target, Zap, Download, Share2, Printer, Heart, Shield,
  CreditCard, Globe, Moon, LogOut, Eye, EyeOff, Activity
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    address: '',
    bio: '',
    hospital: ''
  })

  // Stats data
  const [stats] = useState({
    totalPatients: 1248,
    rating: 4.8,
    completionRate: 95,
    responseTime: '15 min'
  })

  // Services data
  const [services] = useState([
    'General Consultation',
    'Follow-up Visits',
    'Telemedicine',
    'Emergency Care',
    'Health Checkup'
  ])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        qualification: user.qualification || '',
        experience: user.experience || '',
        consultationFee: user.consultationFee || '',
        address: user.address || '',
        bio: user.bio || '',
        hospital: user.hospital || ''
      })
      
      if (user.profileImage) {
        setPreviewImage(user.profileImage)
      }
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const startEditing = (field, value) => {
    setEditingField(field)
    setTempValue(value)
  }

  const saveEdit = (field) => {
    setFormData(prev => ({ ...prev, [field]: tempValue }))
    setEditingField(null)
    toast.success(`${field} updated successfully!`)
  }

  const cancelEdit = () => {
    setEditingField(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        toast.success('Profile image updated!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })
      
      if (profileImage) {
        data.append('profileImage', profileImage)
      }

      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const updatedUser = { ...user, ...formData }
      if (previewImage && previewImage.startsWith('data:')) {
        updatedUser.profileImage = previewImage
      }
      
      updateUser(updatedUser)
      toast.success('Profile updated successfully!')
      
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const ProfileField = ({ icon, label, value, fieldName, type = 'text', editable = true }) => {
    const isEditing = editingField === fieldName

    return (
      <div className={`flex items-start gap-4 p-4 transition-all duration-300 ${
        !isEditing ? 'hover:bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10' : ''
      }`}>
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
          {React.cloneElement(icon, { className: "h-5 w-5 text-[#16C79A]" })}
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#16C79A]/80 mb-1">
            {label}
          </label>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 border border-[#16C79A]/30 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#16C79A] focus:border-[#16C79A] transition-all duration-300"
                autoFocus
              />
              <button
                onClick={() => saveEdit(fieldName)}
                className="p-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">
                {value || 'Not provided'}
              </p>
              
              {editable && fieldName !== 'email' && (
                <button
                  onClick={() => startEditing(fieldName, value)}
                  className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-lg transition-all duration-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-[#16C79A]/80">Manage your professional profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Image & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl p-6 sticky top-6">
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-[#16C79A]/30 shadow-2xl mx-auto">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#16C79A] to-[#11698E] flex items-center justify-center">
                      <User className="h-20 w-20 text-white" />
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-2 right-6 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white p-2 rounded-full shadow-lg cursor-pointer hover:opacity-90 transition-all duration-300">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              <h2 className="text-xl font-bold mt-4 text-white">Dr. {formData.name}</h2>
              <p className="text-[#16C79A]">{formData.specialization}</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] px-3 py-1 rounded-full text-sm border border-[#16C79A]/30">
                <CheckCircle className="h-4 w-4" />
                Verified Doctor
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#16C79A]/80">Consultation Fee</p>
                    <p className="text-xl font-bold text-white">Birr -{formData.consultationFee || '0'}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#16C79A]" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#16C79A]/80">Experience</p>
                    <p className="text-xl font-bold text-white">{formData.experience || '0'} years</p>
                  </div>
                  <Award className="h-8 w-8 text-[#16C79A]" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#16C79A]/80">Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-bold text-white">{stats.rating}</p>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#16C79A]/80">Patients</p>
                    <p className="text-xl font-bold text-white">{stats.totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-[#16C79A]" />
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-white">Availability Status</h3>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-lg border border-[#16C79A]/20">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-[#16C79A] rounded-full animate-pulse"></div>
                  <span className="font-medium text-white">Available Today</span>
                </div>
                <button className="text-sm text-[#16C79A] hover:text-white transition-all duration-300">
                  Edit Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Editable Fields */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl">
            {/* Personal Information */}
            <div className="p-6 border-b border-[#16C79A]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                  <User className="h-6 w-6 text-[#16C79A]" />
                </div>
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              </div>
              <div className="space-y-1">
                <ProfileField
                  icon={<User />}
                  label="Full Name"
                  value={formData.name}
                  fieldName="name"
                />
                
                <ProfileField
                  icon={<Mail />}
                  label="Email Address"
                  value={formData.email}
                  fieldName="email"
                  editable={false}
                />
                
                <ProfileField
                  icon={<Phone />}
                  label="Phone Number"
                  value={formData.phone}
                  fieldName="phone"
                  type="tel"
                />
                
                <ProfileField
                  icon={<MapPin />}
                  label="Address"
                  value={formData.address}
                  fieldName="address"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="p-6 border-b border-[#16C79A]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                  <Briefcase className="h-6 w-6 text-[#16C79A]" />
                </div>
                <h2 className="text-xl font-semibold text-white">Professional Information</h2>
              </div>
              <div className="space-y-1">
                <ProfileField
                  icon={<Stethoscope />}
                  label="Specialization"
                  value={formData.specialization}
                  fieldName="specialization"
                />
                
                <ProfileField
                  icon={<GraduationCap />}
                  label="Qualification"
                  value={formData.qualification}
                  fieldName="qualification"
                />
                
                <ProfileField
                  icon={<Award />}
                  label="Years of Experience"
                  value={formData.experience}
                  fieldName="experience"
                  type="number"
                />
                
                <ProfileField
                  icon={<DollarSign />}
                  label="Consultation Fee ($)"
                  value={formData.consultationFee}
                  fieldName="consultationFee"
                  type="number"
                />
                
                <ProfileField
                  icon={<Building />}
                  label="Hospital/Clinic"
                  value={formData.hospital}
                  fieldName="hospital"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                  <Activity className="h-6 w-6 text-[#16C79A]" />
                </div>
                <h2 className="text-xl font-semibold text-white">Professional Bio</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#16C79A]/80 mb-2">
                    About You
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 border border-[#16C79A]/30 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#16C79A] focus:border-[#16C79A] transition-all duration-300"
                    placeholder="Tell patients about your expertise, experience, and approach to healthcare..."
                  />
                  <p className="text-sm text-[#16C79A]/60 mt-1">
                    {formData.bio.length}/1000 characters
                  </p>
                </div>

                {/* Services */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {services.map(service => (
                      <span key={service} className="px-3 py-1 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] rounded-full text-sm border border-[#16C79A]/30">
                        {service}
                      </span>
                    ))}
                    <button className="px-3 py-1 border border-dashed border-[#16C79A]/30 text-[#16C79A] rounded-full text-sm hover:border-[#16C79A] transition-all duration-300">
                      + Add Service
                    </button>
                  </div>
                </div>

                {/* Education & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Education</h3>
                    <textarea
                      placeholder="Add your educational background..."
                      className="w-full bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 border border-[#16C79A]/30 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#16C79A] focus:border-[#16C79A] transition-all duration-300"
                      rows={3}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Certifications</h3>
                    <textarea
                      placeholder="Add your certifications..."
                      className="w-full bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 border border-[#16C79A]/30 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#16C79A] focus:border-[#16C79A] transition-all duration-300"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>

          {/* Account Settings */}
          <div className="mt-8 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-6 w-6 text-[#16C79A]" />
              <h2 className="text-xl font-semibold text-white">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                    <Lock className="h-5 w-5 text-[#16C79A]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Change Password</p>
                    <p className="text-sm text-[#16C79A]/80">Update your account password</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-[#16C79A] text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                    <Bell className="h-5 w-5 text-[#16C79A]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-[#16C79A]/80">Manage email preferences</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-[#16C79A] text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300">
                  Manage
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-red-400">Delete Account</p>
                    <p className="text-sm text-red-400/80">Permanently delete your account</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-xl hover:bg-gradient-to-r from-red-500/10 to-red-600/10 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Account</h3>
              <p className="text-[#16C79A]/80">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-[#16C79A] text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete account
                  toast.success('Account deleted successfully')
                  setShowDeleteModal(false)
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all duration-300"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile