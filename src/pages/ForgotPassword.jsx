import React, { useState } from 'react';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate email sending (replace with actual email service)
    setTimeout(() => {
      setMessage('Password reset link has been sent to your email. Please check your spam folder also.');
      setEmailSent(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-card">
          
          {/* Back to Home */}
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
          
          {/* Logo */}
          <div className="page-logo">
            <img src="/logo.png" alt="ExamNation" />
          </div>
          
          {/* Title */}
          <h1>Forgot Password?</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
          
          {emailSent && (
            <div className="success-message">
              <FaEnvelope />
              <p>{message}</p>
            </div>
          )}
          
          {!emailSent && (
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                className="send-email-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaEnvelope /> Send Reset Link
                  </>
                )}
              </button>
            </form>
          )}
          
          <div className="help-links">
            <p>Remember your password? <Link to="/">Back to Login</Link></p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
