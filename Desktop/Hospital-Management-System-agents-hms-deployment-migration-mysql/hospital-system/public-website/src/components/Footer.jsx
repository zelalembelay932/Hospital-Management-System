import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Hospital, Phone, Mail, MapPin, 
  Facebook, Twitter, Instagram, Linkedin,
  Heart, Shield, Clock, Users,
  ChevronRight, ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Doctors', path: '/doctors' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' }
  ];

  const services = [
    'Emergency Care',
    'Cardiology',
    'Neurology', 
    'Orthopedics',
    'Pediatrics',
    'General Surgery',
    'Dental Care',
    'Mental Health'
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-4 w-4" />,
      text: '+251 99 494 2373',
      href: 'tel:+251994942373'
    },
    {
      icon: <Mail className="h-4 w-4" />,
      text: 'info@medicare.so',
      href: 'mailto:info@medicare.so'
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: 'Oromia, Adama',
      href: '#'
    }
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-4 w-4" />,
      label: 'Facebook',
      href: '#',
      color: 'hover:bg-blue-600'
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      label: 'Twitter',
      href: '#',
      color: 'hover:bg-blue-400'
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      label: 'Instagram',
      href: '#',
      color: 'hover:bg-pink-600'
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      label: 'LinkedIn',
      href: '#',
      color: 'hover:bg-blue-700'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Top Section with Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Trust Badges */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold">Certified</div>
                  <div className="text-sm text-blue-100">ISO 1224:2022</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold">24/7</div>
                  <div className="text-sm text-blue-100">Emergency Care</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Need Emergency Care?</h3>
              <a 
                href="tel:+251994942373"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300 font-bold text-lg"
              >
                <Phone className="h-5 w-5" />
                Call Now: +251 994942373 
              </a>
            </div>

            {/* Social Media */}
            <div className="flex justify-center md:justify-end gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-3 bg-white/10 rounded-full hover:bg-white/20 ${social.color} transition-all duration-300`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Hospital Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                <Hospital className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  MediCare <span className="text-blue-400">Hospital</span>
                </h2>
                <p className="text-blue-300 text-sm">Excellence in Healthcare</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Providing world-class healthcare services with compassion and innovation 
              since 1995. Your health is our highest priority.
            </p>
            <div className="flex items-center gap-2 text-blue-300">
              <Users className="h-4 w-4" />
              <span className="text-sm">Serving 50,000+ patients annually</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-blue-800/50 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <ChevronRight className="h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-blue-800/50 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-blue-400" />
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-blue-800/50 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-blue-400" />
              Contact Us
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white group transition-colors duration-200"
                >
                  <div className="p-2 bg-blue-900/50 rounded-lg group-hover:bg-blue-800 transition-colors">
                    <div className="text-blue-400 group-hover:text-white">
                      {info.icon}
                    </div>
                  </div>
                  <span className="group-hover:text-blue-300">{info.text}</span>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-8 pt-6 border-t border-blue-800/50">
              <h4 className="text-sm font-semibold mb-3 text-blue-300">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-blue-900/50 border border-blue-800 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-800/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} ETH MediCare Hospital. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-xs text-gray-500">
                <a href="/privacy" className="hover:text-blue-300">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-blue-300">Terms of Service</a>
                <span>•</span>
                <a href="/cookies" className="hover:text-blue-300">Cookie Policy</a>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Heart className="h-4 w-4 text-red-400 fill-red-400" />
              <span>Designed with care for better healthcare</span>
            </div>
            
            <div className="text-center md:text-right text-xs text-gray-500">
              <p>Accredited by ETH Medical Association</p>
              <p className="mt-1">License No: ETH-2022-0123</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;