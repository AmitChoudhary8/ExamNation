import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaNewspaper, FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';
import './HomePage.css';

const sections = [
  {
    icon: <FaDownload size={28}/>,
    title: "Download PDFs",
    desc: "anything you need",
    path: "/download-pdf"
  },
  {
    icon: <FaNewspaper size={28}/>,
    title: "Current Affairs Magazines",
    desc: "monthly magazine",
    path: "/magazines"
  },
  {
    icon: <FaCalendarAlt size={28}/>,
    title: "Exam Calendar and Notifications",
    desc: "every exam notification",
    path: "/calendar"
  },
  {
    icon: <FaPaperPlane size={28}/>,
    title: "Request Material or Suggest",
    desc: "request or suggest study Material",
    path: "/request"
  }
];

const HomePage = () => (
  <div className="container homepage">
    {sections.map((sec, i) => (
      <Link to={sec.path} key={i} className="homepage-card">
        <span className="card-icon">{sec.icon}</span>
        <div>
          <h3>{sec.title}</h3>
          <p>{sec.desc}</p>
        </div>
        <span className="card-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90E2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </span>
      </Link>
    ))}
  </div>
);

export default HomePage;
