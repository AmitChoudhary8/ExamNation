import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { FaCheckCircle } from 'react-icons/fa';

function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('error');
          return;
        }

        if (data.session) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        textAlign: 'center'
      }}>
        
        <div style={{ marginBottom: '30px' }}>
          <img src="/logo.png" alt="ExamNation" style={{ height: '60px' }} />
        </div>
        
        {status === 'verifying' && (
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4A90E2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <FaCheckCircle size={64} color="#28a745" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#28a745', marginBottom: '16px' }}>
              Congratulations!
            </h2>
            <p style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
              Your account has been successfully verified.
            </p>
            <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>
              Thank you for trusting us!
            </p>
            
            <button 
              onClick={handleGoHome}
              style={{
                background: '#4A90E2',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Go to Home
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#dc3545', marginBottom: '16px' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
              The verification link has expired or is invalid.
            </p>
            
            <button 
              onClick={handleGoHome}
              style={{
                background: '#4A90E2',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Home
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default AuthCallback;

