import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Chip,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  path: string;
  scrollTo?: string;
}

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Routes where header should be hidden (lead forms, checkout flows, etc.)
  const hiddenRoutes = [
    '/gig-worker-quote',
    '/lead-form',
    '/quote-form',
    '/checkout'
  ];

  // Check if current route should hide header
  const shouldHideHeader = hiddenRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Handle scroll for sticky header effect - ALWAYS call this hook
  useEffect(() => {
    // Only add scroll listener if header should be visible
    if (shouldHideHeader) return;
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHideHeader]);

  // Don't render header on hidden routes - AFTER all hooks
  if (shouldHideHeader) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle smooth scrolling to sections
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Updated navigation for gig worker focus
  const navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Get Quote', path: '/gig-worker-quote' },
    { label: 'About', path: '#features', scrollTo: 'features' } // Changed to scroll to features
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logos/360InsuranceGroup.png" 
            alt="360 Insurance Group" 
            style={{ height: '75px', width: 'auto' }}
          />
        </Box>
        <IconButton onClick={handleDrawerToggle} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            {item.scrollTo ? (
              // Scroll button for About in mobile
              <Button
                onClick={() => {
                  handleScrollToSection(item.scrollTo!);
                  handleDrawerToggle();
                }}
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  py: 2,
                  color: 'inherit',
                  fontWeight: 'normal'
                }}
              >
                {item.label}
              </Button>
            ) : (
              // Regular Link button for mobile
              <Button
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  py: 2,
                  color: isActivePath(item.path) ? theme.palette.primary.main : 'inherit',
                  fontWeight: isActivePath(item.path) ? 'bold' : 'normal'
                }}
              >
                {item.label}
              </Button>
            )}
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Button
            href="tel:1-800-555-0123"
            startIcon={<PhoneIcon />}
            sx={{
              width: '100%',
              justifyContent: 'center',
              py: 2,
              mt: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              borderRadius: 2,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              }
            }}
          >
            Talk to Experts
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          backgroundColor: scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          borderBottomColor: scrolled 
            ? 'rgba(0, 0, 0, 0.12)' 
            : 'transparent',
          boxShadow: scrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.08)' 
            : 'none'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderBottom: '1px solid',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: .5, minHeight: '50px !important' }}>
            {/* Logo - Much Bigger */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                component={Link}
                to="/"
                sx={{
                  textTransform: 'none',
                  color: 'inherit',
                  p: 1,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'rgba(255, 255, 255, 0.15)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <motion.img 
                    src="/logos/360InsuranceGroup.png" 
                    alt="360 Insurance Group" 
                    style={{ height: '100px', width: 'auto' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                </Box>
              </Button>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {item.scrollTo ? (
                      // Scroll button for About
                      <Button
                        onClick={() => handleScrollToSection(item.scrollTo!)}
                        sx={{
                          color: isActivePath(item.path) 
                            ? (scrolled ? theme.palette.primary.main : '#ffffff')
                            : (scrolled ? theme.palette.text.primary : 'rgba(255, 255, 255, 0.9)'),
                          fontWeight: isActivePath(item.path) ? 'bold' : '600',
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontSize: '1rem',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.2)',
                          '&:hover': {
                            backgroundColor: scrolled 
                              ? alpha(theme.palette.primary.main, 0.08)
                              : 'rgba(255, 255, 255, 0.15)',
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      // Regular Link button
                      <Button
                        component={Link}
                        to={item.path}
                        sx={{
                          color: isActivePath(item.path) 
                            ? (scrolled ? theme.palette.primary.main : '#ffffff')
                            : (scrolled ? theme.palette.text.primary : 'rgba(255, 255, 255, 0.9)'),
                          fontWeight: isActivePath(item.path) ? 'bold' : '600',
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontSize: '1rem',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.2)',
                          '&:hover': {
                            backgroundColor: scrolled 
                              ? alpha(theme.palette.primary.main, 0.08)
                              : 'rgba(255, 255, 255, 0.15)',
                            transform: 'translateY(-1px)',
                          },
                          '&::after': isActivePath(item.path) ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 4,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: '2px',
                            background: scrolled 
                              ? theme.palette.primary.main
                              : '#ffffff',
                            borderRadius: '1px',
                          } : {}
                        }}
                      >
                        {item.label}
                      </Button>
                    )}
                  </motion.div>
                ))}
                
                {/* Call Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    href="tel:1-800-555-0123"
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    sx={{
                      ml: 3,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      background: scrolled 
                        ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        : 'rgba(255, 255, 255, 0.2)',
                      color: scrolled ? 'white' : '#ffffff',
                      border: scrolled ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: scrolled 
                        ? '0 8px 25px rgba(59, 130, 246, 0.3)'
                        : '0 4px 15px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: scrolled
                          ? '0 12px 35px rgba(59, 130, 246, 0.4)'
                          : '0 8px 25px rgba(0, 0, 0, 0.2)',
                        background: scrolled 
                          ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                          : 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: scrolled ? theme.palette.text.primary : '#ffffff',
                    backgroundColor: scrolled 
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: scrolled 
                        ? alpha(theme.palette.primary.main, 0.12)
                        : 'rgba(255, 255, 255, 0.25)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}
          </Toolbar>
        </Container>
      </motion.div>

      {/* No spacer needed - hero will go to top */}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
