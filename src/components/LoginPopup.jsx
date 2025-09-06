import React, { useState } from 'react';
import { supabase } from '../supabase';
import { FaTimes } from 'react-icons/fa';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, onClose, onSwitchToSignup, onSwitchToForgotPassword, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Check user in Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password) // In real app, use proper password hashing
        .single();

      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      alert(`Welcome back, ${data.full_name}! Login successful.`);
      onLoginSuccess(data);
      onClose();
      
      // Reset form
      setFormData({
        email: '',
        password: ''
      });
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        {/* Logo */}
        <div className="popup-logo">
          <img src="/logo.png" alt="ExamNation" />
        </div>
        
        {/* Title */}
        <h2 className="popup-title">Login</h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>

          {/* Create Account Button */}
          <button 
            type="button" 
            className="create-account-btn"
            onClick={onSwitchToSignup}
          >
            Create Account
          </button>

          {/* Forgot Password Link */}
          <button 
            type="button" 
            className="forgot-password-link"
            onClick={onSwitchToForgotPassword}
          >
            Forgot Password?
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
