import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaDownload, FaEye, FaShare } from 'react-icons/fa';
import ShareButton from '../components/ShareButton';
import { getPDFByTitle, ratePDF } from '../utils/pdfService';
import './PDFDetails.css';

const PDFDetails = () => {
  const { title } = useParams();
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchPDF();
  }, [title]);

  const fetchPDF = async () => {
    try {
      const pdfTitle = title.replace(/-/g, ' ');
      const data = await getPDFByTitle(pdfTitle);
      setPdf(data);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating) => {
    try {
      await ratePDF(pdf.id, rating);
      setUserRating(rating);
      // Refresh PDF data to get updated ratings
      await fetchPDF();
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`star ${index < (interactive ? hoverRating || userRating : rating) ? 'filled' : 'empty'}`}
        onClick={interactive ? () => handleRating(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
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
            {pdf.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="pdf-size">
            <strong>Size:</strong> {pdf.size_mb} MB
          </div>
          
          <div className="pdf-rating-section">
            <div className="current-rating">
              <h3>Current Rating:</h3>
              {renderStars(Math.round(pdf.average_rating))}
              <span>({pdf.total_ratings} ratings)</span>
            </div>
            
            <div className="user-rating">
              <h3>Rate this PDF:</h3>
              {renderStars(5, true)}
            </div>
          </div>
          
          <div className="pdf-actions">
            <a 
              href={pdf.download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn download-btn"
            >
              <FaDownload /> Download
            </a>
            
            <a 
              href={pdf.preview_link}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn preview-btn"
            >
              <FaEye /> Preview
            </a>
            
            <ShareButton 
              url={window.location.href}
              className="action-btn share-btn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDetails;
