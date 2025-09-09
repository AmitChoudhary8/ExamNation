import React from 'react';
import './PDFFilters.css';

const PDFFilters = ({ options, selectedFilters, onFilterChange }) => {
  const handleFilterClick = (filter) => {
    if (selectedFilters.includes(filter)) {
      // Remove filter if already selected
      onFilterChange(selectedFilters.filter(item => item !== filter));
    } else {
      // Add filter if not selected
      onFilterChange([...selectedFilters, filter]);
    }
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="pdf-filters-container">
      <div className="filters-header">
        <h3>Filter PDFs</h3>
        {selectedFilters.length > 0 && (
          <button className="clear-all-btn" onClick={clearAllFilters}>
            Clear All ({selectedFilters.length})
          </button>
        )}
      </div>
      
      <div className="pdf-filters">
        {options.map((option, index) => (
          <button
            key={index}
            className={`filter-btn ${selectedFilters.includes(option) ? 'selected' : ''}`}
            onClick={() => handleFilterClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PDFFilters;
