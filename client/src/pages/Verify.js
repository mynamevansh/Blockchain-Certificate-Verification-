import React, { useState } from 'react';
import { certificateAPI } from '../services/api';
import blockchainService from '../services/blockchain';
import { toast } from 'react-toastify';

const Verify = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [certificateId, setCertificateId] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('file'); // 'file' or 'id'

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
    // Validate file type
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
    setVerificationResult(null);
    toast.success('File selected successfully');
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const verifyByFile = async () => {
    if (!file) {
      toast.error('Please select a certificate file');
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    try {
      // Step 1: Generate file hash
      toast.info('Generating certificate hash...');
      const fileHash = await blockchainService.generateFileHash(file);
      
      // Step 2: Check blockchain for certificate
      toast.info('Checking blockchain records...');
      const blockchainResult = await blockchainService.verifyCertificate(fileHash);
      
      // Step 3: Get additional details from backend
      let apiResult = null;
      try {
        const formData = new FormData();
        formData.append('file', file);
        apiResult = await certificateAPI.verifyCertificate(formData);
      } catch (error) {
        console.warn('Backend verification failed, using blockchain data only:', error);
      }

      // Step 4: Combine results
      const result = {
        isValid: blockchainResult.isValid,
        status: blockchainResult.status,
        certificateHash: fileHash,
        verification: {
          blockchain: blockchainResult,
          backend: apiResult
        },
        verificationTime: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size
      };

      setVerificationResult(result);
      
      if (result.isValid && result.status === 'active') {
        toast.success('Certificate is valid and active!');
      } else if (result.isValid && result.status === 'revoked') {
        toast.warning('Certificate is valid but has been revoked');
      } else {
        toast.error('Certificate is not valid');
      }

    } catch (error) {
      console.error('Error verifying certificate:', error);
      toast.error(error.message || 'Failed to verify certificate');
      setVerificationResult({
        isValid: false,
        error: error.message || 'Verification failed',
        verificationTime: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size
      });
    } finally {
      setVerifying(false);
    }
  };

  const verifyById = async () => {
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    try {
      // Step 1: Get certificate details from blockchain
      toast.info('Retrieving certificate details...');
      const blockchainResult = await blockchainService.getCertificateDetails(certificateId);
      
      // Step 2: Get additional details from backend
      let apiResult = null;
      try {
        apiResult = await certificateAPI.getCertificate(certificateId);
      } catch (error) {
        console.warn('Backend lookup failed, using blockchain data only:', error);
      }

      // Step 3: Combine results
      const result = {
        isValid: blockchainResult.status === 'active',
        status: blockchainResult.status,
        certificateId: certificateId,
        verification: {
          blockchain: blockchainResult,
          backend: apiResult
        },
        verificationTime: new Date().toISOString()
      };

      setVerificationResult(result);
      
      if (result.status === 'active') {
        toast.success('Certificate found and is active!');
      } else if (result.status === 'revoked') {
        toast.warning('Certificate found but has been revoked');
      } else {
        toast.error('Certificate not found or invalid');
      }

    } catch (error) {
      console.error('Error verifying certificate by ID:', error);
      toast.error(error.message || 'Failed to verify certificate');
      setVerificationResult({
        isValid: false,
        error: error.message || 'Certificate not found',
        verificationTime: new Date().toISOString(),
        certificateId: certificateId
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleVerification = () => {
    if (verificationMethod === 'file') {
      verifyByFile();
    } else {
      verifyById();
    }
  };

  const resetVerification = () => {
    setFile(null);
    setCertificateId('');
    setVerificationResult(null);
  };

  const getStatusBadge = (status, isValid) => {
    if (!isValid) {
      return <span className="status-revoked">Invalid</span>;
    }
    
    switch (status) {
      case 'active':
        return <span className="status-active">Valid & Active</span>;
      case 'revoked':
        return <span className="status-revoked">Valid but Revoked</span>;
      default:
        return <span className="status-pending">Unknown</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Certificate</h1>
        <p className="text-gray-600">
          Upload a certificate file or enter a certificate ID to verify its authenticity and status on the blockchain.
        </p>
      </div>

      {!verificationResult ? (
        <div className="space-y-6">
          {/* Verification Method Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Method</h2>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="file"
                  checked={verificationMethod === 'file'}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="mr-2"
                />
                <span>Upload Certificate File</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="id"
                  checked={verificationMethod === 'id'}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  className="mr-2"
                />
                <span>Enter Certificate ID</span>
              </label>
            </div>
          </div>

          {verificationMethod === 'file' ? (
            /* File Upload Section */
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Certificate</h2>
              
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
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
          ) : (
            /* Certificate ID Section */
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate ID</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Certificate ID
                  </label>
                  <input
                    type="text"
                    id="certificateId"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="input-field"
                    placeholder="cert_1234567890_abcdef"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Certificate ID is provided when the certificate is issued
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Verify Button */}
          <div className="flex justify-center">
            <button
              onClick={handleVerification}
              disabled={verifying || (verificationMethod === 'file' && !file) || (verificationMethod === 'id' && !certificateId.trim())}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-8 py-3"
            >
              {verifying ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Verification Results */
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Verification Result</h2>
              {getStatusBadge(verificationResult.status, verificationResult.isValid)}
            </div>

            {verificationResult.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-800 font-semibold">Verification Failed</p>
                    <p className="text-red-600">{verificationResult.error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main verification status */}
                <div className={`border rounded-lg p-6 ${
                  verificationResult.isValid && verificationResult.status === 'active' 
                    ? 'bg-green-50 border-green-200' 
                    : verificationResult.isValid && verificationResult.status === 'revoked'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      verificationResult.isValid && verificationResult.status === 'active' 
                        ? 'bg-green-100 text-green-600'
                        : verificationResult.isValid && verificationResult.status === 'revoked'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {verificationResult.isValid && verificationResult.status === 'active' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        verificationResult.isValid && verificationResult.status === 'active' 
                          ? 'text-green-800'
                          : verificationResult.isValid && verificationResult.status === 'revoked'
                          ? 'text-yellow-800'
                          : 'text-red-800'
                      }`}>
                        {verificationResult.isValid && verificationResult.status === 'active' 
                          ? 'Certificate is Valid and Active'
                          : verificationResult.isValid && verificationResult.status === 'revoked'
                          ? 'Certificate is Valid but Revoked'
                          : 'Certificate is Invalid or Not Found'
                        }
                      </p>
                      <p className={`text-sm ${
                        verificationResult.isValid && verificationResult.status === 'active' 
                          ? 'text-green-600'
                          : verificationResult.isValid && verificationResult.status === 'revoked'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        Verified on {new Date(verificationResult.verificationTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verificationResult.certificateId && (
                      <div>
                        <p className="text-sm text-gray-600">Certificate ID</p>
                        <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                          {verificationResult.certificateId}
                        </p>
                      </div>
                    )}
                    {verificationResult.certificateHash && (
                      <div>
                        <p className="text-sm text-gray-600">Certificate Hash</p>
                        <p className="font-mono text-sm bg-white px-2 py-1 rounded border break-all">
                          {verificationResult.certificateHash.substring(0, 32)}...
                        </p>
                      </div>
                    )}
                    {verificationResult.fileName && (
                      <div>
                        <p className="text-sm text-gray-600">File Name</p>
                        <p className="font-semibold">{verificationResult.fileName}</p>
                      </div>
                    )}
                    {verificationResult.fileSize && (
                      <div>
                        <p className="text-sm text-gray-600">File Size</p>
                        <p className="font-semibold">{(verificationResult.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Blockchain information */}
                {verificationResult.verification?.blockchain && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {verificationResult.verification.blockchain.transactionHash && (
                        <div>
                          <p className="text-sm text-gray-600">Transaction Hash</p>
                          <p className="font-mono text-sm bg-white px-2 py-1 rounded border break-all">
                            {verificationResult.verification.blockchain.transactionHash}
                          </p>
                        </div>
                      )}
                      {verificationResult.verification.blockchain.issuer && (
                        <div>
                          <p className="text-sm text-gray-600">Issuer Address</p>
                          <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                            {verificationResult.verification.blockchain.issuer}
                          </p>
                        </div>
                      )}
                      {verificationResult.verification.blockchain.timestamp && (
                        <div>
                          <p className="text-sm text-gray-600">Issue Date</p>
                          <p className="font-semibold">
                            {new Date(verificationResult.verification.blockchain.timestamp).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetVerification}
              className="btn-primary"
            >
              Verify Another Certificate
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
            >
              Print Verification Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;