import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ForgotPassword.css'; // Reuse same styling

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      alert('Invalid reset link. Please request a new password reset.');
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      alert('Password updated successfully! You can now login with your new password.');
      navigate('/');
      
    } catch (error) {
      console.error('Password update error:', error);
      setError('Error updating password. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
          
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </p>
            )}
            
            <button 
              type="submit" 
              className="send-email-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <FaLock /> Update Password
                </>
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
