import React from 'react';
import { FaNewspaper } from 'react-icons/fa';

const Magazines = () => {
  return (
    <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', color: '#4A90E2', marginBottom: '20px' }}>
        <FaNewspaper />
      </div>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Current Affairs Magazines</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>Monthly magazine updates</p>
    </div>
  );
};

export default Magazines;
