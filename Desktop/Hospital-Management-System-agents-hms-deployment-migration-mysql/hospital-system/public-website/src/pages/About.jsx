import React from "react";
import {
  Heart,
  Users,
  Award,
  Hospital,
  Shield,
  Stethoscope,
  HandHeart,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  Target,
  Activity,
  Clock,
  Star,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Globe,
  ShieldCheck,
  Users as UsersIcon
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    {
      number: "25+",
      label: "Years Experience",
      icon: <Award className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      number: "50+",
      label: "Expert Doctors",
      icon: <Stethoscope className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      number: "10K+",
      label: "Happy Patients",
      icon: <Users className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      number: "24/7",
      label: "Emergency Service",
      icon: <Hospital className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-600"
    },
  ];

  const values = [
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Patient-Centered Care",
      description: "We put patients at the heart of everything we do, ensuring personalized and compassionate treatment.",
      color: "text-red-500 bg-red-50"
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Medical Excellence",
      description: "Our team of specialists provides world-class medical care using advanced technology and best practices.",
      color: "text-blue-500 bg-blue-50"
    },
    {
      icon: <HandHeart className="h-10 w-10" />,
      title: "Community Focus",
      description: "Committed to serving our community with affordable, accessible, and high-quality healthcare.",
      color: "text-green-500 bg-green-50"
    },
  ];

  const facilities = [
    {
      title: "Advanced Diagnostics",
      description: "Equipped with modern MRI, CT Scan, and digital X-ray machines for accurate diagnosis.",
      icon: <Activity className="h-8 w-8" />
    },
    {
      title: "Modern Operation Theaters",
      description: "Sterile, technologically advanced operation rooms for complex surgical procedures.",
      icon: <Target className="h-8 w-8" />
    },
    {
      title: "Intensive Care Units",
      description: "24/7 monitored ICUs with life support systems and expert critical care teams.",
      icon: <Heart className="h-8 w-8" />
    },
  ];

  const accreditations = [
    {
      name: "ISO 9001",
      description: "Quality Management",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "JCI",
      description: "International Standards",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: "WHO",
      description: "World Health Standards",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-white/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Trusted Since 1998
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-blue-200">MediCare</span> Hospital
            </h1>
            
            <p className="text-xl text-blue-100 mb-8">
              Providing exceptional healthcare services with compassion and excellence for over 25 years
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              
              <Link
                to="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-12">
            <path fill="#f8fafc" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
                <Hospital className="h-4 w-4" />
                <span className="text-sm font-medium">Our Story</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                A Legacy of Healing & Innovation
              </h2>
              
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Founded in 1998, MediCare Hospital started as a small clinic with a big vision: 
                  to provide world-class healthcare accessible to everyone. Today, we have grown into 
                  one of the leading healthcare institutions in the country.
                </p>
                
                <p>
                  Our journey has been marked by continuous growth, innovation, and an unwavering 
                  commitment to medical excellence. We've expanded our services, invested in 
                  state-of-the-art technology, and assembled a team of the finest medical professionals.
                </p>
                
                <p>
                  What sets us apart is our dedication to patient-centered care. We believe that 
                  every patient deserves personalized attention, respect, and the highest quality 
                  medical treatment available.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Hospital Building"
                className="rounded-2xl shadow-xl w-full"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Since 1998</h4>
                    <p className="text-gray-600">Serving with excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-gray-600 text-lg">Milestones that define our journey</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                To provide exceptional, patient-centered healthcare services that improve 
                the quality of life for individuals and families in our community.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Deliver compassionate and comprehensive care</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Utilize advanced medical technology</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Maintain the highest standards of medical ethics</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                To be the leading healthcare institution, recognized for excellence in patient 
                care, medical innovation, and community service.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Pioneer medical innovations in healthcare</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Expand access to specialized care</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Train the next generation of healthcare professionals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg">These principles guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-full ${value.color} bg-opacity-20`}>
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Modern Facilities</h2>
            <p className="text-blue-200 text-lg">State-of-the-art technology for advanced healthcare</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <div className="text-white">{facility.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{facility.title}</h3>
                </div>
                <p className="text-blue-100">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 border border-blue-100 shadow-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Experience Excellence</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Experience Healthcare Excellence
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have trusted us with their health and wellness. 
              Book an appointment today and experience the MediCare difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
                <ChevronRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/contact"
                className="px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Accredited by International Healthcare Standards
            </h3>
            <p className="text-gray-600">Recognized for excellence worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accreditations.map((accred, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${accred.bgColor} border-transparent text-center`}>
                <div className={`text-3xl font-bold ${accred.color} mb-2`}>{accred.name}</div>
                <p className="text-gray-600 font-medium">{accred.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;