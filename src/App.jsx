import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DownloadPDF from './pages/DownloadPDF';
import Magazines from './pages/Magazines';
import Calendar from './pages/Calendar';
import Request from './pages/Request';
import TermsAndConditions from './pages/TermsAndConditions';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Footer from './components/Footer';
// Add this import
import SupportUs from './pages/SupportUs';
import AdminDashboard from '/src/pages/admin/AdminDashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Check localStorage on app initialization
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('examNationUser');
      const storedLoginStatus = localStorage.getItem('examNationLoggedIn');
      
      if (storedUser && storedLoginStatus === 'true') {
        const userInfo = JSON.parse(storedUser);
        setUserData(userInfo);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error restoring login state:', error);
      // Clear corrupted data
      localStorage.removeItem('examNationUser');
      localStorage.removeItem('examNationLoggedIn');
    }
  }, []);

  // ✅ Handle login success - called from Header
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
    
    // Save to localStorage
    try {
      localStorage.setItem('examNationUser', JSON.stringify(user));
      localStorage.setItem('examNationLoggedIn', 'true');
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  };

  // ✅ Handle logout - called from Header
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    
    // Clear localStorage
    try {
      localStorage.removeItem('examNationUser');
      localStorage.removeItem('examNationLoggedIn');
    } catch (error) {
      console.error('Error clearing login state:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn}
          userData={userData}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/download-pdf" element={<DownloadPDF />} />
            <Route path="/magazines" element={<Magazines />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/request" element={<Request />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/support-us" element={<SupportUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/AdminDash/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
