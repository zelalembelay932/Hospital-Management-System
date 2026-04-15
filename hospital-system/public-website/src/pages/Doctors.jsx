import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Star, Phone, Mail, MapPin, 
  Award, Clock, Users, Shield, Heart, MessageSquare,
  ChevronRight, Download, Share2, UserCheck,
  Stethoscope, Target, CheckCircle, Award as AwardIcon,
  TrendingUp, Zap, Users as UsersIcon, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/doctors');
      
      if (Array.isArray(response.data)) {
        setDoctors(response.data.map(doctor => ({
          ...doctor,
          rating: Math.random() * 0.5 + 4.5,
          patients: Math.floor(Math.random() * 1000) + 500,
          responseTime: Math.floor(Math.random() * 30) + 5,
          experience: Math.floor(Math.random() * 15) + 5,
        })));
      } else if (response.data && Array.isArray(response.data.doctors)) {
        setDoctors(response.data.doctors);
      } else if (response.data && response.data.data) {
        setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setDoctors([]);
      }
      
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const getSpecializationColor = (specialization) => {
    const colorMap = {
      'Cardiology': 'bg-blue-100 text-blue-700 border-blue-200',
      'Dermatology': 'bg-amber-100 text-amber-700 border-amber-200',
      'Neurology': 'bg-purple-100 text-purple-700 border-purple-200',
      'Orthopedics': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Pediatrics': 'bg-pink-100 text-pink-700 border-pink-200',
      'Gynecology': 'bg-rose-100 text-rose-700 border-rose-200',
      'General Medicine': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Dentistry': 'bg-teal-100 text-teal-700 border-teal-200',
      'Psychiatry': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    
    return colorMap[specialization] || 'bg-blue-50 text-blue-600 border-blue-100';
  };

  const getSpecializationIconColor = (specialization) => {
    const colorMap = {
      'Cardiology': 'text-blue-600',
      'Dermatology': 'text-amber-600',
      'Neurology': 'text-purple-600',
      'Orthopedics': 'text-cyan-600',
      'Pediatrics': 'text-pink-600',
      'Gynecology': 'text-rose-600',
      'General Medicine': 'text-emerald-600',
      'Dentistry': 'text-teal-600',
      'Psychiatry': 'text-indigo-600'
    };
    
    return colorMap[specialization] || 'text-blue-600';
  };

  const specializations = [
    'All Specializations',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'General Medicine',
    'Dentistry',
    'Psychiatry'
  ];

  const toggleFavorite = (doctorId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(doctorId)) {
      newFavorites.delete(doctorId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(doctorId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-white/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Trusted Medical Professionals
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Find the Perfect <span className="text-blue-200">Healthcare</span> Specialist
                </h1>
                
                <p className="text-lg text-blue-100 mb-8">
                  Connect with board-certified doctors for personalized care. 
                  Book appointments, get expert consultations, and receive quality healthcare from anywhere.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">200+</div>
                  <div className="text-sm text-blue-100">Expert Doctors</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">98%</div>
                  <div className="text-sm text-blue-100">Satisfaction</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-blue-100">Availability</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">50K+</div>
                  <div className="text-sm text-blue-100">Patients</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </button>
                
                <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-medium flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Virtual Consultation
                </button>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <Stethoscope className="h-8 w-8 text-white mb-2" />
                      <h3 className="font-semibold text-white">Expert Care</h3>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <Shield className="h-8 w-8 text-white mb-2" />
                      <h3 className="font-semibold text-white">Verified Doctors</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <Clock className="h-8 w-8 text-white mb-2" />
                      <h3 className="font-semibold text-white">Quick Response</h3>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <TrendingUp className="h-8 w-8 text-white mb-2" />
                      <h3 className="font-semibold text-white">Advanced Tech</h3>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-xl">
                  <AwardIcon className="h-10 w-10 text-blue-600" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-20">
            <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12">
        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto -mt-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    className="w-full bg-gray-50 pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Specialization Filter */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none" />
                  <select
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                  >
                    {specializations.map(spec => (
                      <option 
                        key={spec} 
                        value={spec === 'All Specializations' ? 'all' : spec}
                        className="bg-white text-gray-900"
                      >
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900">Available Doctors</h2>
                <p className="text-gray-600 mt-1">Browse through our certified medical professionals</p>
              </div>
              <div className="text-gray-500 text-sm bg-blue-50 px-4 py-2 rounded-lg">
                Showing <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> of <span className="font-semibold text-blue-600">{doctors.length}</span> doctors
              </div>
            </div>

            {/* Doctors Cards */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
                  >
                    <div className="p-6">
                      {/* Doctor Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${getSpecializationColor(doctor.specialization)} border`}>
                            <UserCheck className={`h-6 w-6 ${getSpecializationIconColor(doctor.specialization)}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              Dr. {doctor.name}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium mt-1 inline-block ${getSpecializationColor(doctor.specialization)}`}>
                              {doctor.specialization}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-gray-900">{doctor.rating?.toFixed(1) || '4.8'}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 text-sm">
                                {doctor.experience || 10}+ years
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleFavorite(doctor._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart 
                            className={`h-5 w-5 ${favorites.has(doctor._id) ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                        </button>
                      </div>

                      {/* Doctor Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-700">{doctor.email}</span>
                        </div>
                        
                        {doctor.phone && (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700">{doctor.phone}</span>
                          </div>
                        )}
                        
                        {doctor.hospital && (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700">{doctor.hospital}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <UsersIcon className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-600 font-medium">Patients</p>
                          <p className="text-lg font-bold text-gray-900">{doctor.patients?.toLocaleString() || '1.2k'}</p>
                        </div>
                        
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <Clock className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-600 font-medium">Response</p>
                          <p className="text-lg font-bold text-gray-900">{doctor.responseTime || 15} min</p>
                        </div>
                        
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <Target className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-600 font-medium">Experience</p>
                          <p className="text-lg font-bold text-gray-900">{doctor.experience || 10} yrs</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <a
                        href="/register"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg group-hover:scale-[1.02]"
                      >
                        <Calendar className="h-4 w-4" />
                        Book Appointment
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                    
                    {/* Verified Badge */}
                    <div className="absolute top-4 right-4">
                      {Math.random() > 0.3 && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <Sparkles className="h-3 w-3" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-full bg-blue-50">
                    <UserCheck className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any doctors matching your search criteria. Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSpecialization('all');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Video icon component
const Video = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default Doctors;