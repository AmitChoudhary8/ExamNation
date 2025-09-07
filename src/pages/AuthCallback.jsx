import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './AuthCallback.css';

function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Verification failed. Please try again.');
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Your account has been successfully verified!');
        } else {
          setStatus('error');
          setMessage('Verification link expired. Please request a new one.');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    handleAuthCallback();
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleResendVerification = () => {
    // Navigate back to signup or login
    navigate('/');
  };

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-card">
        
        {/* Logo */}
        <div className="callback-logo">
          <img src="/logo.png" alt="ExamNation" />
        </div>
        
        {status === 'verifying' && (
          <div className="verification-status">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="verification-success">
            <div className="success-icon">✅</div>
            <h2>Congratulations!</h2>
            <p>Your account has been successfully verified.</p>
            <p className="thank-you">Thank you for trusting us!</p>
            
            <button 
              onClick={handleGoHome}
              className="go-home-btn"
            >
              Go to Home
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="verification-error">
            <div className="error-icon">❌</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            
            <div className="error-actions">
              <button 
                onClick={handleGoHome}
                className="go-home-btn"
              >
                Go to Home
              </button>
              <button 
                onClick={handleResendVerification}
                className="resend-btn"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default AuthCallback;
