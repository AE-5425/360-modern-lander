import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Determine if header should be transparent based on route
  const transparentHeaderRoutes = ['/', '/about'];
  const isTransparentHeader = transparentHeaderRoutes.includes(location.pathname);
  
  // Hide header/footer on enrollment page for focused experience
  const hideHeaderFooter = location.pathname === '/enroll';

  if (hideHeaderFooter) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        {children}
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        // CRITICAL: Remove any default margins/padding that could cause white lip
        margin: 0,
        padding: 0,
        '& > *': {
          // Ensure child components don't have unwanted spacing
          margin: 0,
        }
      }}
    >
      <Header transparent={isTransparentHeader} />
      
      <Box 
        sx={{ 
          flex: 1,
          // CRITICAL: Remove any spacing that could interfere with edge-to-edge hero
          margin: 0,
          padding: 0,
          // For transparent header pages, content starts at very top
          ...(isTransparentHeader && {
            marginTop: 0,
            paddingTop: 0,
          })
        }}
      >
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;