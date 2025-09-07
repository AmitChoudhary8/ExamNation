import React from 'react';
import './SupportUs.css';

const SupportUs = () => {
  const handleDonateClick = () => {
    // UPI payment link - Replace with your actual UPI ID
    const upiId = 'amitjaat8@ptyes'; // Replace with your UPI ID
    const amount = '49'; // Optional default amount
    const note = 'ExamNation Website Support';
    
    const upiLink = `upi://pay?pa=${upiId}&pn=ExamNation&am=${amount}&tn=${note}`;
    
    // Try to open UPI link, fallback to payment apps
    window.location.href = upiLink;
  };

  return (
    <div className="support-us-container">
      <div className="support-us-content">
        
        {/* Title */}
        <h1 className="support-title">Support Us</h1>
        
        {/* QR Code Section */}
        <div className="qr-section">
          <div className="qr-container">
            <img 
              src="/public/qrcode.png" 
              alt="Donation QR Code" 
              className="qr-code"
            />
          </div>
          
          {/* Scan to Donate Text */}
          <h2 className="scan-text">Scan to Donate</h2>
          
          {/* Donate Button */}
          <button 
            className="donate-button"
            onClick={handleDonateClick}
          >
            Click to Donate
          </button>
        </div>
        
        {/* Support Message */}
        <div className="support-message">
          <p>
            This is a free website. To keep our service running, please 
            donate something.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportUs;
