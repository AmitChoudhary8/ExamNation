import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import SignupPopup from './SignupPopup';
import LoginPopup from './LoginPopup';
import './Header.css';

const examCategories = [
  'SBI PO','SBI CLERK','IBPS PO','IBPS CLERK','RRB PO','RRB CLERK','INSURANCE','RBI GRADE B','NABARD','OTHER'
];

const menuItems = [
  { name: 'My Account', path: '/my-account' },
  { name: 'Download PDF', path: '/download-pdf' },
  { name: 'Magazines', path: '/magazines' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Request', path: '/request' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Support Us', path: '/support-us' },
  { name: 'Terms', path: '/terms' },
  { name: 'Contact Us', path: '/contact-us' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Sitemap', path: '/sitemap' }
];

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUserData(null);
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleForgotPassword = () => {
    setShowLogin(false);
    navigate('/forgotpassword');
  };

  return (
    <>
      <header className="header">
        <div className="header-row">
          {/* Hamburger Icon */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={28} color="#111" />
          </button>
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src="/logo.png" alt="ExamNation Logo" style={{height:"40px"}} />
          </Link>
          {/* Search Bar */}
          <form className="header-search">
            <input type="text" placeholder="Search..." />
            <button type="submit" className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
          {/* Auth Button */}
          <button className="header-auth" onClick={handleAuthClick}>
            {isLoggedIn ? (
              `Logout (${userData?.full_name || 'User'})`
            ) : (
              <>
                <FaUserCircle style={{marginRight:'6px'}}/> Login / Register
              </>
            )}
          </button>
        </div>
        {/* Exam Category Buttons */}
        <div className="header-categories">
          <div className="categories-scroll">
            {examCategories.map((c, i) => (
              <button key={i} className="category-btn">{c}</button>
            ))}
          </div>
        </div>
        {/* Side Menu (Hamburger) */}
        {menuOpen && (
          <div className="side-menu-overlay" onClick={() => setMenuOpen(false)}>
            <nav className="side-menu" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
              <ul>
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} onClick={() => setMenuOpen(false)}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={handleSwitchToSignup}
        onSwitchToForgotPassword={handleForgotPassword}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Signup Popup */}
      <SignupPopup 
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export default Header;
