import React, { useState } from 'react';
import { FiArrowLeft, FiPhone, FiMail, FiMapPin, FiMessageSquare, FiUser, FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './ContactAbout.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

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
              <FiMail size={32} />
            </div>
            <h1 className="page-title">Contact Us</h1>
            <p className="page-subtitle">We'd love to hear from you! Get in touch with us.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <div className="container">
          <div className="content-grid">
            
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions about banking exam preparation? Need help with study materials? Contact us through any of these channels:</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <FiPhone size={24} />
                  </div>
                  <div className="method-details">
                    <h3>Phone Support</h3>
                    <p>+91 7297892424</p>
                    <span>Mon-Fri, 9:00 AM - 6:00 PM</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <FiMail size={24} />
                  </div>
                  <div className="method-details">
                    <h3>Email Support</h3>
                    <p>info.amitsihag@gmail.com</p>
                    <span>We'll respond within 24 hours</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <FiMapPin size={24} />
                  </div>
                  <div className="method-details">
                    <h3>Office Address</h3>
                    <p>Pallu, Hanumangarh<br />Rajasthan, India - 335524</p>
                    <span>Visit us during business hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    <FiUser size={16} />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FiMail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <FiMessageSquare size={16} />
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  <FiSend size={18} />
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
