import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './ManagePDF.css';

// ✅ Mock service functions for development
const mockPDFs = [
  {
    id: 1,
    title: 'SBI PO Previous Year Questions',
    description: 'Complete collection of SBI PO previous year questions with solutions',
    image_path: '/images/sbi-po.jpg',
    tags: ['sbi po', 'practice sets', 'PYQs'],
    size_mb: 5.2,
    preview_link: 'https://drive.google.com/preview1',
    download_link: 'https://drive.google.com/download1',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Banking Awareness Complete Notes',
    description: 'Comprehensive banking awareness study material for all banking exams',
    image_path: '/images/banking-notes.jpg',
    tags: ['banking', 'notes', 'general awareness'],
    size_mb: 3.8,
    preview_link: 'https://drive.google.com/preview2',
    download_link: 'https://drive.google.com/download2',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Quantitative Aptitude Practice Sets',
    description: 'Advanced quantitative aptitude practice sets with detailed solutions',
    image_path: '/images/quant-practice.jpg',
    tags: ['quant', 'practice sets', 'reasoning'],
    size_mb: 4.5,
    preview_link: 'https://drive.google.com/preview3',
    download_link: 'https://drive.google.com/download3',
    created_at: new Date().toISOString()
  }
];

// ✅ Mock API functions (replace with real API calls later)
const mockAPI = {
  getPDFs: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    return [...mockPDFs];
  },
  
  createPDF: async (pdfData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPDF = {
      ...pdfData,
      id: Math.max(...mockPDFs.map(p => p.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockPDFs.push(newPDF);
    return newPDF;
  },
  
  updatePDF: async (id, pdfData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPDFs.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('PDF not found');
    }
    
    const updatedPDF = {
      ...mockPDFs[index],
      ...pdfData,
      id: id, // Ensure ID stays the same
      updated_at: new Date().toISOString()
    };
    
    mockPDFs[index] = updatedPDF;
    return updatedPDF;
  },
  
  deletePDF: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPDFs.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('PDF not found');
    }
    mockPDFs.splice(index, 1);
    return true;
  }
};

