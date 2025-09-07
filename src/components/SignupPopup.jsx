import React, { useState } from 'react';
import { supabase } from '../supabase';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import Toast from './Toast';
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
  const [debugMessage, setDebugMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const examTypes = ['PO', 'CLERK', 'SO', 'GRADE B', 'INSURANCE', 'OTHER'];

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  // Generate unique 9 digit random ID
  const generateUserId = async () => {
    const length = 9;
    let userId = '';
    let attempts = 0;
    
    while (attempts < 10) {
      userId = Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
      
      // Check if user_id already exists in users table
      const { data, error } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', parseInt(userId))
        .single();
      
      if (error && error.code === 'PGRST116') {
        // User ID doesn't exist, good to use
        setDebugMessage(prev => prev + `\n✅ Generated unique user_id: ${userId}`);
        return parseInt(userId);
      }
      
      attempts++;
      setDebugMessage(prev => prev + `\n⚠️ User ID ${userId} exists, trying again...`);
    }
    
    throw new Error('Could not generate unique user ID');
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
    setDebugMessage('🔄 Starting signup process...');
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const userId = await generateUserId();
      setDebugMessage(prev => prev + '\n🔐 Creating Supabase Auth account...');
      
      // Supabase Auth signup with email verification and metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
            mobile: formData.mobile,
            exam_type: formData.examType,
            user_id: userId.toString() // Store as string in metadata
          }
        }
      });

      if (authError) {
        setDebugMessage(prev => prev + `\n❌ Auth signup error: ${authError.message}`);
        
        if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
          showToast('Email already registered. Please try logging in.', 'error');
        } else if (authError.message.includes('Signups not allowed')) {
          showToast('New registrations are currently disabled. Please contact support.', 'error');
        } else {
          showToast(`Signup failed: ${authError.message}`, 'error');
        }
        return;
      }

      setDebugMessage(prev => prev + '\n✅ Auth account created successfully!');
      setEmailSent(true);
      showToast('Account created! Please check your email for verification.', 'success');
      
    } catch (error) {
      setDebugMessage(prev => prev + `\n❌ Catch error: ${error.message}`);
      console.error('Signup error:', error);
      showToast('Error creating account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      });

      if (error) throw error;
      
      showToast('Verification email sent again. Please check your spam folder.', 'info');
    } catch (error) {
      showToast('Error resending email. Please try again.', 'error');
    }
  };

  const handleBackToForm = () => {
    setEmailSent(false);
    setDebugMessage('');
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
    <>
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
              
              {/* Debug Message Display */}
              {debugMessage && (
                <div className="debug-box">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium">Debug Info</summary>
                    <pre className="mt-2 text-xs whitespace-pre-wrap">{debugMessage}</pre>
                    <button 
                      onClick={() => setDebugMessage('')}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Clear Debug
                    </button>
                  </details>
                </div>
              )}
              
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
              {/* Email Verification Screen */}
              <div className="verification-screen">
                <div className="verification-icon">
                  <div className="email-icon-wrapper">
                    <FaEnvelope size={40} />
                  </div>
                </div>
                
                <h2 className="verification-title">Verify your Email</h2>
                
                <p className="verification-description">
                  Account activation link has been sent to the e-mail address you provided
                </p>
                
                <div className="email-illustration">
                  <div className="email-box">
                    <div className="email-checkmark">✓</div>
                  </div>
                </div>
                
                <button 
                  className="resend-btn"
                  onClick={handleResendEmail}
                >
                  Didn't get the email? Send it again
                </button>
                
                <button 
                  className="signup-btn"
                  onClick={handleBackToForm}
                  style={{ marginTop: '10px' }}
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </>
  );
};

export default SignupPopup;
