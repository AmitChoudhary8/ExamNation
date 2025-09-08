import React from 'react';
import { FiArrowLeft, FiTarget, FiUsers, FiBookOpen, FiAward, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './ContactAbout.css';

function AboutUs() {
  return (
    <div className="page-container">
      {/* Header with Back Button */}
      <div className="page-header">
        <div className="container">
          <Link to="/" className="back-button">
            <FiArrowLeft size={20} />
            <span>Home</span>
          </Link>
          <div className="header-content">
            <div className="icon-wrapper">
              <FiUsers size={32} />
            </div>
            <h1 className="page-title">About ExamNation</h1>
            <p className="page-subtitle">Empowering banking exam aspirants with quality Content</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <div className="container">
          
          {/* About Introduction */}
          <section className="about-intro">
            <h2>Who We Are</h2>
            <p className="intro-text">
              <strong>ExamNation</strong> is your dedicated partner in banking exam preparation. We understand 
              the challenges faced by aspirants and provide comprehensive resources to help you achieve your 
              dreams of a banking career.
            </p>
            <p>
              Founded with the mission to democratize quality content, we aggregate the best study materials, 
              current affairs, and practice resources from across the internet, making them easily accessible 
              in one centralized platform.
            </p>
          </section>

          {/* Our Mission & Values */}
          <section className="mission-values">
            <div className="values-grid">
              
              <div className="value-card">
                <div className="value-icon">
                  <FiTarget size={28} />
                </div>
                <h3>Our Mission</h3>
                <p>To provide comprehensive, accessible, and up-to-date resources for banking exam preparation, helping aspirants achieve their career goals.</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <FiBookOpen size={28} />
                </div>
                <h3>Quality Content</h3>
                <p>We curate and organize the best educational content from trusted sources, ensuring you get accurate and relevant study materials.</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <FiUsers size={28} />
                </div>
                <h3>Community Focus</h3>
                <p>Building a supportive community of learners who share resources, experiences, and motivation on their exam preparation journey.</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <FiAward size={28} />
                </div>
                <h3>Success Driven</h3>
                <p>Your success is our success. We continuously improve our platform based on feedback and the evolving needs of exam patterns.</p>
              </div>

            </div>
          </section>

          {/* What We Offer */}
          <section className="what-we-offer">
            <h2>What We Offer</h2>
            <div className="offer-list">
              <div className="offer-item">
                <FiBookOpen size={20} />
                <div>
                  <h4>Study Materials</h4>
                  <p>Comprehensive PDFs, notes, and guides for all major banking exams including SBI PO, IBPS, and RRB.</p>
                </div>
              </div>
              
              <div className="offer-item">
                <FiTarget size={20} />
                <div>
                  <h4>Current Affairs</h4>
                  <p>Monthly magazines and daily updates to keep you informed about the latest developments.</p>
                </div>
              </div>
              
              <div className="offer-item">
                <FiUsers size={20} />
                <div>
                  <h4>Exam Calendar</h4>
                  <p>Stay updated with important exam dates, notifications, and application deadlines.</p>
                </div>
              </div>
              
              <div className="offer-item">
                <FiHeart size={20} />
                <div>
                  <h4>Free Access</h4>
                  <p>All our resources are available for free, because we believe education should be accessible to everyone.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Commitment */}
          <section className="commitment">
            <div className="commitment-content">
              <h2>Our Commitment</h2>
              <p>
                We are committed to providing a platform that not only offers study materials but also 
                supports your entire learning journey. Our team works tirelessly to:
              </p>
              <ul className="commitment-list">
                <li>Regularly update content to match current exam patterns</li>
                <li>Maintain high-quality, accurate, and relevant resources</li>
                <li>Provide user-friendly access to all materials</li>
                <li>Support the banking exam preparation community</li>
                <li>Continuously improve based on user feedback</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default AboutUs;
