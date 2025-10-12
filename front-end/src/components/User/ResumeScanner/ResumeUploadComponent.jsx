import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const ResumeUploadComponent = ({ onFileUpload, onJdChange, onScanResume, isLoading, uploadedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [jd, setJd] = useState('');

  // Use uploadedFile from parent or fallback to local state
  const currentFile = uploadedFile;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      onFileUpload(droppedFile);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onFileUpload(selectedFile);
    }
  };

  const handleJdChange = (e) => {
    setJd(e.target.value);
    onJdChange(e.target.value);
  };

  const removeFile = () => {
    onFileUpload(null);
  };

  const handleScanResume = () => {
    if (currentFile && jd.trim()) {
      if (onScanResume) {
        onScanResume(currentFile, jd);
      } else {
        // Fallback for backward compatibility
        onFileUpload(currentFile, jd);
      }
    }
  };

  return (
    <div className="xl:sticky xl:top-4 xl:z-10 space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border-2 border-green-500">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-black mb-2 sm:mb-3 lg:mb-4">Upload Resume</h2>
        
        {!currentFile ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-colors ${
              dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-green-500 mb-2 sm:mb-3 lg:mb-4" />
              <p className="text-black font-medium text-xs sm:text-sm lg:text-base mb-1 sm:mb-2">
                <span className="hidden sm:inline">Drop your resume here or click to browse</span>
                <span className="sm:hidden">Tap to upload resume</span>
              </p>
              <p className="text-gray-600 text-xs sm:text-sm">
                Supports PDF, DOC, DOCX files
              </p>
            </label>
          </div>
        ) : (
          <div className="border-2 border-green-500 bg-green-50 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="pflex flex-col items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 text-wrap" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm lg:text-base font-medium text-green-800 truncate">
                    {currentFile.name}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
              </div>
              <button
                onClick={removeFile}
                className="ml-2 sm:m-0 text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
            <div className="mt-3 flex items-center">
              <div className="flex-1 bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full w-full"></div>
              </div>
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-green-800">Uploaded</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border-2 border-green-500">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-black mb-2 sm:mb-3 lg:mb-4">Job Description</h2>
        <textarea 
          value={jd}
          onChange={handleJdChange}
          placeholder="Eg : A skilled prompt engineer..."
          className="w-full h-24 sm:h-32 lg:h-40 p-2 sm:p-3 lg:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black text-xs sm:text-sm lg:text-base"
          disabled={isLoading}
        />
      </div>

      <button 
        onClick={handleScanResume}
        disabled={!currentFile || !jd.trim() || isLoading}
        className="w-full bg-green-500 text-white py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-lg font-semibold text-xs sm:text-sm lg:text-base hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Scanning Resume...' : 'Scan Resume'}
      </button>
    </div>
  );
};

export default ResumeUploadComponent;