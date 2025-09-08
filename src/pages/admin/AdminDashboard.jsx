import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FiEdit, 
  FiBookOpen, 
  FiCalendar, 
  FiSend, 
  FiEdit, 
  FiUsers,
  FiLogOut,
  FiUser
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the main dashboard or a sub-page
  const isMainDashboard = location.pathname === '/AdminDash';

  // Menu items for sidebar and main dashboard
  const menuItems = [
    {
      title: 'Manage PDFs',
      path: '/AdminDash/managepdf',
      icon: <FiEdit size={20} />,
      description: 'Upload, edit, and organize PDF study materials'
    },
    {
      title: 'Manage Magazines',
      path: '/AdminDash/managemagazines',
      icon: <FiBookOpen size={20} />,
      description: 'Manage current affairs magazines and publications'
    },
    {
      title: 'Manage Calendar',
      path: '/AdminDash/managecalendar',
      icon: <FiCalendar size={20} />,
      description: 'Update exam dates and important notifications'
    },
    {
      title: 'Manage Requests',
      path: '/AdminDash/managerequests',
      icon: <FiSend size={20} />,
      description: 'Handle user requests and support tickets'
    },
    {
      title: 'Manage Blogs',
      path: '/AdminDash/manageblogs',
      icon: <FiEdit size={20} />,
      description: 'Create, edit, and publish blog posts'
    },
    {
      title: 'User Management',
      path: '/AdminDash/usermanagement',
      icon: <FiUsers size={20} />,
      description: 'Manage registered users and their permissions'
    }
  ];

  // Check login status on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (adminToken && loginTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(loginTime);
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      if (timeDifference < twoHours) {
        setIsLoggedIn(true);
      } else {
        // Auto logout after 2 hours
        handleLogout();
      }
    }
  }, []);

  // Auto logout timer
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        handleLogout();
        alert('Session expired. Please login again.');
      }, 2 * 60 * 60 * 1000); // 2 hours

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    // ✅ Updated to use Vite environment variables
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    try {
      if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
        const currentTime = new Date().getTime();
        localStorage.setItem('adminToken', 'admin_authenticated');
        localStorage.setItem('adminLoginTime', currentTime.toString());
        
        setIsLoggedIn(true);
        setLoginForm({ username: '', password: '' });
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
    navigate('/AdminDash');
  };

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  // If not logged in, show login form
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

  return (
    <div className="admin-dashboard">
      {/* Header */}
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
            <FiUser size={16} />
            <span>Admin</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* ✅ Fixed: Changed from <sidebar> to <aside> */}
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

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
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
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
