import React, { useState } from 'react';
import axios from 'axios';
import './DragDropUpload.css'; 

const DragDropUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false); 

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
    setIsDragging(false); 
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true); 
  };

  const handleDragLeave = () => {
    setIsDragging(false); 
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful', response.data);
    } catch (error) {
      console.error('Upload error', error);
    }
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`drag-drop-area ${isDragging ? 'dragging' : ''}`} 
      >
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <p className="drag-drop-text">Drag and drop an image here</p>
        )}
      </div>
      {selectedFile && (
        <div className="upload-btn-container">
          <button className="upload-button" onClick={handleUpload}>Upload Image</button>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
