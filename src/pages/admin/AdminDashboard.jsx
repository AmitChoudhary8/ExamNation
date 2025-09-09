import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet, Routes, Route } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaEdit,
  FaBookOpen,
  FaCalendarAlt,
  FaPaperPlane,
  FaUsers,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';
import ManagePDF from './ManagePDF';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const navigate = useNavigate();
  const location = useLocation();

  const isMainDashboard = location.pathname === '/AdminDash';

  // ✅ Menu items with only ManagePDF for now
  const menuItems = [
    {
      title: 'Manage PDFs',
      path: '/AdminDash/managepdf',
      icon: <FaEdit size={20} />,
      description: 'Upload, edit, and organize PDF study materials'
    }
    // Add other menu items later as you build them
  ];

  // ✅ Fixed login state restoration
  useEffect(() => {
    const checkLoginStatus = () => {
      const adminToken = localStorage.getItem('adminToken');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (adminToken && loginTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(loginTime);
        const twoHours = 2 * 60 * 60 * 1000;
        
        if (timeDifference < twoHours) {
          setIsLoggedIn(true);
        } else {
          // Auto logout if expired
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminLoginTime');
          setIsLoggedIn(false);
        }
      }
      setLoading(false); // ✅ Set loading false after check
    };

    checkLoginStatus();
  }, []);

  // ✅ Auto logout timer
  useEffect(() => {
    let timer;
    if (isLoggedIn) {
      timer = setTimeout(() => {
        handleLogout();
        alert('Session expired. Please login again.');
      }, 2 * 60 * 60 * 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoggedIn]);

  // ✅ Improved login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    try {
      if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
        const currentTime = new Date().getTime();
        localStorage.setItem('adminToken', 'admin_authenticated');
        localStorage.setItem('adminLoginTime', currentTime.toString());
        
        setIsLoggedIn(true);
        setLoginForm({ username: '', password: '' });
        navigate('/AdminDash'); // ✅ Redirect after login
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    setIsLoggedIn(false);
    setSidebarOpen(false);
    navigate('/AdminDash');
  };

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Show loading spinner while checking login status
  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading Admin Panel...</div>
      </div>
    );
  }

  // ✅ Login form (unchanged)
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-logo">
            <img src="/logo.png" alt="ExamNation Admin" />
            <h2>Admin Dashboard</h2>
          </div>
          
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Admin Username"
                value={loginForm.username}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Admin Password"
                value={loginForm.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            
            {loginError && <div className="login-error">{loginError}</div>}
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }
  // ✅ Main dashboard content (logged in state)
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars size={20} />
          </button>
        </div>
        
        <div className="header-center">
          <Link to="/AdminDash" className="admin-logo-link">
            <img src="/logo.png" alt="ExamNation" className="header-logo" />
            <span className="admin-title">Admin Panel</span>
          </Link>
        </div>
        
        <div className="header-right">
          <div className="admin-user-info">
            <FaUser size={16} />
            <span>Admin</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      </header>

      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Management</h3>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="sidebar-item"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="sidebar-icon">{item.icon}</div>
              <span className="sidebar-text">{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="admin-main">
        {isMainDashboard ? (
          <div className="dashboard-content">
            <div className="dashboard-welcome">
              <h1>Welcome to Admin Dashboard</h1>
              <p>Manage your ExamNation platform efficiently</p>
            </div>
            
            <div className="dashboard-grid">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="dashboard-card"
                >
                  <div className="card-icon">{item.icon}</div>
                  <div className="card-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="managepdf" element={<ManagePDF />} />
            {/* Add other routes as you build them:
            <Route path="managemagazines" element={<ManageMagazines />} />
            <Route path="managecalendar" element={<ManageCalendar />} />
            <Route path="managerequests" element={<ManageRequests />} />
            <Route path="manageblogs" element={<ManageBlogs />} />
            */}
          </Routes>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
