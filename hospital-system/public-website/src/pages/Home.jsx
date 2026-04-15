import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, Users, Stethoscope, Ambulance, 
  Calendar, Phone, ArrowRight, Sparkles, 
  Star, Target, Shield, Activity,
  CheckCircle, TrendingUp, Heart
} from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState(1254);

  useEffect(() => {
    fetchDoctors();
    // Animate appointment counter
    const timer = setTimeout(() => {
      setAppointments(1287);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/doctors');
      const doctorsWithRatings = response.data.slice(0, 4).map(doctor => ({
        ...doctor,
        rating: (Math.random() * 0.5 + 4.5).toFixed(1),
        patients: Math.floor(Math.random() * 1000) + 500,
        experience: Math.floor(Math.random() * 15) + 5,
      }));
      setDoctors(doctorsWithRatings);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Mock data for demo
      setDoctors([
        {
          _id: '1',
          name: 'Lema Tafa',
          specialization: 'Cardiology',
          rating: '4.8',
          patients: '100',
          experience: '5'
        },
        {
          _id: '2',
          name: 'Jemal Ahmed',
          specialization: 'Pediatrics',
          rating: '4.9',
          patients: '201',
          experience: '12'
        },
        {
          _id: '3',
          name: 'Mohamed Ahmed',
          specialization: 'Orthopedics',
          rating: '4.7',
          patients: '1.5k',
          experience: '18'
        },
        {
          _id: '4',
          name: 'Hirut Gari',
          specialization: 'Gynecology',
          rating: '4.9',
          patients: '80',
          experience: '2'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Emergency",
      description: "Round-the-clock emergency services",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Doctors",
      description: "Qualified and experienced specialists",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Modern Equipment",
      description: "State-of-the-art medical technology",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: <Ambulance className="h-8 w-8" />,
      title: "Ambulance Service",
      description: "Fast emergency response",
      color: "text-red-600 bg-red-50"
    }
  ];

  const stats = [
    {
      number: "200+",
      label: "Expert Doctors",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      icon: <Heart className="h-6 w-6" />
    },
    {
      number: "24/7",
      label: "Emergency Service",
      icon: <Clock className="h-6 w-6" />
    },
    {
      number: `${appointments.toLocaleString()}+`,
      label: "Appointments",
      icon: <Calendar className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-white/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Trusted Healthcare Since 1998
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Quality Healthcare{' '}
                <span className="text-blue-200 block mt-2">
                  When You Need It Most
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8">
                Book appointments with Somalia's top doctors instantly. 
                Your health is our highest priority.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
                <Link 
                  to="/doctors" 
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Our Doctors
                </Link>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-white text-sm">Same-day appointments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-white text-sm">Verified doctors only</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-white text-sm">Secure online booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-white text-sm">Insurance accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org2000/svg" viewBox="0 0 1440 120" className="w-full h-12">
            <path fill="#f8fafc" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MediCare?
            </h2>
            <p className="text-gray-600 text-lg">
              We combine modern technology with compassionate care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-blue-200"
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-full ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Expert Doctors
              </h2>
              <p className="text-gray-600 mt-2">Meet our experienced medical team</p>
            </div>
            <Link 
              to="/doctors" 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold inline-flex items-center gap-2"
            >
              View All Doctors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div 
                  key={doctor._id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
                >
                  <div className="p-6">
                    {/* Doctor Image & Info */}
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg">
                        <Users className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        Dr. {doctor.name}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mt-2">
                        {doctor.specialization}
                      </div>
                    </div>

                    {/* Rating & Experience */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">{doctor.rating}</span>
                      </div>
                      <div className="text-gray-400">•</div>
                      <div className="text-gray-600 text-sm">
                        {doctor.experience} years
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium">Patients</div>
                        <div className="text-sm font-bold text-gray-900">{doctor.patients}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium">Response</div>
                        <div className="text-sm font-bold text-gray-900">15 min</div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <Link 
                      to="/register" 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg group-hover:scale-[1.02]"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Your Health, Our Priority
            </span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Care of Your Health?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust us with their healthcare needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/doctors" 
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Ambulance className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-semibold">Emergency? Call Now:</span>
            </div>
            <a 
              href="tel:+252611234567" 
              className="text-2xl font-bold hover:text-red-200 transition-colors flex items-center gap-2"
            >
              <Phone className="h-5 w-5" />
              +251 994942373 
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;