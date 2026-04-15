import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, 
  Send, AlertTriangle, Navigation,
  MessageSquare, User, FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formspree.io/f/xpqawngr", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
          _subject: `New Contact Form: ${formData.subject}`
        })
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll contact you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Emergency & General",
      details: ["+251 994942373 ", "+251 994942373 "],
      description: "24/7 emergency line",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Address",
      details: ["info@medicare.so", "support@medicare.so"],
      description: "We respond within 24 hours",
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      details: ["KM4 04 Road", "Oromia, Adama"],
      description: "Main branch",
      color: "bg-red-50 text-red-600 border-red-100"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Working Hours",
      details: ["Mon - Fri: 12:00 AM - 12:00 PM", "Sat - Sun: 12:00 AM - 12:00 AM"],
      description: "Emergency services available 24/7",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
       
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-white">Us</span>
          </h1>
          <p className="text-gray-50 text-lg max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you with all your healthcare needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl shadow-lg p-6 border ${info.color} hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${info.color.split(' ')[0]} bg-opacity-20`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-3">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">🚨 Emergency Contact</h3>
              </div>
              
              <p className="text-red-100 mb-6">
                For life-threatening emergencies, call immediately:
              </p>
              
              <a 
                href="tel:+252611234567" 
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold text-xl shadow-lg"
              >
                <Phone className="h-6 w-6" />
                +251 994942373 
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            {/* Contact Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mb-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        className="w-full bg-gradient-to-r from-blue-50/50 to-blue-50/30 border border-blue-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-blue-300"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        className="w-full bg-gradient-to-r from-blue-50/50 to-blue-50/30 border border-blue-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-blue-300"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      className="w-full bg-gradient-to-r from-blue-50/50 to-blue-50/30 border border-blue-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-blue-300"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors mt-1" />
                    </div>
                    <textarea
                      name="message"
                      className="w-full bg-gradient-to-r from-blue-50/50 to-blue-50/30 border border-blue-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-blue-300 min-h-[200px] resize-none"
                      placeholder="Your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      Send Message
                      <Send className="h-5 w-5" />
                    </div>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;