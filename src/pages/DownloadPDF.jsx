import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PDFCard from '../components/PDFCard';
import PDFFilters from '../components/PDFFilters';
import { getPDFs } from '../utils/pdfService';
import './DownloadPDF.css';

const DownloadPDF = ({ isLoggedIn, userData }) => {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // ✅ Added search state

  // Available filter options
  const filterOptions = [
    'practice sets', 'PYQs', 'notes', 'quant', 'reasoning', 'english', 
    'general awareness', 'hindi', 'computer', 'other'
  ];

  useEffect(() => {
    fetchPDFs();
  }, []);

  useEffect(() => {
    filterAndSearchPDFs();
  }, [selectedFilters, pdfs, searchQuery]); // ✅ Added searchQuery dependency

  const fetchPDFs = async () => {
    try {
      const data = await getPDFs();
      setPdfs(data);
      setFilteredPdfs(data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      // ✅ Mock data if API fails
      const mockData = [
        {
          id: 1,
          title: 'SBI PO Previous Year Questions',
          description: 'Complete collection of SBI PO previous year questions with solutions',
          image_path: '/images/sbi-po.jpg',
          tags: ['sbi po', 'practice sets', 'PYQs'],
          size_mb: 5.2,
          average_rating: 4.5,
          total_ratings: 125,
          preview_link: 'https://drive.google.com/preview-link',
          download_link: 'https://drive.google.com/download-link'
        },
        {
          id: 2,
          title: 'Banking Awareness Complete Notes',
          description: 'Comprehensive banking awareness study material for all banking exams',
          image_path: '/images/banking-notes.jpg',
          tags: ['banking', 'notes', 'general awareness'],
          size_mb: 3.8,
          average_rating: 4.2,
          total_ratings: 89,
          preview_link: 'https://drive.google.com/preview-link2',
          download_link: 'https://drive.google.com/download-link2'
        },
        {
          id: 3,
          title: 'Quantitative Aptitude Practice Sets',
          description: 'Advanced quantitative aptitude practice sets with detailed solutions',
          image_path: '/images/quant-practice.jpg',
          tags: ['quant', 'practice sets', 'reasoning'],
          size_mb: 4.5,
          average_rating: 4.7,
          total_ratings: 156,
          preview_link: 'https://drive.google.com/preview-link3',
          download_link: 'https://drive.google.com/download-link3'
        }
      ];
      setPdfs(mockData);
      setFilteredPdfs(mockData);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Combined filter and search function
  const filterAndSearchPDFs = () => {
    let filtered = pdfs;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(pdf => 
        pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply tag filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(pdf => 
        selectedFilters.some(filter => 
          pdf.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    }

    setFilteredPdfs(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  // ✅ Search handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) return <div className="loading">Loading PDFs...</div>;

  return (
    <div className="download-pdf-page">
      <div className="page-header">
        <h1>Download PDFs</h1>
        <p>Access study materials, practice sets, and previous year questions</p>
        
        {/* ✅ Integrated Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search PDFs, titles, or topics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="search-info">
              Found {filteredPdfs.length} results for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <PDFFilters 
        options={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <div className="pdf-grid">
        {filteredPdfs.map(pdf => (
          <PDFCard 
            key={pdf.id} 
            pdf={pdf} 
            isLoggedIn={isLoggedIn} // ✅ Pass authentication props
            userData={userData}
          />
        ))}
      </div>

      {filteredPdfs.length === 0 && !loading && (
        <div className="no-results">
          <div className="no-results-icon">📄</div>
          <h3>No PDFs Found</h3>
          <p>
            {searchQuery || selectedFilters.length > 0
              ? 'Try adjusting your search or filters'
              : 'No study materials available at the moment'
            }
          </p>
          {(searchQuery || selectedFilters.length > 0) && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters([]);
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadPDF;
