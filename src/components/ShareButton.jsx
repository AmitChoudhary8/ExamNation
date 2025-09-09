import React, { useState } from 'react';
import { FaShare, FaCheck } from 'react-icons/fa';
import './ShareButton.css';

const ShareButton = ({ url, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const fullUrl = `${window.location.origin}${url}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <button 
      className={`share-btn ${className} ${copied ? 'copied' : ''}`}
      onClick={handleShare}
      title={copied ? 'Link copied!' : 'Share this PDF'}
    >
      {copied ? <FaCheck /> : <FaShare />}
    </button>
  );
};

export default ShareButton;
