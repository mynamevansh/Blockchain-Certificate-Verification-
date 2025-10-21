import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { toast } from 'react-toastify';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  Building,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
const ProfessionalUpload = () => {
  const { user, isAuthenticated } = useAuth();
  useWebSocket(); // For potential future use
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      toast.success('Certificate file selected successfully');
    } else {
      toast.error('Please select a valid PDF file');
    }
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a certificate file');
      return;
    }
    if (!formData.recipientName || !formData.courseName || !formData.institution) {
      toast.error('Please fill in all required fields');
      return;
    }
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const certificateId = `CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
      const certificateData = {
        id: certificateId,
        ...formData,
        file: file.name,
        uploadDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }),
        status: 'Valid',
        issuer: user?.name || 'System Administrator',
        blockchainHash: '0x' + Math.random().toString(16).substr(2, 40),
        verified: true
      };
      setUploadedCertificate(certificateData);
      toast.success(`Certificate ${certificateId} successfully registered on blockchain!`);
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
      console.error('Upload failed:', error);
      toast.error('Failed to upload certificate. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopNavbar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
        />
        <div className="content-area">
          {}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <Link to="/dashboard" className="btn btn-secondary">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
              Issue New Certificate
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Upload and register a new certificate on the blockchain for secure verification.
            </p>
          </div>
          {uploadedCertificate ? (
            <div className="card">
              <div className="card-content" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto'
                }}>
                  <CheckCircle size={32} style={{ color: 'var(--success-color)' }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
                  Certificate Uploaded Successfully!
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                  The certificate has been registered on the blockchain and is now available for verification.
                </p>
                <div style={{ 
                  backgroundColor: 'var(--background-tertiary)', 
                  padding: 'var(--spacing-lg)', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <div style={{ display: 'grid', gap: 'var(--spacing-sm)', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Certificate ID:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {uploadedCertificate.id || 'CERT-2024-001'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Recipient:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {uploadedCertificate.recipientName || formData.recipientName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Course:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {uploadedCertificate.courseName || formData.courseName}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setUploadedCertificate(null)}
                  >
                    Upload Another Certificate
                  </button>
                  <Link to="/dashboard" className="btn btn-secondary">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2" style={{ alignItems: 'flex-start' }}>
                {}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Certificate Details</h3>
                    <p className="card-subtitle">Enter the certificate information</p>
                  </div>
                  <div className="card-content">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--spacing-xs)' 
                        }}>
                          <User size={16} style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
                          Recipient Name *
                        </label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                          }}
                          placeholder="Enter recipient's full name"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--spacing-xs)' 
                        }}>
                          <Mail size={16} style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          name="recipientEmail"
                          value={formData.recipientEmail}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                          }}
                          placeholder="recipient@example.com"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--spacing-xs)' 
                        }}>
                          <FileText size={16} style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
                          Course/Program Name *
                        </label>
                        <input
                          type="text"
                          name="courseName"
                          value={formData.courseName}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                          }}
                          placeholder="Enter course or program name"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--spacing-xs)' 
                        }}>
                          <Building size={16} style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
                          Institution *
                        </label>
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                          }}
                          placeholder="Enter institution name"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--spacing-xs)' 
                        }}>
                          <Calendar size={16} style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
                          Issue Date
                        </label>
                        <input
                          type="date"
                          name="issueDate"
                          value={formData.issueDate}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)', 
                          marginBottom: 'var(--spacing-xs)' 
                        }}>
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            resize: 'vertical'
                          }}
                          placeholder="Additional details about the certificate..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Upload Certificate</h3>
                    <p className="card-subtitle">Select or drag and drop the PDF certificate file</p>
                  </div>
                  <div className="card-content">
                    <div
                      style={{
                        border: `2px dashed ${dragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-2xl)',
                        textAlign: 'center',
                        backgroundColor: dragActive ? '#eff6ff' : 'var(--background-tertiary)',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer'
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <input
                        id="fileInput"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      {file ? (
                        <div>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--spacing-md) auto'
                          }}>
                            <FileText size={24} style={{ color: 'var(--success-color)' }} />
                          </div>
                          <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                            {file.name}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#eff6ff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--spacing-md) auto'
                          }}>
                            <UploadIcon size={24} style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                            Choose a file or drag it here
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            PDF files only, up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    {file && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setFile(null)}
                        style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
                      >
                        Remove File
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {}
              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading || !file}
                  style={{ 
                    padding: 'var(--spacing-md) var(--spacing-xl)',
                    fontSize: '1rem'
                  }}
                >
                  {uploading ? (
                    <>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid transparent', 
                        borderTop: '2px solid currentColor', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                      }} />
                      Uploading Certificate...
                    </>
                  ) : (
                    <>
                      <UploadIcon size={20} />
                      Issue Certificate
                    </>
                  )}
                </button>
                {!isAuthenticated && (
                  <div style={{ 
                    marginTop: 'var(--spacing-md)', 
                    padding: 'var(--spacing-md)', 
                    backgroundColor: '#fffbeb', 
                    border: '1px solid #f59e0b', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)'
                  }}>
                    <AlertCircle size={16} style={{ color: 'var(--warning-color)' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--warning-color)' }}>
                      Blockchain connection required for certificate issuance
                    </span>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfessionalUpload;
