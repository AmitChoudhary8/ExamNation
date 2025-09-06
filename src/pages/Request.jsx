import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const Request = () => {
  return (
    <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', color: '#4A90E2', marginBottom: '20px' }}>
        <FaPaperPlane />
      </div>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Request Material or Suggest</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>Request or suggest study material</p>
    </div>
  );
};

export default Request;
