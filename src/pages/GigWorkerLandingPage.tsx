import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Container, Typography, Button, Grid,
  Chip, Avatar, useTheme, useMediaQuery, Stack, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Star, 
  CheckCircle, 
  ArrowRight, 
  Phone,
  Security as SecurityIcon,
  LocalHospital as HealthIcon,
  Support as SupportIcon,
  Speed as SpeedIcon,
  People as FamilyIcon,
  AttachMoney as MoneyIcon,
  Event as CalendarIcon,
  TrendingUp,
  VerifiedUser,
  AccessTime,
  DirectionsCar as Car,
  LocalShipping as Truck,
  Computer as Laptop,
  Build as Hammer,
  Business as Building,
  Groups as Users,
  Bolt as Zap,
  Email as Mail,
  WorkspacePremium as Award,
  Shield as ShieldIcon
} from '@mui/icons-material';

// Counting Animation Component
const CountingNumber: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Gig Worker Focused Carrier Carousel
const GigWorkerCarrierCarousel: React.FC = () => {
  const carriers = [
    { name: 'Ambetter', logo: '/logos/Ambetter_Logo.webp' },
    { name: 'Blue Cross Blue Shield', logo: '/logos/blue_cross_blue_shield_Logo.webp' },
    { name: 'Anthem', logo: '/logos/Anthem_Logo.webp' },
    { name: 'Cigna', logo: '/logos/cigna_Logo.webp' },
    { name: 'Oscar Health', logo: '/logos/Oscar_Health_logo.webp' },
    { name: 'UnitedHealthcare', logo: '/logos/UnitedHealthcare_Logo.webp' },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: { xs: '-80px', md: '-120px' },
        left: 0,
        right: 0,
        zIndex: 15,
        height: { xs: '160px', md: '240px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <Paper
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              mb: { xs: 3, md: 5 },
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              py: { xs: 1.5, md: 2 },
              px: { xs: 3, md: 4 },
              mx: 'auto',
              width: 'fit-content',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              Compatible with major networks nationwide
            </Typography>
          </Paper>
        </motion.div>
        
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '100px',
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
              background: 'linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)',
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(to left, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)',
            }
          }}
        >
          <motion.div
            animate={{ x: [0, -80 * carriers.length] }}
            transition={{
              x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" },
            }}
            style={{
              display: 'flex',
              gap: '80px',
              alignItems: 'center',
              width: 'fit-content',
              padding: '15px 0',
            }}
          >
            {[...carriers, ...carriers, ...carriers].map((carrier, index) => (
              <motion.div
                key={`${carrier.name}-${index}`}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    minWidth: { xs: '120px', md: '160px' },
                    height: { xs: '60px', md: '80px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: { xs: '8px', md: '12px' },
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.4)',
                  }}
                >
                  <Box
                    component="img"
                    src={carrier.logo}
                    alt={`${carrier.name} logo`}
                    sx={{
                      maxHeight: { xs: '35px', md: '50px' },
                      maxWidth: { xs: '100px', md: '140px' },
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

// Gig Worker Hero Section
const GigWorkerHero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { text: "As a freelance designer, I thought health insurance was impossible to afford. Got covered for $89/month in under 2 minutes!", author: "Mike R.", location: "Austin, TX" },
    { text: "Uber driving doesn't come with benefits, but this made finding coverage so simple", author: "Sarah T.", location: "Tampa, FL" },
    { text: "Finally found a plan that works with my irregular contractor income", author: "Carlos M.", location: "Miami, FL" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: 'url(/images/young_woman_on_laptop_and_phone.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        display: 'flex',
        alignItems: 'center',
        // Remove all margins and ensure full viewport coverage
        margin: 0,
        padding: 0,
        // Simple mildly transparent grey overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.35)',
          zIndex: 1,
        },
        // Bottom gradient fade for smooth transition to next section
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `
            linear-gradient(to top, 
              rgba(250,250,250,1) 0%,
              rgba(250,250,250,0.9) 5%,
              rgba(250,250,250,0.7) 10%, 
              rgba(250,250,250,0.5) 15%,
              rgba(250,250,250,0.3) 20%,
              rgba(250,250,250,0.15) 25%,
              rgba(250,250,250,0.08) 30%,
              rgba(250,250,250,0.04) 35%,
              transparent 40%
            )
          `,
          zIndex: 3,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 4, textAlign: 'center', pt: { xs: 15, md: 18 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Trust Badge for Independent Workers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Chip
              icon={<VerifiedUser sx={{ color: '#10b981' }} />}
              label="Trusted by 25,000+ independent workers • 1099-friendly plans"
              sx={{
                mb: 4,
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                color: theme.palette.text.primary,
              }}
            />
          </motion.div>

          {/* Main Headline for Gig Workers */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', sm: '3rem', md: '4rem' },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 3,
              color: 'white',
              textShadow: '0 6px 30px rgba(0, 0, 0, 0.5)',
              maxWidth: '1000px',
              mx: 'auto',
              letterSpacing: '-0.02em',
            }}
          >
            Health Insurance for{' '}
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, #10b981, #22c55e, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '4px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '2px',
                  opacity: 0.8,
                }
              }}
            >
              Independent Workers
            </Box>
          </Typography>

          {/* Subheadline for Gig Workers */}
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.3rem', md: '1.5rem' },
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 6,
              lineHeight: 1.6,
              maxWidth: '700px',
              mx: 'auto',
              textShadow: '0 3px 15px rgba(0, 0, 0, 0.4)',
            }}
          >
            Instant quotes for freelancers, contractors, and gig workers. No employer needed, tax deductible, and simple to understand.
          </Typography>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              sx={{ mb: 8 }}
            >
              <Button
                component={Link}
                to="/gig-worker-quote"
                variant="contained"
                size="large"
                endIcon={<ArrowRight />}
                sx={{
                  px: 6,
                  py: 3.5,
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 12px 40px rgba(16, 185, 129, 0.6)',
                  textTransform: 'none',
                  minWidth: '220px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 60px rgba(16, 185, 129, 0.7)',
                    background: 'linear-gradient(135deg, #059669, #047857)',
                  },
                }}
              >
                Get My Quote
              </Button>
              
              <Button
                href="tel:1-800-555-0123"
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                sx={{
                  px: 6,
                  py: 3.5,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  borderRadius: '30px',
                  borderWidth: 3,
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'white',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                  textTransform: 'none',
                  minWidth: '220px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: 3,
                    borderColor: 'white',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                Call Expert
              </Button>
            </Stack>
          </motion.div>

          {/* Gig Worker Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                p: 5,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} sx={{ color: '#fbbf24', fontSize: 24 }} />
                    ))}
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3, 
                      fontStyle: 'italic',
                      color: 'white',
                      lineHeight: 1.7,
                      fontSize: '1.2rem',
                      fontWeight: 500,
                    }}
                  >
                    "{testimonials[currentTestimonial].text}"
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 700, fontSize: '1rem' }}>
                    {testimonials[currentTestimonial].author} • {testimonials[currentTestimonial].location}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {/* Carrier Carousel */}
      <GigWorkerCarrierCarousel />
    </Box>
  );
};

