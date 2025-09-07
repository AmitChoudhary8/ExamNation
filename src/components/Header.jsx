import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { 
  FiUser, 
  FiDownload, 
  FiBookOpen, 
  FiCalendar, 
  FiSend, 
  FiFileText, 
  FiShield, 
  FiMail, 
  FiInfo, 
  FiMap 
} from 'react-icons/fi';
import AuthModal from './AuthModal';
import './Header.css';

const examCategories = [
  'SBI PO','SBI CLERK','IBPS PO','IBPS CLERK','RRB PO','RRB CLERK','INSURANCE','RBI GRADE B','NABARD','OTHER'
];

const menuItems = [
  { name: 'My Account', path: '/my-account', icon: <FiUser size={18} /> },
  { name: 'Download PDF', path: '/download-pdf', icon: <FiDownload size={18} /> },
  { name: 'Magazines', path: '/magazines', icon: <FiBookOpen size={18} /> },
  { name: 'Calendar', path: '/calendar', icon: <FiCalendar size={18} /> },
  { name: 'Request', path: '/request', icon: <FiSend size={18} /> },
  { name: 'Blogs', path: '/blogs', icon: <FiFileText size={18} /> },
  { name: 'Support Us', path: '/support-us', icon: <FiShield size={18} /> },
  { name: 'Terms', path: '/terms', icon: <FiFileText size={18} /> },
  { name: 'Contact Us', path: '/contact-us', icon: <FiMail size={18} /> },
  { name: 'About Us', path: '/about-us', icon: <FiInfo size={18} /> },
  { name: 'Sitemap', path: '/sitemap', icon: <FiMap size={18} /> }
];

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current page is homepage
  const isHomePage = location.pathname === '/';

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUserData(null);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
    setShowAuthModal(false);
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
        {/* Exam Category Buttons - Only show on Homepage */}
        {isHomePage && (
          <div className="header-categories">
            <div className="categories-scroll">
              {examCategories.map((c, i) => (
                <button key={i} className="category-btn">{c}</button>
              ))}
            </div>
          </div>
        )}
        {/* Side Menu (Hamburger) */}
        {menuOpen && (
          <div className="side-menu-overlay" onClick={() => setMenuOpen(false)}>
            <nav className="side-menu" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
              <ul>
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      to={item.path} 
                      onClick={() => setMenuOpen(false)}
                      className="menu-item-link"
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-text">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* New AuthModal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Header;
