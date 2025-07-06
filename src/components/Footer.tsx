import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Clock, 
  Users, 
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const companyInfo = {
    name: '360 Insurance Group',
    tagline: 'We have you covered',
    description: 'Making health insurance simple and affordable for independent workers nationwide.',
    phone: '1-800-555-0123',
    email: 'matt.biallas@360fgllc.com',
    address: '123 Insurance Way, Tampa, FL 33601'
  };

  const navigationLinks = [
    { name: 'Get Quote', href: '/quote' },
    { name: 'Browse Plans', href: '/plans' },
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  const resourceLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Insurance Guides', href: '/guides' },
    { name: 'Gig Worker Resources', href: '/resources' },
    { name: 'Tax Information', href: '/tax-info' },
    { name: 'State Regulations', href: '/regulations' },
    { name: 'Carrier Network', href: '/network' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'License Information', href: '/licenses' },
    { name: 'Sitemap', href: '/sitemap' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/360insurance', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com/360insurance', icon: Twitter },
    { name: 'Instagram', href: 'https://instagram.com/360insurance', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/360insurance', icon: Linkedin }
  ];

  const trustBadges = [
    { icon: Shield, label: 'SSL Secured', color: 'text-green-500' },
    { icon: Users, label: '25,000+ Customers', color: 'text-blue-500' },
    { icon: Star, label: '4.9/5 Rating', color: 'text-yellow-500' },
    { icon: Clock, label: '90 Second Process', color: 'text-emerald-500' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Company Information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{companyInfo.name}</h3>
                  <p className="text-blue-300 font-medium">{companyInfo.tagline}</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                {companyInfo.description}
              </p>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call us anytime</p>
                    <a 
                      href={`tel:${companyInfo.phone}`} 
                      className="text-white hover:text-blue-300 transition-colors font-semibold"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email support</p>
                    <a 
                      href={`mailto:${companyInfo.email}`} 
                      className="text-white hover:text-green-300 transition-colors font-semibold"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Visit our office</p>
                    <span className="text-white font-semibold">{companyInfo.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {navigationLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Resources */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="text-lg font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Social Media and Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Social Links */}
            <div>
              <h5 className="text-sm font-semibold text-gray-300 mb-4 text-center lg:text-left">
                Follow Us for Updates
              </h5>
              <div className="flex space-x-4 justify-center lg:justify-start">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="text-center lg:text-right">
              <h5 className="text-sm font-semibold text-gray-300 mb-4">
                Get Health Insurance Tips
              </h5>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-800/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                </div>
                <span className="text-sm text-gray-300 font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center lg:text-left">
              <p className="mb-1">
                © {currentYear} {companyInfo.name}. All rights reserved.
              </p>
              <p className="text-xs">
                Licensed insurance agency. Not affiliated with any government agency.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm">
              {legalLinks.slice(0, 4).map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center leading-relaxed max-w-4xl mx-auto">
              <strong>Important:</strong> 360 Insurance Group is a licensed insurance marketplace connecting consumers with licensed insurance agents. 
              We do not sell insurance directly. All quotes are estimates and subject to underwriting approval. 
              By using this website, you consent to receive communications from our licensed agents and partner carriers. 
              Standard message and data rates may apply. You may opt out at any time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;