// Features Section Adapted for Gig Workers
const GigWorkerFeaturesSection: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: SecurityIcon,
      title: 'No W-2 Required',
      description: 'Get coverage as an independent contractor without traditional employer verification.',
      color: theme.palette.primary.main,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    {
      icon: MoneyIcon,
      title: 'Tax Deductible',
      description: 'Self-employed health insurance premiums are typically 100% tax deductible.',
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
    {
      icon: SpeedIcon,
      title: '90-Second Quotes',
      description: 'Get instant pricing without complex paperwork or long enrollment forms.',
      color: theme.palette.info.main,
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    },
    {
      icon: CalendarIcon,
      title: 'Flexible Coverage',
      description: 'Plans that work with irregular income and changing work schedules.',
      color: theme.palette.warning.main,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    {
      icon: SupportIcon,
      title: 'Gig Worker Specialists',
      description: 'Agents who understand the unique needs of freelancers and contractors.',
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
    },
    {
      icon: HealthIcon,
      title: 'ACA Compliant Plans',
      description: 'All plans meet federal requirements with essential health benefits included.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
  ];

  return (
    <Box 
      id="features"
      sx={{ 
        py: { xs: 15, md: 25 }, 
        background: `
          linear-gradient(180deg, 
            #fafafa 0%, 
            #f8fafc 50%, 
            #ffffff 100%
          )
        `
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 16 }} />}
              label="Built for Independent Workers"
              sx={{
                mb: 3,
                px: 4,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}30`,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.2rem' },
                fontWeight: 800,
                mb: 4,
                color: theme.palette.text.primary,
                letterSpacing: '-0.02em',
              }}
            >
              Health Insurance That Gets It
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                color: theme.palette.text.secondary,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.7
              }}
            >
              Finally, health insurance designed for the gig economy. No corporate hoops, no complex forms - just straightforward coverage.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Container maxWidth="lg">
              <Grid 
                container 
                spacing={3} 
                justifyContent="center"
                alignItems="stretch"
                sx={{ maxWidth: '900px', mx: 'auto' }}
              >
                {features.map((feature, index) => (
                  <Grid 
                    size={{ xs: 12, sm: 6, md: 4 }}
                    key={index} 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'stretch'
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -6 }}
                      style={{ 
                        width: '280px',
                        height: '220px',
                        display: 'flex'
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          width: '280px',
                          height: '220px',
                          p: 3,
                          textAlign: 'center',
                          borderRadius: '16px',
                          background: 'white',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                          border: '1px solid rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          '&:hover': {
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
                            '& .feature-icon': {
                              transform: 'scale(1.05) rotate(3deg)',
                            },
                            '&::before': {
                              opacity: 1,
                            }
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: feature.gradient,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }
                        }}
                      >
                        <Box>
                          <Box
                            className="feature-icon"
                            sx={{
                              width: 56,
                              height: 56,
                              mx: 'auto',
                              mb: 2.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: feature.gradient,
                              borderRadius: '50%',
                              transition: 'all 0.3s ease',
                              boxShadow: `0 4px 16px ${feature.color}30`,
                            }}
                          >
                            <feature.icon sx={{ fontSize: 28, color: 'white' }} />
                          </Box>
                          
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              fontSize: '1.1rem',
                              color: theme.palette.text.primary,
                              lineHeight: 1.3,
                            }}
                          >
                            {feature.title}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            lineHeight: 1.5, 
                            fontSize: '0.9rem',
                            fontWeight: 400,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

// Social Proof Section for Gig Workers
const GigWorkerSocialProofSection: React.FC = () => {
  const theme = useTheme();

  const stats = [
    { number: 25000, label: 'Independent Workers', icon: Users, color: '#10b981', suffix: '+' },
    { number: 90, label: 'Average Quote Time', icon: AccessTime, color: '#3b82f6', suffix: ' sec' },
    { number: 149, label: 'Average Monthly Premium', icon: TrendingUp, color: '#22c55e', suffix: '', prefix: '$' },
    { number: 4.9, label: 'Customer Rating', icon: Star, color: '#f59e0b', suffix: '/5' },
  ];

  const testimonials = [
    {
      name: 'Marcus Chen',
      location: 'San Francisco, CA',
      workType: 'Freelance Developer',
      text: 'As a freelance developer, I needed coverage that understood my variable income. Found a great plan for $127/month with amazing benefits.',
      image: '/images/young_man_coffee.jpg',
      savings: '$127/month'
    },
    {
      name: 'Sofia Rodriguez',
      location: 'Austin, TX',  
      workType: 'Rideshare Driver',
      text: 'Driving for Uber and Lyft means no employer benefits. This platform made it so easy to get real health insurance that I can actually afford.',
      image: '/images/young_woman_on_phone.jpg',
      savings: '$98/month'
    },
    {
      name: 'David Kim',
      location: 'Tampa, FL',
      workType: 'Independent Contractor',
      text: 'Been contracting for 5 years without health insurance. Finally got covered and it\'s even tax deductible. Wish I found this sooner!',
      image: '/images/young_man_phone.jpg',
      savings: '$156/month'
    }
  ];

  return (
    <Box sx={{ 
      py: { xs: 15, md: 20 },
      background: `
        linear-gradient(180deg, 
          rgba(255, 255, 255, 1) 0%, 
          rgba(248, 250, 252, 1) 100%
        )
      `
    }}>
      <Container maxWidth="xl">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 20 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', md: '3.2rem' }, fontWeight: 800, mb: 10 }}>
              Real Results for Real Workers
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Container maxWidth="md">
                <Grid 
                  container 
                  spacing={4} 
                  justifyContent="center"
                  alignItems="stretch"
                  sx={{ maxWidth: '600px', mx: 'auto' }}
                >
                  {stats.map((stat, index) => (
                    <Grid 
                      size={{ xs: 12, sm: 6 }}
                      key={index} 
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'stretch'
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        style={{ 
                          width: '280px',
                          height: '200px',
                          display: 'flex'
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            width: '280px',
                            height: '200px',
                            textAlign: 'center',
                            p: 4,
                            borderRadius: '20px',
                            background: 'white',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              mx: 'auto',
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `${stat.color}15`,
                              borderRadius: '50%',
                            }}
                          >
                            <stat.icon sx={{ fontSize: 30, color: stat.color }} />
                          </Box>
                          <Typography variant="h2" sx={{ fontSize: '2.8rem', fontWeight: 900, color: stat.color, mb: 1 }}>
                            {stat.prefix}
                            <CountingNumber 
                              end={stat.number} 
                              duration={2500} 
                              suffix={stat.suffix} 
                            />
                          </Typography>
                          <Typography variant="h6" color="text.secondary" fontWeight={600}>
                            {stat.label}
                          </Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
          </Box>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Chip
              label="Gig Worker Stories"
              sx={{
                mb: 3,
                px: 4,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}10)`,
                color: theme.palette.success.main,
                border: `1px solid ${theme.palette.success.main}30`,
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '2.5rem', mb: 4 }}>
              Independent Workers Getting Covered
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              See how contractors, freelancers, and gig workers are finding affordable health insurance
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: '1400px', width: '100%' }}>
              <Grid container spacing={6}>
                {testimonials.map((testimonial, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                      whileHover={{ y: -8 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 6,
                          height: '100%',
                          background: 'white',
                          borderRadius: '28px',
                          boxShadow: '0 12px 50px rgba(0, 0, 0, 0.08)',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #10b981, #22c55e)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', mb: 4 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} sx={{ color: '#fbbf24', fontSize: 24 }} />
                          ))}
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 4, 
                            lineHeight: 1.8, 
                            fontStyle: 'italic', 
                            fontSize: '1.15rem', 
                            color: 'text.primary',
                            fontWeight: 400,
                          }}
                        >
                          "{testimonial.text}"
                        </Typography>

                        <Chip
                          label={testimonial.savings}
                          sx={{
                            mb: 4,
                            background: 'linear-gradient(135deg, #10b981, #22c55e)',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar
                            src={testimonial.image}
                            alt={testimonial.name}
                            sx={{ width: 70, height: 70 }}
                          />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                              {testimonial.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                              {testimonial.workType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                              {testimonial.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

// Main Gig Worker Landing Page Component
const GigWorkerLandingPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', margin: 0, padding: 0 }}>
      <GigWorkerHero />
      <GigWorkerFeaturesSection />
      <GigWorkerSocialProofSection />
    </Box>
  );
};

export default GigWorkerLandingPage;