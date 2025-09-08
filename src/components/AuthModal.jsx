import React, { useState, useEffect } from 'react';
import { FaTimes, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '/src/utils/supabase';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSwitchToLogin, onSwitchToSignup, onSwitchToForgotPassword, onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot', 'reset', 'emailSent', 'emailVerified'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    examType: 'PO',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const examTypes = ['PO', 'CLERK', 'SO', 'GRADE B', 'INSURANCE', 'OTHER'];

  // Toast Notification Component
  const ToastNotification = () => {
    useEffect(() => {
      if (toast.show) {
        const timer = setTimeout(() => {
          setToast({ show: false, message: '', type: '' });
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [toast.show]);

    if (!toast.show) return null;

    return (
      <div className={`toast toast-${toast.type} ${toast.show ? 'toast-show' : ''}`}>
        <div className="toast-icon">
          {toast.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <div className="toast-message">{toast.message}</div>
        <button className="toast-close" onClick={() => setToast({ show: false, message: '', type: '' })}>
          &times;
        </button>
      </div>
    );
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Generate unique 9-digit user ID
  const generateUserId = async () => {
    const length = 9;
    let userId = '';
    let attempts = 0;
    
    while (attempts < 10) {
      userId = Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
      
      const { data, error } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', parseInt(userId))
        .single();
      
      if (error && error.code === 'PGRST116') {
        setDebugInfo(prev => prev + `\n✅ Generated unique user_id: ${userId}`);
        return parseInt(userId);
      }
      
      attempts++;
      setDebugInfo(prev => prev + `\n⚠️ User ID ${userId} exists, trying again...`);
    }
    
    throw new Error('Could not generate unique user ID');
  };

  const validateForm = (currentMode) => {
    const newErrors = {};
    
    if (currentMode === 'signup') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
      if (!formData.examType) newErrors.examType = 'Please select exam type';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Please accept terms and conditions';
    }
    
    if (currentMode === 'signup' || currentMode === 'login' || currentMode === 'forgot') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    }
    
    if (currentMode === 'signup' || currentMode === 'login' || currentMode === 'reset') {
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }

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

  // ✅ Updated Login Handler with Persistence
  const handleLogin = async (e) => {
    e.preventDefault();
    setDebugInfo('🔄 Starting login process...');
    
    if (!validateForm('login')) return;

    setLoading(true);
    try {
      setDebugInfo(prev => prev + '\n🔐 Attempting Supabase authentication...');
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        setDebugInfo(prev => prev + `\n❌ Auth error: ${authError.message}`);
        
        if (authError.message.includes('Email not confirmed')) {
          showToast('Please verify your email first. Check your email and spam folder.', 'error');
        } else if (authError.message.includes('Invalid')) {
          showToast('Invalid email or password. Please try again.', 'error');
        } else {
          showToast('Login failed. Please try again.', 'error');
        }
        return;
      }

      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        showToast('Error loading user profile. Please try again.', 'error');
        return;
      }

      setDebugInfo(prev => prev + '\n✅ Login successful!');
      showToast(`Welcome back, ${userData.full_name}!`, 'success');
      
      // ✅ Call parent's login success handler (which handles persistence)
      onLoginSuccess(userData);
      
    } catch (error) {
      setDebugInfo(prev => prev + `\n❌ Catch error: ${error.message}`);
      showToast('Login error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Continue with rest of component...
  // ✅ Updated Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setDebugInfo('🔄 Starting signup process...');
    
    if (!validateForm('signup')) return;

    setLoading(true);
    try {
      const userId = await generateUserId();
      setDebugInfo(prev => prev + '\n🔐 Creating Supabase Auth account...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            user_id: userId.toString(),
            full_name: formData.fullName,
            mobile: formData.mobile,
            exam_type: formData.examType
          }
        }
      });

      if (authError) {
        setDebugInfo(prev => prev + `\n❌ Auth signup error: ${authError.message}`);
        
        if (authError.message.includes('already registered')) {
          showToast('Email already registered. Please try logging in.', 'error');
        } else if (authError.message.includes('Signups not allowed')) {
          showToast('New registrations are currently disabled.', 'error');
        } else if (authError.message.includes('Error sending confirmation')) {
          showToast('Account created but email verification failed. Please contact support.', 'error');
        } else {
          showToast(`Signup failed: ${authError.message}`, 'error');
        }
        return;
      }

      setDebugInfo(prev => prev + '\n✅ Auth account created successfully!');
      setMode('emailSent');
      showToast('Account created! Please check your email for verification.', 'success');
      
    } catch (error) {
      setDebugInfo(prev => prev + `\n❌ Catch error: ${error.message}`);
      showToast('Error creating account. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm('forgot')) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        showToast(`Error: ${error.message}`, 'error');
      } else {
        showToast('Password reset link sent to your email!', 'success');
        setMode('login');
      }
    } catch (error) {
      showToast('Error sending reset email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm('reset')) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });
      
      if (error) {
        showToast(`Error: ${error.message}`, 'error');
      } else {
        showToast('Password updated successfully!', 'success');
        navigate('/');
        onClose();
      }
    } catch (error) {
      showToast('Error updating password. Please try again.', 'error');
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
      
      showToast('Verification email sent again. Please check your spam folder.', 'success');
    } catch (error) {
      showToast('Error resending email. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      examType: 'PO',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    setErrors({});
    setDebugInfo('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="auth-overlay">
        <div className="auth-modal">
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
          
          {/* Logo */}
          <div className="modal-logo">
            <img src="/logo.png" alt="ExamNation" />
          </div>
          
          {/* Login Form */}
          {mode === 'login' && (
            <div className="auth-content">
              <h2 className="auth-title">Login to Your Account</h2>
              
              <form onSubmit={handleLogin} className="auth-form">
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

                <div className="form-group">
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'LOGIN'}
                </button>

                <button type="button" className="auth-btn secondary" onClick={() => setMode('signup')}>
                  Create Account
                </button>

                <button type="button" className="forgot-link" onClick={() => setMode('forgot')}>
                  Forgot Password?
                </button>
              </form>
            </div>
          )}

          {/* Rest of the forms remain same... */}
          {/* [Include all other forms like signup, forgot, reset, emailSent as they were] */}

          {/* Debug Info Panel */}
          {debugInfo && (
            <div className="debug-panel">
              <details>
                <summary>Debug Info</summary>
                <pre className="debug-text">{debugInfo}</pre>
                <button onClick={() => setDebugInfo('')} className="clear-debug-btn">
                  Clear Debug
                </button>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification />
    </>
  );
};

export default AuthModal;
