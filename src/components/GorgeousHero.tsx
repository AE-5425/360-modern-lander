import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Chip, Avatar, useTheme, alpha, useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Star, Shield, Zap, Heart, Users, DollarSign, Clock, 
  CheckCircle, TrendingUp, ArrowRight, Award, 
  Calendar, Lock, Target, Sparkles, Eye, Phone
} from 'lucide-react';

const MagicalHealthcareHero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Enhanced mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "Found the perfect plan and saved $3,600 per year! The process was incredibly easy.",
      author: "Sarah J.",
      location: "Tampa, FL",
      savings: "$3,600",
      avatar: "SJ"
    },
    {
      text: "As a freelancer, I thought good insurance was out of reach. Help Find Healthcare proved me wrong.",
      author: "Mike R.",
      location: "Austin, TX", 
      savings: "$2,400",
      avatar: "MR"
    },
    {
      text: "The tax credit calculations were spot-on. Saved me hours of research and thousands.",
      author: "Jennifer C.",
      location: "Orlando, FL",
      savings: "$4,200",
      avatar: "JC"
    }
  ];

  const trustFeatures = [
    { icon: Shield, text: 'HIPAA Secure', color: '#10b981', desc: 'Bank-level encryption' },
    { icon: Zap, text: 'Instant Quotes', color: '#3b82f6', desc: 'Get prices in 5 minutes' },
    { icon: Award, text: '4.9★ Rating', color: '#f59e0b', desc: '50,000+ happy families' },
    { icon: Lock, text: 'Licensed', color: '#ef4444', desc: 'All 50 states' }
  ];

  const urgencyInfo = {
    title: "2024 Plans Available Now",
    subtitle: "Open Enrollment ends December 15th",
    daysLeft: Math.max(0, Math.ceil((new Date('2024-12-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  };

  const carriers = [
    { name: 'Ambetter', logo: '/logos/Ambetter_Logo.webp' },
    { name: 'Blue Cross Blue Shield', logo: '/logos/blue_cross_blue_shield_Logo.webp' },
    { name: 'Anthem', logo: '/logos/Anthem_Logo.webp' },
    { name: 'Cigna', logo: '/logos/cigna_Logo.webp' },
    { name: 'Oscar Health', logo: '/logos/Oscar_Health_logo.webp' },
    { name: 'UnitedHealthcare', logo: '/logos/UnitedHealthcare_Logo.webp' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: isDark 
          ? `linear-gradient(135deg, 
              ${theme.palette.grey[900]} 0%, 
              ${theme.palette.grey[800]} 50%,
              ${theme.palette.grey[900]} 100%
            )`
          : `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.06)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.08)} 50%,
              ${alpha(theme.palette.primary.main, 0.06)} 100%
            )`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        // Interactive mouse-following background
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              ${alpha(theme.palette.primary.main, isDark ? 0.15 : 0.1)} 0%, 
              transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              ${alpha(theme.palette.secondary.main, isDark ? 0.12 : 0.08)} 0%, 
              transparent 50%)
          `,
          transition: 'background 0.3s ease',
          pointerEvents: 'none',
          zIndex: 0,
        },
        // Animated pattern overlay
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.slice(1)}' fill-opacity='${isDark ? '0.03' : '0.02'}'%3E%3Cpath d='M30 30h30v30H30zM0 0h30v30H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'backgroundFlow 20s linear infinite',
          pointerEvents: 'none',
          zIndex: 1,
        }
      }}
    >
      {/* Floating Interactive Particles */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 5) % 60}%`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: isDark 
                ? 'rgba(255, 255, 255, 0.4)' 
                : alpha(theme.palette.primary.main, 0.3),
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              x: [0, Math.sin(i) * 10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content - Enhanced with healthcare conversion psychology */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
              {/* Urgent Trust Badge with Timer */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: { xs: 'center', lg: 'flex-start' }
                }}>
                  <Chip
                    icon={
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Star style={{ color: '#fbbf24' }} />
                      </motion.div>
                    }
                    label="Trusted by 50,000+ families nationwide"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: isDark 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: isDark 
                        ? '2px solid rgba(255, 255, 255, 0.2)' 
                        : '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      borderRadius: '50px',
                      color: isDark ? 'white' : theme.palette.text.primary,
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Chip
                      icon={<Calendar style={{ color: '#ef4444' }} />}
                      label={`${urgencyInfo.daysLeft} days left to enroll`}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50px',
                        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                      }}
                    />
                  </motion.div>
                </Box>
              </motion.div>

              {/* Powerful Healthcare-Focused Headline */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 60 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    mb: 3,
                    color: isDark ? 'white' : theme.palette.text.primary,
                    textShadow: isDark 
                      ? '0 2px 20px rgba(0, 0, 0, 0.5)' 
                      : '0 2px 20px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Save{' '}
                  <Box 
                    component="span" 
                    sx={{ 
                      background: `linear-gradient(135deg, #10b981, #059669)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-5px',
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '2px',
                        opacity: 0.6,
                      }
                    }}
                  >
                    $2,400+
                  </Box>{' '}
                  on Health Insurance This Year
                </Typography>
              </motion.div>

              {/* Benefit-Focused Subheadline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    fontWeight: 500,
                    color: isDark ? 'grey.300' : theme.palette.text.secondary,
                    mb: 5,
                    lineHeight: 1.6,
                    maxWidth: '650px',
                    mx: { xs: 'auto', lg: 0 },
                  }}
                >
                  Get your personalized health insurance quote in{' '}
                  <Box component="span" sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 700 
                  }}>
                    under 5 minutes
                  </Box>. 
                  Compare plans from top carriers and find coverage that fits your budget and needs.
                </Typography>
              </motion.div>

              {/* Enhanced Trust Features with Animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Grid container spacing={2} sx={{ mb: 6 }}>
                  {trustFeatures.map((feature, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.8 + index * 0.1,
                          type: "spring",
                          stiffness: 150
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Card
                          sx={{
                            textAlign: 'center',
                            p: 2,
                            background: isDark 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: isDark 
                              ? '1px solid rgba(255, 255, 255, 0.1)' 
                              : '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: feature.color,
                              boxShadow: `0 12px 40px ${feature.color}20`,
                            }
                          }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                mx: 'auto',
                                mb: 1,
                                background: `${feature.color}20`,
                                border: `2px solid ${feature.color}40`,
                              }}
                            >
                              <feature.icon size={20} style={{ color: feature.color }} />
                            </Avatar>
                          </motion.div>
                          
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 700, 
                            mb: 0.5,
                            color: isDark ? 'white' : 'text.primary'
                          }}>
                            {feature.text}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: isDark ? 'grey.400' : 'text.secondary',
                            fontSize: '0.75rem'
                          }}>
                            {feature.desc}
                          </Typography>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* Enhanced CTAs with Conversion Focus */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  mb: 6
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={Link}
                      to="/enroll"
                      variant="contained"
                      size="large"
                      endIcon={
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight size={24} />
                        </motion.div>
                      }
                      sx={{
                        px: 6,
                        py: 3,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        borderRadius: '60px',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                        textTransform: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          transition: 'left 0.5s ease',
                        },
                        '&:hover::before': {
                          left: '100%',
                        }
                      }}
                    >
                      See My Plans & Prices
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      href="tel:1-800-555-0123"
                      variant="outlined"
                      size="large"
                      startIcon={<Phone size={20} />}
                      sx={{
                        px: 5,
                        py: 3,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '60px',
                        borderWidth: 2,
                        background: isDark 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        color: isDark ? 'white' : theme.palette.text.primary,
                        borderColor: isDark 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : theme.palette.primary.main,
                        textTransform: 'none',
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                          background: isDark 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(255, 255, 255, 1)',
                        }
                      }}
                    >
                      Call Expert
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>

              {/* Enhanced Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  gap: 3,
                  flexWrap: 'wrap',
                  mb: 4
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4 + i * 0.1 }}
                      >
                        <Star size={18} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      </motion.div>
                    ))}
                    <Typography variant="body2" sx={{ 
                      ml: 1, 
                      fontWeight: 600,
                      color: isDark ? 'grey.300' : 'text.secondary'
                    }}>
                      4.9/5 from 12,000+ reviews
                    </Typography>
                  </Box>
                  <Chip 
                    label="✓ Free to compare"
                    size="small"
                    sx={{ 
                      background: '#10b981',
                      color: 'white',
                      fontWeight: 600 
                    }}
                  />
                  <Chip 
                    label="✓ No hidden fees"
                    size="small" 
                    sx={{ 
                      background: '#3b82f6',
                      color: 'white',
                      fontWeight: 600 
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* Right Content - Enhanced Visual Elements */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ 
              position: 'relative',
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4,
              alignItems: 'center'
            }}>
              {/* Main Visual Card with Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.5, type: "spring", stiffness: 80 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: -2,
                  transition: { duration: 0.3 }
                }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.2)',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    backdropFilter: 'blur(20px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                      zIndex: 1,
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="/images/hero-couple.jpg"
                    alt="Happy couple with health insurance"
                    sx={{
                      width: { xs: '100%', sm: '450px' },
                      height: { xs: '300px', sm: '350px' },
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  />
                  
                  {/* Floating Success Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      zIndex: 3,
                    }}
                  >
                    <Chip
                      icon={<CheckCircle size={18} />}
                      label="HIPAA Secure"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        px: 3,
                        py: 2,
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        borderRadius: '50px',
                        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  </motion.div>

                  {/* Floating Savings Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2, type: "spring", stiffness: 120 }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      zIndex: 3,
                    }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        px: 3,
                        py: 2,
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <DollarSign size={20} style={{ color: '#10b981' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                          Avg. Savings
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                          $2,400/year
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                </Card>
              </motion.div>

              {/* Animated Testimonial Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                style={{ width: '100%', maxWidth: '500px' }}
              >
                <Card
                  sx={{
                    background: isDark 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(30px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    p: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                        ))}
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 3, 
                          fontStyle: 'italic',
                          color: isDark ? 'grey.200' : 'text.primary',
                          lineHeight: 1.6
                        }}
                      >
                        "{testimonials[currentTestimonial].text}"
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {testimonials[currentTestimonial].avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600,
                              color: isDark ? 'white' : 'text.primary'
                            }}>
                              {testimonials[currentTestimonial].author}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: isDark ? 'grey.400' : 'text.secondary' 
                            }}>
                              {testimonials[currentTestimonial].location}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Chip
                          label={`Saved ${testimonials[currentTestimonial].savings}`}
                          size="small"
                          sx={{
                            background: '#10b981',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Testimonial indicators */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 1, 
                    mt: 3 
                  }}>
                    {testimonials.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{ 
                          scale: currentTestimonial === index ? 1.2 : 1,
                          opacity: currentTestimonial === index ? 1 : 0.5
                        }}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: theme.palette.primary.main,
                          cursor: 'pointer'
                        }}
                        onClick={() => setCurrentTestimonial(index)}
                      />
                    ))}
                  </Box>
                </Card>
              </motion.div>

              {/* Enhanced Carrier Showcase */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.8 }}
                style={{ width: '100%' }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 3, 
                    fontWeight: 600,
                    color: isDark ? 'grey.400' : 'text.secondary'
                  }}
                >
                  Compare plans from top carriers:
                </Typography>
                
                <Box sx={{ 
                  overflow: 'hidden',
                  borderRadius: '16px',
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  p: 2
                }}>
                  <motion.div
                    animate={{ x: [0, -(120 * carriers.length)] }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                      },
                    }}
                    style={{ display: 'flex', gap: '20px' }}
                  >
                    {[...carriers, ...carriers].map((carrier, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        style={{ minWidth: '100px', height: '60px' }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100px',
                            height: '60px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 1)',
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={carrier.logo}
                            alt={`${carrier.name} logo`}
                            sx={{
                              maxHeight: '40px',
                              maxWidth: '80px',
                              objectFit: 'contain'
                            }}
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </motion.div>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced keyframes */}
      <style jsx>{`
        @keyframes backgroundFlow {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-10px) translateY(-5px); }
          50% { transform: translateX(-5px) translateY(-10px); }
          75% { transform: translateX(-15px) translateY(-2px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default MagicalHealthcareHero;