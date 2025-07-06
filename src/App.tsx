import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { defaultHealthcareTheme as theme } from './theme';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages - Gig worker focused
import GigWorkerLandingPage from './pages/GigWorkerLandingPage';
import GigWorkerQuotePage from './pages/GigWorkerQuotePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* Gig worker focused routes */}
              <Route path="/" element={<GigWorkerLandingPage />} />
              <Route path="/get-quote" element={<GigWorkerQuotePage />} />
              <Route path="/gig-worker-quote" element={<GigWorkerQuotePage />} />
              <Route path="/quote" element={<GigWorkerQuotePage />} />
              
              {/* Redirect old routes to new gig worker flow */}
              <Route path="/enroll" element={<Navigate to="/get-quote" replace />} />
              <Route path="/enrollment" element={<Navigate to="/get-quote" replace />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<Navigate to="/" replace />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
