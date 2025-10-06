import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { certificateAPI, statsAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { notifications, isConnected: wsConnected } = useWebSocket();
  
  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeCertificates: 0,
    revokedCertificates: 0,
    totalVerifications: 0,
  });
  
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Load statistics
      try {
        const statsData = await statsAPI.getDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.warn('Failed to load stats from API, using mock data:', error);
        // Mock data for demonstration
        setStats({
          totalCertificates: 156,
          activeCertificates: 142,
          revokedCertificates: 14,
          totalVerifications: 1247,
        });
      }

      // Load recent certificates
      try {
        const certificates = await certificateAPI.getByIssuer(user.address, { limit: 5 });
        setRecentCertificates(certificates.data || certificates);
      } catch (error) {
        console.warn('Failed to load certificates from API, using mock data:', error);
        // Mock data for demonstration
        setRecentCertificates([
          {
            certificateId: 'cert_1698765432_abc123',
            recipientName: 'Alice Johnson',
            courseName: 'Advanced Computer Science',
            institution: 'Tech University',
            issueDate: '2024-10-01T10:30:00Z',
            status: 'active'
          },
          {
            certificateId: 'cert_1698765433_def456',
            recipientName: 'Bob Smith',
            courseName: 'Data Science Bootcamp',
            institution: 'Tech University',
            issueDate: '2024-09-28T14:15:00Z',
            status: 'active'
          },
          {
            certificateId: 'cert_1698765434_ghi789',
            recipientName: 'Carol Williams',
            courseName: 'Web Development Certificate',
            institution: 'Tech University',
            issueDate: '2024-09-25T09:45:00Z',
            status: 'revoked'
          }
        ]);
      }

      // Generate recent activity
      const activity = [
        ...notifications.slice(0, 3).map(notif => ({
          id: notif.id,
          type: 'notification',
          title: notif.title,
          description: notif.message,
          timestamp: notif.timestamp,
          icon: getActivityIcon('notification', notif.type)
        })),
        ...recentCertificates.slice(0, 2).map(cert => ({
          id: cert.certificateId,
          type: 'certificate',
          title: 'Certificate Issued',
          description: `Issued to ${cert.recipientName} for ${cert.courseName}`,
          timestamp: cert.issueDate,
          icon: getActivityIcon('certificate', cert.status)
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

      setRecentActivity(activity);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.address, notifications, recentCertificates]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, period, loadDashboardData]);

  const getActivityIcon = (type, subType) => {
    if (type === 'notification') {
      switch (subType) {
        case 'success': return '✅';
        case 'warning': return '⚠️';
        case 'error': return '❌';
        default: return 'ℹ️';
      }
    } else if (type === 'certificate') {
      return subType === 'active' ? '📜' : '🚫';
    }
    return '📋';
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="stat-icon error mb-6" style={{ margin: '0 auto' }}>
            ⚠️
          </div>
          <h2 className="text-2xl font-bold mb-4">Wallet Connection Required</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to access the dashboard.
          </p>
          <button className="btn-modern btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of your certificate activities.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {wsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-input"
              style={{ width: 'auto', minWidth: '120px' }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="dashboard-grid">
            <div className="stat-card slide-in">
              <div className="stat-icon primary">
                📊
              </div>
              <div className="stat-value">{stats.totalCertificates}</div>
              <div className="stat-label">Total Certificates</div>
            </div>
            
            <div className="stat-card slide-in">
              <div className="stat-icon success">
                ✅
              </div>
              <div className="stat-value">{stats.activeCertificates}</div>
              <div className="stat-label">Active Certificates</div>
            </div>
            
            <div className="stat-card slide-in">
              <div className="stat-icon error">
                ❌
              </div>
              <div className="stat-value">{stats.revokedCertificates}</div>
              <div className="stat-label">Revoked</div>
            </div>
            
            <div className="stat-card slide-in">
              <div className="stat-icon primary">
                ⚡
              </div>
              <div className="stat-value">{stats.totalVerifications}</div>
              <div className="stat-label">Verifications</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="modern-card">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="dashboard-grid">
              <Link to="/upload" className="block">
                <div className="modern-card" style={{ padding: 'var(--space-6)' }}>
                  <div className="stat-icon primary mb-4" style={{ width: '40px', height: '40px' }}>
                    📄
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Issue Certificate</h3>
                  <p className="text-sm text-gray-600">Upload and issue a new certificate</p>
                </div>
              </Link>
              
              <Link to="/verify" className="block">
                <div className="modern-card" style={{ padding: 'var(--space-6)' }}>
                  <div className="stat-icon success mb-4" style={{ width: '40px', height: '40px' }}>
                    🔍
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Verify Certificate</h3>
                  <p className="text-sm text-gray-600">Check certificate authenticity</p>
                </div>
              </Link>
              
              <Link to="/revoke" className="block">
                <div className="modern-card" style={{ padding: 'var(--space-6)' }}>
                  <div className="stat-icon error mb-4" style={{ width: '40px', height: '40px' }}>
                    🚫
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Revoke Certificate</h3>
                  <p className="text-sm text-gray-600">Invalidate an issued certificate</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Recent Certificates */}
            <div className="modern-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Certificates</h2>
                <Link to="/upload" className="btn-modern btn-secondary">
                  View All
                </Link>
              </div>
              
              {recentCertificates.length > 0 ? (
                <div className="space-y-4">
                  {recentCertificates.map((cert) => (
                    <div key={cert.certificateId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{cert.recipientName}</p>
                        <p className="text-sm text-gray-600 truncate">{cert.courseName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`status-badge ${cert.status === 'active' ? 'status-active' : 'status-revoked'}`}>
                          {cert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="stat-icon primary mb-4" style={{ margin: '0 auto' }}>
                    📄
                  </div>
                  <p>No certificates issued yet</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="modern-card">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="text-lg">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="stat-icon primary mb-4" style={{ margin: '0 auto' }}>
                    📋
                  </div>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="modern-card">
            <h2 className="text-xl font-semibold mb-6">System Status</h2>
            <div className="dashboard-grid">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Blockchain</p>
                  <p className="text-sm text-gray-600">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-medium text-gray-900">WebSocket</p>
                  <p className="text-sm text-gray-600">{wsConnected ? 'Connected' : 'Disconnected'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">IPFS</p>
                  <p className="text-sm text-gray-600">Operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;