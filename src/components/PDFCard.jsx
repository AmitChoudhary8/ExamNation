import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaShare, FaStar } from 'react-icons/fa';
import ShareButton from './ShareButton';
import { toggleBookmark } from '../utils/pdfService';
import './PDFCard.css';

const PDFCard = ({ pdf, isBookmarked, onBookmarkToggle }) => {
  const handleBookmark = async () => {
    try {
      await toggleBookmark(pdf.id);
      if (onBookmarkToggle) onBookmarkToggle(pdf.id);
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? 'star filled' : 'star empty'}
      />
    ));
  };

  return (
    <div className="pdf-card">
      <div className="card-image">
        <img src={pdf.image_path} alt={pdf.title} />
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{pdf.title}</h3>
        
        <div className="card-tags">
          {pdf.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {pdf.tags.length > 3 && (
            <span className="tag more">+{pdf.tags.length - 3}</span>
          )}
        </div>
        
        <div className="card-rating">
          {renderStars(Math.round(pdf.average_rating))}
          <span className="rating-count">({pdf.total_ratings})</span>
        </div>
        
        <div className="card-actions">
          <Link 
            to={`/download-pdf/${pdf.title.replace(/\s+/g, '-').toLowerCase()}`}
            className="see-more-btn"
          >
            See More
          </Link>
          
          <div className="action-buttons">
            <ShareButton url={`/download-pdf/${pdf.title.replace(/\s+/g, '-').toLowerCase()}`} />
            
            <button 
              className="bookmark-btn" 
              onClick={handleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;
