import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { getPDFs, createPDF, updatePDF, deletePDF } from '../../utils/pdfService';
import './ManagePDF.css';

const ManagePDF = () => {
  const [pdfs, setPdfs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPDF, setEditingPDF] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const data = await getPDFs();
      setPdfs(data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      // ✅ Mock data for development
      const mockPdfs = [
        {
          id: 1,
          title: 'SBI PO Previous Year Questions',
          description: 'Complete collection of SBI PO previous year questions',
          image_path: '/images/sbi-po.jpg',
          tags: ['sbi po', 'practice sets', 'PYQs'],
          size_mb: 5.2,
          preview_link: 'https://drive.google.com/preview1',
          download_link: 'https://drive.google.com/download1'
        },
        {
          id: 2,
          title: 'Banking Awareness Notes',
          description: 'Comprehensive banking awareness study material',
          image_path: '/images/banking-notes.jpg',
          tags: ['banking', 'notes', 'general awareness'],
          size_mb: 3.8,
          preview_link: 'https://drive.google.com/preview2',
          download_link: 'https://drive.google.com/download2'
        }
      ];
      setPdfs(mockPdfs);
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

  // ✅ Fixed Submit Handler - Main Fix for Update Issue
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.title || !formData.description) {
        alert('Title and description are required');
        return;
      }

      if (editingPDF) {
        // ✅ Update existing PDF
        console.log('Updating PDF with ID:', editingPDF.id);
        console.log('Form data:', formData);
        
        const updatedPDF = await updatePDF(editingPDF.id, formData);
        console.log('Updated PDF:', updatedPDF);
        
        // Update local state
        setPdfs(prev => prev.map(pdf => 
          pdf.id === editingPDF.id ? updatedPDF : pdf
        ));
        
        alert('PDF updated successfully!');
      } else {
        // ✅ Create new PDF
        const newPDF = await createPDF(formData);
        setPdfs(prev => [newPDF, ...prev]);
        alert('PDF created successfully!');
      }
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert(`Error: ${error.message}`);
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
  };

  const handleDelete = async (pdfId) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      try {
        setLoading(true);
        await deletePDF(pdfId);
        setPdfs(prev => prev.filter(pdf => pdf.id !== pdfId));
        alert('PDF deleted successfully!');
      } catch (error) {
        console.error('Error deleting PDF:', error);
        alert(`Error: ${error.message}`);
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
  };

  if (loading && pdfs.length === 0) {
    return <div className="loading">Loading PDFs...</div>;
  }

  return (
    <div className="manage-pdf-page">
      <div className="page-header">
        <h1>Manage PDFs</h1>
        <button 
          className="add-pdf-btn"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <FaPlus /> Add New PDF
        </button>
      </div>

      {showForm && (
        <div className="pdf-form-overlay">
          <form className="pdf-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>{editingPDF ? 'Edit PDF' : 'Add New PDF'}</h2>
              <button type="button" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <div className="form-group">
              <label>Image Path:</label>
              <input
                type="text"
                name="image_path"
                value={formData.image_path}
                onChange={handleInputChange}
                placeholder="/images/pdf-thumbnail.jpg"
              />
            </div>

            <div className="form-group">
              <label>Title: *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description: *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Tags:</label>
              <select
                multiple
                value={formData.tags}
                onChange={handleTagSelect}
                className="tag-select"
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
                step="0.01"
                name="size_mb"
                value={formData.size_mb}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Preview Link:</label>
              <input
                type="url"
                name="preview_link"
                value={formData.preview_link}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Download Link:</label>
              <input
                type="url"
                name="download_link"
                value={formData.download_link}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading}
              >
                <FaSave /> {loading ? 'Saving...' : 'Save PDF'}
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

      <div className="pdf-list">
        {pdfs.map(pdf => (
          <div key={pdf.id} className="pdf-item">
            <img 
              src={pdf.image_path || '/images/default-pdf.jpg'} 
              alt={pdf.title}
              onError={(e) => {
                e.target.src = '/images/default-pdf.jpg';
              }}
            />
            <div className="pdf-details">
              <h3>{pdf.title}</h3>
              <p>{pdf.description}</p>
              <div className="pdf-meta">
                <span>Size: {pdf.size_mb}MB</span>
                <span>Tags: {pdf.tags?.join(', ') || 'No tags'}</span>
              </div>
            </div>
            <div className="pdf-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(pdf)}
                disabled={loading}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(pdf.id)}
                disabled={loading}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePDF;
