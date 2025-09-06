import React from 'react';
import { FaFilePdf } from 'react-icons/fa';

const DownloadPDF = () => {
  return (
    <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', color: '#4A90E2', marginBottom: '20px' }}>
        <FaFilePdf />
      </div>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Download PDFs</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>Everything you need for exam preparation</p>
    </div>
  );
};

export default DownloadPDF;
