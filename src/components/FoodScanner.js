'use client';
import { useState, useRef } from 'react';

export default function FoodScanner({ onResult, loading = false }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      setPreview(e.target.result);
      onResult(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="food-scanner" role="region" aria-label="Food photo scanner">
      <div
        className={`scanner-dropzone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''} ${loading ? 'analyzing' : ''}`}
        onClick={() => !loading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        role="button"
        tabIndex={0}
        aria-label="Click or drag to upload food photo"
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
      >
        {loading && (
          <div className="scanner-analyzing">
            <div className="scanner-pulse"></div>
            <span>Analyzing with AI...</span>
          </div>
        )}
        {preview && !loading ? (
          <img src={preview} alt="Food preview" className="scanner-preview" />
        ) : !loading ? (
          <div className="scanner-placeholder">
            <span className="scanner-icon">📸</span>
            <span className="scanner-text">Tap to scan your food</span>
            <span className="scanner-subtext">or drag & drop a photo</span>
          </div>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFile(e.target.files[0])}
          className="scanner-input"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
