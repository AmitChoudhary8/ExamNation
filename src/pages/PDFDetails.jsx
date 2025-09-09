import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaDownload, FaEye, FaShare, FaLock } from 'react-icons/fa';
import ShareButton from '../components/ShareButton';
import { getPDFByTitle, ratePDF, getUserRating } from '../utils/pdfService';
import './PDFDetails.css';

const PDFDetails = ({ isLoggedIn, userData }) => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchPDF();
  }, [title]);

  useEffect(() => {
    if (isLoggedIn && pdf) {
      checkUserRating();
    }
  }, [isLoggedIn, pdf]);

  const fetchPDF = async () => {
    try {
      const pdfTitle = title.replace(/-/g, ' ');
      const data = await getPDFByTitle(pdfTitle);
      setPdf(data);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      // ✅ Mock data if API fails
      const mockPdf = {
        id: 1,
        title: pdfTitle,
        description: 'Complete study material with detailed explanations and practice questions for competitive exams.',
        image_path: '/images/sample-pdf.jpg',
        tags: ['practice sets', 'study material', 'competitive exams'],
        size_mb: 5.2,
        average_rating: 4.5,
        total_ratings: 125,
        preview_link: 'https://drive.google.com/preview-link',
        download_link: 'https://drive.google.com/download-link'
      };
      setPdf(mockPdf);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if user has already rated this PDF
  const checkUserRating = async () => {
    if (!userData?.user_id) return;
    
    try {
      const rating = await getUserRating(pdf.id, userData.user_id);
      if (rating) {
        setUserRating(rating.rating);
        setHasRated(true);
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  // ✅ Handle rating with authentication check
  const handleRating = async (rating) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (hasRated) {
      alert('You have already rated this PDF');
      return;
    }

    try {
      await ratePDF(pdf.id, rating, userData.user_id);
      setUserRating(rating);
      setHasRated(true);
      // Refresh PDF data to get updated ratings
      await fetchPDF();
    } catch (error) {
      console.error('Rating error:', error);
      alert('Error submitting rating. Please try again.');
    }
  };

  // ✅ Handle download with authentication check
  const handleDownload = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    window.open(pdf.download_link, '_blank');
  };

  // ✅ Handle preview with authentication check
  const handlePreview = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    window.open(pdf.preview_link, '_blank');
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`star ${index < (interactive ? hoverRating || userRating : rating) ? 'filled' : 'empty'}`}
        onClick={interactive && !hasRated ? () => handleRating(index + 1) : undefined}
        onMouseEnter={interactive && !hasRated ? () => setHoverRating(index + 1) : undefined}
        onMouseLeave={interactive && !hasRated ? () => setHoverRating(0) : undefined}
        style={{ cursor: interactive && !hasRated ? 'pointer' : 'default' }}
      />
    ));
  };

  if (loading) return <div className="loading">Loading PDF details...</div>;
  if (!pdf) return <div className="error">PDF not found</div>;

  return (
    <div className="pdf-details-page">
      <div className="pdf-details-container">
        <div className="pdf-image">
          <img src={pdf.image_path} alt={pdf.title} />
        </div>
        
        <div className="pdf-info">
          <h1 className="pdf-title">{pdf.title}</h1>
          
          <div className="pdf-description">
            <p>{pdf.description}</p>
          </div>
          
          <div className="pdf-tags">
            {pdf.tags?.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="pdf-size">
            <strong>Size:</strong> {pdf.size_mb} MB
          </div>
          
          <div className="pdf-rating-section">
            <div className="current-rating">
              <h3>Current Rating:</h3>
              <div className="rating-display">
                {renderStars(Math.round(pdf.average_rating || 0))}
                <span className="rating-text">
                  {pdf.average_rating?.toFixed(1) || '0.0'}/5.0 ({pdf.total_ratings || 0} ratings)
                </span>
              </div>
            </div>
            
            <div className="user-rating">
              <h3>Rate this PDF:</h3>
              {isLoggedIn ? (
                <div className="rating-stars">
                  {renderStars(5, true)}
                  {hasRated && (
                    <p className="rated-message">
                      ✅ You rated this PDF {userRating}/5 stars
                    </p>
                  )}
                </div>
              ) : (
                <div className="login-required">
                  <FaLock /> Please login to rate this PDF
                </div>
              )}
            </div>
          </div>
          
          <div className="pdf-actions">
            {/* ✅ Download with authentication check */}
            <button
              onClick={handleDownload}
              className={`action-btn download-btn ${!isLoggedIn ? 'disabled' : ''}`}
              title={!isLoggedIn ? 'Please login to download' : 'Download PDF'}
            >
              <FaDownload /> {isLoggedIn ? 'Download' : 'Login to Download'}
            </button>
            
            {/* ✅ Preview with authentication check */}
            <button
              onClick={handlePreview}
              className={`action-btn preview-btn ${!isLoggedIn ? 'disabled' : ''}`}
              title={!isLoggedIn ? 'Please login to preview' : 'Preview PDF'}
            >
              <FaEye /> {isLoggedIn ? 'Preview' : 'Login to Preview'}
            </button>
            
            <ShareButton 
              url={window.location.href}
              className="action-btn share-btn"
            />
          </div>
        </div>
      </div>

      {/* ✅ Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt" onClick={e => e.stopPropagation()}>
            <h3>Login Required</h3>
            <p>You need to login to access PDF downloads, previews, and rating features.</p>
            <div className="prompt-actions">
              <button 
                className="login-btn"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/');
                }}
              >
                Go to Login
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFDetails;
