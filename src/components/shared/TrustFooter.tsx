import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, CheckCircle, Star, Users } from 'lucide-react';

interface TrustFooterProps {
  darkMode?: boolean; // Added darkMode prop
}

export const TrustFooter: React.FC<TrustFooterProps> = ({ 
  darkMode = false 
}) => {
  const trustBadges = [
    {
      icon: Shield,
      title: "SSL Secured",
      description: "256-bit encryption"
    },
    {
      icon: Lock,
      title: "HIPAA Compliant",
      description: "Protected health info"
    },
    {
      icon: Award,
      title: "Licensed Agents",
      description: "State certified"
    },
    {
      icon: Star,
      title: "4.8/5 Rating",
      description: "1000+ reviews"
    }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`mt-12 pt-8 border-t-2 transition-all duration-500 ${
        darkMode 
          ? 'border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-900/30' 
          : 'border-gray-200 bg-gradient-to-r from-gray-50/50 to-white/50'
      } rounded-2xl p-6`}
    >
      {/* Main Trust Message */}
      <div className="text-center mb-8">
        <motion.div
          className="flex justify-center mb-4"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-full p-3 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        <motion.h3
          className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-100 to-green-300 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent'
          }`}
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Your Information is Safe & Secure
        </motion.h3>
        
        <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-colors ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          We use bank-level security to protect your personal information. 
          Our licensed insurance experts are here to help you find the perfect coverage.
        </p>
      </div>

      {/* Trust Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {trustBadges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + (index * 0.1) }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className={`text-center p-4 rounded-xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-green-500/50 hover:bg-green-900/20' 
                : 'bg-white/80 border-gray-200 hover:border-green-300 hover:bg-green-50'
            } shadow-md hover:shadow-lg backdrop-blur-sm`}
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-green-400' 
                : 'bg-green-100 text-green-600'
            }`}>
              <badge.icon className="w-5 h-5" />
            </div>
            <div className={`font-semibold text-sm mb-1 transition-colors ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {badge.title}
            </div>
            <div className={`text-xs transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {badge.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-opacity-50">
        {/* Company Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className={`font-bold text-lg transition-colors ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              360 Insurance Group
            </div>
            <div className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Licensed in all 50 states
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Users className={`w-4 h-4 transition-colors ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`text-sm font-medium transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              25,000+ satisfied customers
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-4 h-4 transition-colors ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <span className={`text-sm font-medium transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No hidden fees
            </span>
          </div>
        </div>
      </div>

      {/* Fine Print */}
      <div className={`text-center mt-6 pt-4 border-t border-opacity-30 transition-colors ${
        darkMode 
          ? 'text-gray-500 border-gray-700' 
          : 'text-gray-500 border-gray-300'
      }`}>
        <p className="text-xs">
          By submitting your information, you agree to receive communications about insurance products. 
          Your information will never be sold to third parties.
        </p>
        <p className="text-xs mt-1">
          © 2025 360 Insurance Group. All rights reserved. | Licensed Insurance Agency
        </p>
      </div>
    </motion.footer>
  );
};