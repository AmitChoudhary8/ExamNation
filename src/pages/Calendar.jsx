import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const Calendar = () => {
  return (
    <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', color: '#4A90E2', marginBottom: '20px' }}>
        <FaCalendarAlt />
      </div>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Exam Calendar and Notifications</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>Every exam notification</p>
    </div>
  );
};

export default Calendar;
