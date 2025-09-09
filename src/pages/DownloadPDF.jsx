import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PDFCard from '../components/PDFCard';
import PDFFilters from '../components/PDFFilters';
import { getPDFs } from '../utils/pdfService';
import './DownloadPDF.css';

const DownloadPDF = () => {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Available filter options
  const filterOptions = [
    'practice sets', 'PYQs', 'notes', 'quant', 'reasoning', 'english', 
    'general awareness', 'hindi', 'computer', 'other'
  ];

  useEffect(() => {
    fetchPDFs();
  }, []);

  useEffect(() => {
    filterPDFs();
  }, [selectedFilters, pdfs]);

  const fetchPDFs = async () => {
    try {
      const data = await getPDFs();
      setPdfs(data);
      setFilteredPdfs(data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPDFs = () => {
    if (selectedFilters.length === 0) {
      setFilteredPdfs(pdfs);
    } else {
      const filtered = pdfs.filter(pdf => 
        selectedFilters.some(filter => pdf.tags.includes(filter))
      );
      setFilteredPdfs(filtered);
    }
  };

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  if (loading) return <div className="loading">Loading PDFs...</div>;

  return (
    <div className="download-pdf-page">
      <div className="page-header">
        <h1>Download PDFs</h1>
        <p>Access study materials, practice sets, and previous year questions</p>
      </div>

      <PDFFilters 
        options={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <div className="pdf-grid">
        {filteredPdfs.map(pdf => (
          <PDFCard key={pdf.id} pdf={pdf} />
        ))}
      </div>

      {filteredPdfs.length === 0 && (
        <div className="no-results">
          <p>No PDFs found for selected filters</p>
        </div>
      )}
    </div>
  );
};

export default DownloadPDF;