const ManagePDF = () => {
  const [pdfs, setPdfs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPDF, setEditingPDF] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_path: '',
    tags: [],
    size_mb: '',
    preview_link: '',
    download_link: ''
  });

  const tagOptions = [
    'practice sets', 'PYQs', 'notes', 'quant', 'reasoning', 'english',
    'general awareness', 'hindi', 'computer', 'sbi po', 'sbi clerk',
    'ibps po', 'ibps clerk', 'rrb po', 'rrb clerk', 'insurance',
    'RBI grade B', 'NABARD', 'others'
  ];

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      setError('');
      
      // ✅ Use mock API for now
      const data = await mockAPI.getPDFs();
      setPdfs(data);
      
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setError('Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions
    }));
  };

  // ✅ Enhanced submit handler - Main fix for update issue
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      if (editingPDF) {
        // ✅ Update existing PDF with better error handling
        console.log('Updating PDF...', {
          id: editingPDF.id,
          formData: formData
        });
        
        const updatedPDF = await mockAPI.updatePDF(editingPDF.id, formData);
        console.log('PDF updated successfully:', updatedPDF);
        
        // Update local state immediately
        setPdfs(prev => prev.map(pdf => 
          pdf.id === editingPDF.id ? updatedPDF : pdf
        ));
        
        setSuccess('PDF updated successfully!');
        
      } else {
        // ✅ Create new PDF
        console.log('Creating new PDF:', formData);
        
        const newPDF = await mockAPI.createPDF(formData);
        console.log('PDF created successfully:', newPDF);
        
        // Add to local state
        setPdfs(prev => [newPDF, ...prev]);
        
        setSuccess('PDF created successfully!');
      }
      
      // Reset form after successful operation
      resetForm();
      
    } catch (err) {
      console.error('Error saving PDF:', err);
      setError(err.message || 'Failed to save PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pdf) => {
    console.log('Editing PDF:', pdf);
    setEditingPDF(pdf);
    setFormData({
      title: pdf.title || '',
      description: pdf.description || '',
      image_path: pdf.image_path || '',
      tags: pdf.tags || [],
      size_mb: pdf.size_mb || '',
      preview_link: pdf.preview_link || '',
      download_link: pdf.download_link || ''
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (pdf) => {
    if (window.confirm(`Are you sure you want to delete "${pdf.title}"?`)) {
      try {
        setLoading(true);
        setError('');
        
        await mockAPI.deletePDF(pdf.id);
        
        // Remove from local state
        setPdfs(prev => prev.filter(p => p.id !== pdf.id));
        
        setSuccess('PDF deleted successfully!');
        
      } catch (err) {
        console.error('Error deleting PDF:', err);
        setError(err.message || 'Failed to delete PDF');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_path: '',
      tags: [],
      size_mb: '',
      preview_link: '',
      download_link: ''
    });
    setEditingPDF(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="manage-pdf-page">
      <div className="page-header">
        <h1>Manage PDFs</h1>
        <button 
          className="add-pdf-btn"
          onClick={() => {
            setShowForm(true);
            clearMessages();
          }}
          disabled={loading}
        >
          <FaPlus /> Add New PDF
        </button>
      </div>

      {/* ✅ Success/Error Messages */}
      {error && (
        <div className="alert alert-error">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* ✅ PDF Form Modal */}
      {showForm && (
        <div className="pdf-form-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) resetForm();
        }}>
          <form className="pdf-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>{editingPDF ? 'Edit PDF' : 'Add New PDF'}</h2>
              <button type="button" onClick={resetForm} disabled={loading}>
                <FaTimes />
              </button>
            </div>

            <div className="form-content">
              <div className="form-group">
                <label>Title: *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter PDF title"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Description: *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter PDF description"
                  rows="4"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Image Path:</label>
                <input
                  type="text"
                  name="image_path"
                  value={formData.image_path}
                  onChange={handleInputChange}
                  placeholder="/images/pdf-thumbnail.jpg"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Tags:</label>
                <select
                  multiple
                  value={formData.tags}
                  onChange={handleTagSelect}
                  className="tag-select"
                  disabled={loading}
                >
                  {tagOptions.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple tags</small>
              </div>

              <div className="form-group">
                <label>Size (MB):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="size_mb"
                  value={formData.size_mb}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Preview Link:</label>
                <input
                  type="url"
                  name="preview_link"
                  value={formData.preview_link}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/preview-link"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Download Link:</label>
                <input
                  type="url"
                  name="download_link"
                  value={formData.download_link}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/download-link"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading}
              >
                <FaSave /> {loading ? 'Saving...' : (editingPDF ? 'Update PDF' : 'Save PDF')}
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ PDF List */}
      <div className="pdf-list">
        {loading && pdfs.length === 0 ? (
          <div className="loading-message">Loading PDFs...</div>
        ) : pdfs.length === 0 ? (
          <div className="no-pdfs">
            <h3>No PDFs Found</h3>
            <p>Click "Add New PDF" to get started</p>
          </div>
        ) : (
          pdfs.map(pdf => (
            <div key={pdf.id} className="pdf-item">
              <div className="pdf-image">
                <img 
                  src={pdf.image_path || '/images/default-pdf.jpg'} 
                  alt={pdf.title}
                  onError={(e) => {
                    e.target.src = '/images/default-pdf.jpg';
                  }}
                />
              </div>
              
              <div className="pdf-details">
                <h3>{pdf.title}</h3>
                <p>{pdf.description}</p>
                <div className="pdf-meta">
                  <span className="pdf-size">
                    {pdf.size_mb ? `${pdf.size_mb} MB` : 'Size not specified'}
                  </span>
                  <span className="pdf-tags">
                    {pdf.tags && pdf.tags.length > 0 
                      ? pdf.tags.slice(0, 3).join(', ') + (pdf.tags.length > 3 ? '...' : '')
                      : 'No tags'
                    }
                  </span>
                </div>
                <div className="pdf-links">
                  {pdf.preview_link && (
                    <a href={pdf.preview_link} target="_blank" rel="noopener noreferrer" className="link-preview">
                      Preview
                    </a>
                  )}
                  {pdf.download_link && (
                    <a href={pdf.download_link} target="_blank" rel="noopener noreferrer" className="link-download">
                      Download
                    </a>
                  )}
                </div>
              </div>
              
              <div className="pdf-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(pdf)}
                  disabled={loading}
                  title="Edit PDF"
                >
                  <FaEdit />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(pdf)}
                  disabled={loading}
                  title="Delete PDF"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default ManagePDF;
