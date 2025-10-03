import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { certificateAPI, statsAPI } from '../services/api';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Users,
  Database
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import LoadingDashboard from '../components/LoadingDashboard';

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  useWebSocket(); // For potential future use
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeCertificates: 0,
    revokedCertificates: 0,
    pendingVerifications: 0,
    monthlyGrowth: 0,
    totalUsers: 0
  });
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsResponse, certificatesResponse] = await Promise.all([
        statsAPI.getDashboardStats(),
        certificateAPI.getUserCertificates()
      ]);

      setStats(statsResponse.data || {
        totalCertificates: 0,
        activeCertificates: 0,
        revokedCertificates: 0,
        pendingVerifications: 0,
        monthlyGrowth: 0,
        totalUsers: 0
      });

      setRecentCertificates(certificatesResponse.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Valid': { 
        class: 'valid', 
        text: 'Valid',
        icon: '✔️'
      },
      'Pending': { 
        class: 'pending', 
        text: 'Pending',
        icon: '⏳'
      },
      'Revoked': { 
        class: 'revoked', 
        text: 'Revoked',
        icon: '❌'
      },
      'active': { 
        class: 'valid', 
        text: 'Valid',
        icon: '✔️'
      }
    };
    
    const statusInfo = statusMap[status] || { class: 'pending', text: 'Unknown', icon: '❓' };
    return (
      <span className={`status-badge ${statusInfo.class}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>{statusInfo.icon}</span>
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  if (loading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <TopNavbar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
        />
        
        <div className="content-area">
          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary">
                <FileText size={20} />
              </div>
              <div className="stat-value">{stats.totalCertificates}</div>
              <div className="stat-label">Total Certificates</div>
              <div className="stat-change positive">
                +{stats.monthlyGrowth}% this month
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <CheckCircle size={20} />
              </div>
              <div className="stat-value">{stats.activeCertificates}</div>
              <div className="stat-label">Active Certificates</div>
              <div className="stat-change positive">
                {((stats.activeCertificates / stats.totalCertificates) * 100).toFixed(1)}% of total
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <Clock size={20} />
              </div>
              <div className="stat-value">{stats.pendingVerifications}</div>
              <div className="stat-label">Pending Verifications</div>
              <div className="stat-change">
                Requires attention
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon info">
                <Users size={20} />
              </div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
              <div className="stat-change positive">
                +5 new this week
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2">
            {/* Recent Certificates Table */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Certificates</h3>
                <p className="card-subtitle">Latest certificate issuances and updates</p>
              </div>
              <div className="table-container" style={{ border: 'none' }}>
                {recentCertificates.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Certificate</th>
                        <th>Recipient</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCertificates.map((cert) => (
                        <tr key={cert.id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                {cert.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {cert.issuer}
                              </div>
                            </div>
                          </td>
                          <td>{cert.recipientName}</td>
                          <td>{formatDate(cert.issueDate)}</td>
                          <td>{getStatusBadge(cert.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ 
                    padding: 'var(--spacing-xl)',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    <FileText size={48} style={{ 
                      color: 'var(--text-muted)', 
                      marginBottom: 'var(--spacing-md)' 
                    }} />
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      No certificates issued yet
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Recent certificate activity will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">System Status</h3>
                <p className="card-subtitle">Current system health and metrics</p>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <Database size={16} style={{ color: 'var(--success-color)' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Database</span>
                    </div>
                    <span className="status-badge active">Operational</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <TrendingUp size={16} style={{ color: 'var(--success-color)' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>API Services</span>
                    </div>
                    <span className="status-badge active">Healthy</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <Calendar size={16} style={{ color: 'var(--warning-color)' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Backup Status</span>
                    </div>
                    <span className="status-badge pending">Scheduled</span>
                  </div>
                  
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      Server Uptime
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      99.9% (30 days)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
              <p className="card-subtitle">Frequently used certificate management functions</p>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                <button className="btn btn-primary">
                  <FileText size={16} />
                  Issue New Certificate
                </button>
                <button className="btn btn-outline">
                  <CheckCircle size={16} />
                  Verify Certificate
                </button>
                <button className="btn btn-secondary">
                  <XCircle size={16} />
                  Revoke Certificate
                </button>
                <button className="btn btn-secondary">
                  <TrendingUp size={16} />
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;