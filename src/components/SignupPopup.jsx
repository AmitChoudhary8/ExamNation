import React, { useState } from 'react';
import { supabase } from '../supabase';
import { FaTimes } from 'react-icons/fa';
import './SignupPopup.css';

const SignupPopup = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    examType: '',
    password: '',
    rePassword: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  const examTypes = [
    'PO',
    'CLERK', 
    'SO',
    'GRADE B',
    'INSURANCE',
    'OTHER'
  ];

  // Generate 9 digit random ID (for internal use)
  const generateUserId = () => {
    return Math.floor(100000000 + Math.random() * 900000000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (!formData.examType) newErrors.examType = 'Please select exam type';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.rePassword) newErrors.rePassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Please accept terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const userId = generateUserId();
      
      // Supabase Auth signup with email verification
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            mobile: formData.mobile,
            exam_type: formData.examType,
            user_id: userId // Custom random ID for internal use
          }
        }
      });

      if (authError) throw authError;

      // Show email verification message
      setEmailSent(true);
      
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.message.includes('already registered')) {
        alert('Email already registered. Please try logging in.');
      } else {
        alert('Error creating account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setEmailSent(false);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      examType: '',
      password: '',
      rePassword: '',
      acceptTerms: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="signup-overlay">
      <div className="signup-popup">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        {/* Logo */}
        <div className="popup-logo">
          <img src="/logo.png" alt="ExamNation" />
        </div>
        
        {!emailSent ? (
          <>
            {/* Title */}
            <h2 className="popup-title">Create Account</h2>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="signup-form">
              
              {/* Full Name */}
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

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

              {/* Mobile Number */}
              <div className="form-group">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={errors.mobile ? 'error' : ''}
                />
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>

              {/* Exam Type Dropdown */}
              <div className="form-group">
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className={errors.examType ? 'error' : ''}
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.examType && <span className="error-text">{errors.examType}</span>}
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

              {/* Re-enter Password */}
              <div className="form-group">
                <input
                  type="password"
                  name="rePassword"
                  placeholder="Re-enter Password"
                  value={formData.rePassword}
                  onChange={handleInputChange}
                  className={errors.rePassword ? 'error' : ''}
                />
                {errors.rePassword && <span className="error-text">{errors.rePassword}</span>}
              </div>

              {/* Terms and Conditions */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  I accept the{' '}
                  <a 
                    href="https://examination.netlify.app/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="terms-link"
                  >
                    terms and conditions
                  </a>
                </label>
                {errors.acceptTerms && <span className="error-text">{errors.acceptTerms}</span>}
              </div>

              {/* Sign Up Button */}
              <button 
                type="submit" 
                className="signup-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'SIGN UP'}
              </button>

              {/* Return to Login */}
              <button 
                type="button" 
                className="return-login-btn"
                onClick={onSwitchToLogin}
              >
                Return to login
              </button>

            </form>
          </>
        ) : (
          <>
            {/* Email Verification Message */}
            <h2 className="popup-title">Check Your Email</h2>
            <div className="verification-message">
              <div style={{ fontSize: '60px', color: '#4A90E2', marginBottom: '20px' }}>📧</div>
              <p style={{ color: '#333', fontSize: '16px', textAlign: 'center', lineHeight: '1.5' }}>
                Verification email has been sent to <strong>{formData.email}</strong>
              </p>
              <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>
                Please check your email and click the verification link to activate your account. 
                <strong> Also check your spam folder.</strong>
              </p>
            </div>
            
            <button 
              className="signup-btn"
              onClick={handleBackToForm}
              style={{ marginTop: '20px' }}
            >
              Back to Signup
            </button>
            
            <button 
              type="button" 
              className="return-login-btn"
              onClick={onSwitchToLogin}
            >
              Return to login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPopup;
