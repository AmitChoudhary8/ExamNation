import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Multiselect from 'multiselect-react-dropdown';
import { getPDFs, createPDF, updatePDF, deletePDF } from '/src/utils/pdfService';
import './ManagePDF.css';

const ManagePDF = () => {
  const [pdfs, setPdfs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPDF, setEditingPDF] = useState(null);
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
  ].map(tag => ({ name: tag, id: tag }));

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const data = await getPDFs();
      setPdfs(data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagSelect = (selectedList) => {
    setFormData({
      ...formData,
      tags: selectedList.map(tag => tag.name)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPDF) {
        await updatePDF(editingPDF.id, formData);
      } else {
        await createPDF(formData);
      }
      await fetchPDFs();
      resetForm();
    } catch (error) {
      console.error('Error saving PDF:', error);
    }
  };

  const handleEdit = (pdf) => {
    setEditingPDF(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      image_path: pdf.image_path,
      tags: pdf.tags,
      size_mb: pdf.size_mb,
      preview_link: pdf.preview_link,
      download_link: pdf.download_link
    });
    setShowForm(true);
  };

  const handleDelete = async (pdfId) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      try {
        await deletePDF(pdfId);
        await fetchPDFs();
      } catch (error) {
        console.error('Error deleting PDF:', error);
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

  return (
    <div className="manage-pdf-page">
      <div className="page-header">
        <h1>Manage PDFs</h1>
        <button 
          className="add-pdf-btn"
          onClick={() => setShowForm(true)}
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
                required
              />
            </div>

            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
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
              <Multiselect
                options={tagOptions}
                selectedValues={formData.tags.map(tag => ({ name: tag, id: tag }))}
                onSelect={handleTagSelect}
                onRemove={handleTagSelect}
                displayValue="name"
                placeholder="Select tags"
                showCheckbox
              />
            </div>

            <div className="form-group">
              <label>Size (MB):</label>
              <input
                type="number"
                step="0.01"
                name="size_mb"
                value={formData.size_mb}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Preview Link:</label>
              <input
                type="url"
                name="preview_link"
                value={formData.preview_link}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Download Link:</label>
              <input
                type="url"
                name="download_link"
                value={formData.download_link}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <FaSave /> Save PDF
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pdf-list">
        {pdfs.map(pdf => (
          <div key={pdf.id} className="pdf-item">
            <img src={pdf.image_path} alt={pdf.title} />
            <div className="pdf-details">
              <h3>{pdf.title}</h3>
              <p>{pdf.description}</p>
              <div className="pdf-meta">
                <span>Size: {pdf.size_mb}MB</span>
                <span>Rating: {pdf.average_rating}/5</span>
              </div>
            </div>
            <div className="pdf-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(pdf)}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(pdf.id)}
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
