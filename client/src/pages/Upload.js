import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { certificateAPI } from '../services/api';
import blockchainService from '../services/blockchain';
import { toast } from 'react-toastify';

const Upload = () => {
  const { user, isConnected } = useAuth();
  const { emitEvent } = useWebSocket();
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    courseName: '',
    institution: '',
    issueDate: '',
    description: '',
  });
  
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedCertificate, setUploadedCertificate] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    // Validate file type (allow common certificate formats)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please select a valid certificate file (PDF, DOC, DOCX, JPG, PNG)');
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    toast.success('File selected successfully');
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const required = ['recipientName', 'recipientEmail', 'courseName', 'institution', 'issueDate'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }

    if (!file) {
      toast.error('Please select a certificate file');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      // Step 1: Generate file hash
      toast.info('Generating certificate hash...');
      const fileHash = await blockchainService.generateFileHash(file);
      
      // Step 2: Initialize blockchain service
      await blockchainService.initialize();
      
      // Step 3: Prepare certificate data
      const certificateData = {
        ...formData,
        hash: fileHash,
        issuer: user.address,
        recipient: formData.recipientEmail,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadTimestamp: new Date().toISOString()
        }
      };

      // Step 4: Issue certificate on blockchain (mock for now)
      toast.info('Recording certificate on blockchain...');
      const blockchainResult = await blockchainService.issueCertificate(certificateData);
      
      // Step 5: Upload to backend
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('certificateData', JSON.stringify({
        ...certificateData,
        certificateId: blockchainResult.certificateId,
        transactionHash: blockchainResult.transactionHash
      }));

      toast.info('Uploading certificate file...');
      const apiResult = await certificateAPI.uploadCertificate(uploadFormData);
      
      // Step 6: Success
      const completeCertificate = {
        ...apiResult,
        ...blockchainResult,
        formData
      };
      
      setUploadedCertificate(completeCertificate);
      
      // Emit WebSocket event
      emitEvent('certificateUploaded', {
        certificateId: completeCertificate.certificateId,
        issuer: user.address,
        recipient: formData.recipientName
      });
      
      toast.success('Certificate issued successfully!');
      
      // Reset form
      setFormData({
        recipientName: '',
        recipientEmail: '',
        courseName: '',
        institution: '',
        issueDate: '',
        description: '',
      });
      setFile(null);
      
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error(error.message || 'Failed to upload certificate');
    } finally {
      setUploading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection Required</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to upload and issue certificates.
          </p>
        </div>
      </div>
    );
  }

  if (uploadedCertificate) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate Issued Successfully!</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                  {uploadedCertificate.certificateId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaction Hash</p>
                <p className="font-mono text-sm bg-white px-2 py-1 rounded border break-all">
                  {uploadedCertificate.transactionHash}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-semibold">{uploadedCertificate.formData.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-semibold">{uploadedCertificate.formData.courseName}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setUploadedCertificate(null)}
              className="btn-primary"
            >
              Issue Another Certificate
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Issue Certificate</h1>
        <p className="text-gray-600">
          Upload and issue tamper-proof certificates that will be stored on the blockchain and IPFS.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate File</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your certificate file here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse (PDF, DOC, DOCX, JPG, PNG • Max 10MB)
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-primary cursor-pointer inline-block"
                  >
                    Select File
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Certificate Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter recipient's full name"
                required
              />
            </div>

            <div>
              <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email *
              </label>
              <input
                type="email"
                id="recipientEmail"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter recipient's email"
                required
              />
            </div>

            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                Course/Program Name *
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter course or program name"
                required
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Institution *
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter institution name"
                required
              />
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="input-field"
                placeholder="Enter additional details about the certificate"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading || !file}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Issue Certificate</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;