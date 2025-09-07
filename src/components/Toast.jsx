import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaTimesCircle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-show' : ''}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
