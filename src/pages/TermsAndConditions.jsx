import React from 'react';
import { FiHome, FiArrowLeft, FiShield, FiFileText, FiUsers, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './TermsAndConditions.css';  // Import CSS file

function TermsAndConditions() {
  const lastUpdated = "September 7, 2025";

  return (
    <div className="terms-page">
      {/* Header */}
      <div className="terms-header">
        <div className="container">
          <Link to="/" className="back-button">
            <FiArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <img src="/logo.png" alt="ExamNation" className="logo" />
        </div>
      </div>

      {/* Main Content */}
      <div className="terms-container">
        <div className="terms-content">
          
          {/* Title Section */}
          <div className="title-section">
            <div className="icon-wrapper">
              <FiFileText size={32} color="#3b82f6" />
            </div>
            <h1 className="page-title">Terms and Conditions</h1>
            <p className="last-updated">Last updated: {lastUpdated}</p>
          </div>

          {/* Introduction */}
          <section className="section">
            <h2 className="section-title">
              <FiShield size={20} color="#3b82f6" />
              1. Introduction and Acceptance
            </h2>
            <p className="section-paragraph">
              Welcome to ExamNation ("we", "our", or "us"). These Terms and Conditions ("Terms") 
              govern your use of our website located at examnation.netlify.app and all related 
              services provided by us.
            </p>
            <p className="section-paragraph">
              By accessing and using our website, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these Terms, please do not 
              use our services.
            </p>
          </section>

          {/* Content Disclaimer */}
          <section className="section">
            <h2 className="section-title">
              <FiFileText size={20} color="#3b82f6" />
              2. Content and Intellectual Property
            </h2>
            <div className="notice-box notice-yellow">
              <p className="notice-title">Important Notice:</p>
              <p className="notice-text">
                All content available on our website, including PDFs, study materials, current affairs 
                magazines, practice sets, and other educational resources, is freely available on the 
                internet from various sources. We do not own or claim ownership of this content.
              </p>
            </div>
            <ul className="section-list">
              <li>We serve as an aggregator platform, collecting and organizing publicly available educational content in one convenient location</li>
              <li>All original copyrights remain with their respective owners</li>
              <li>We do not claim any ownership rights over the educational materials provided</li>
              <li>If you are a copyright owner and believe your content has been used inappropriately, please contact us immediately</li>
              <li>We will promptly remove any content upon valid copyright claims</li>
            </ul>
          </section>

          {/* User Data and Privacy */}
          <section className="section">
            <h2 className="section-title">
              <FiUsers size={20} color="#3b82f6" />
              3. User Data and Marketing
            </h2>
            <div className="notice-box notice-blue">
              <p className="notice-title">Data Usage Policy:</p>
              <p className="notice-text">
                By creating an account and using our services, you consent to our use of your 
                personal information for promotional and marketing purposes.
              </p>
            </div>
            <ul className="section-list">
              <li>We may use your email address and contact information for promotional communications</li>
              <li>Your data may be used to send updates about new study materials, exam notifications, and educational content</li>
              <li>We may contact you regarding new features, services, and improvements to our platform</li>
              <li>You can opt-out of promotional communications at any time by contacting us</li>
              <li>We will never sell your personal information to third parties</li>
              <li>Your data is securely stored and protected according to industry standards</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="section">
            <h2 className="section-title">4. User Responsibilities</h2>
            <p className="section-paragraph">As a user of our platform, you agree to:</p>
            <ul className="section-list">
              <li>Provide accurate and truthful information during registration</li>
              <li>Use the platform solely for educational and personal learning purposes</li>
              <li>Not share your account credentials with others</li>
              <li>Not attempt to hack, disrupt, or damage our systems</li>
              <li>Not use the platform for any illegal or unauthorized purposes</li>
              <li>Respect the intellectual property rights of content creators</li>
              <li>Not redistribute or commercially use the materials without permission</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section className="section">
            <h2 className="section-title">5. Service Availability and Modifications</h2>
            <ul className="section-list">
              <li>We strive to maintain 24/7 availability but cannot guarantee uninterrupted service</li>
              <li>We reserve the right to modify, suspend, or discontinue any part of our service</li>
              <li>We may update content, features, and functionality without prior notice</li>
              <li>Maintenance and updates may temporarily affect service availability</li>
              <li>We are not liable for any inconvenience caused by service interruptions</li>
            </ul>
          </section>

          {/* Account Termination */}
          <section className="section">
            <h2 className="section-title">6. Account Management and Termination</h2>
            <ul className="section-list">
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              <li>Users can delete their accounts at any time by contacting support</li>
              <li>Terminated accounts will lose access to all platform features</li>
              <li>We may retain certain data for legal and operational purposes</li>
              <li>Repeated violations may result in permanent account bans</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="section">
            <h2 className="section-title">7. Disclaimers and Limitations</h2>
            <div className="notice-box notice-red">
              <p className="notice-title">Important Disclaimer:</p>
              <p className="notice-text">
                Our platform is provided "as is" without warranties of any kind. We do not guarantee 
                the accuracy, completeness, or reliability of any content.
              </p>
            </div>
            <ul className="section-list">
              <li>We are not responsible for exam results or career outcomes</li>
              <li>Study materials are supplementary and should be used with other resources</li>
              <li>We do not guarantee that our content is error-free or up-to-date</li>
              <li>Users should verify information from official sources</li>
              <li>We are not liable for any direct or indirect damages from platform use</li>
            </ul>
          </section>

          {/* Updates to Terms */}
          <section className="section">
            <h2 className="section-title">8. Updates to Terms and Conditions</h2>
            <ul className="section-list">
              <li>We may update these Terms at any time without prior notice</li>
              <li>Updated Terms will be posted on this page with a new "Last Updated" date</li>
              <li>Continued use of our platform constitutes acceptance of updated Terms</li>
              <li>Major changes may be communicated via email or platform notifications</li>
              <li>Users are encouraged to review Terms periodically</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="section">
            <h2 className="section-title">
              <FiMail size={20} color="#3b82f6" />
              9. Contact Information
            </h2>
            <p className="section-paragraph">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="contact-box">
              <ul className="contact-list">
                <li><strong>Website:</strong> examnation.netlify.app</li>
                <li><strong>Platform:</strong> ExamNation</li>
                <li><strong>Purpose:</strong> Banking Exam Preparation Platform</li>
                <li><strong>Support:</strong> Available through the platform</li>
              </ul>
            </div>
          </section>

          {/* Agreement */}
          <section className="section border-top">
            <div className="notice-box notice-green">
              <p className="notice-title">Agreement Acknowledgment:</p>
              <p className="notice-text">
                By using ExamNation, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms and Conditions. These terms constitute a legal agreement 
                between you and ExamNation.
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="footer-section">
        <div className="footer-container">
          <Link to="/" className="footer-button">
            <FiHome size={20} />
            Return to ExamNation
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
