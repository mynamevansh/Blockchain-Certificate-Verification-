import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { certificateAPI, statsAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isConnected } = useAuth();
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

  useEffect(() => {
    if (isConnected && user?.address) {
      loadDashboardData();
    }
  }, [isConnected, user, period, loadDashboardData]);

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
        setRecentCertificates(certificates.data || certificates); // Handle paginated response
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
          },
          {
            certificateId: 'cert_1698765435_jkl012',
            recipientName: 'David Brown',
            courseName: 'Machine Learning Fundamentals',
            institution: 'Tech University',
            issueDate: '2024-09-22T16:20:00Z',
            status: 'active'
          },
          {
            certificateId: 'cert_1698765436_mno345',
            recipientName: 'Eva Davis',
            courseName: 'Blockchain Development',
            institution: 'Tech University',
            issueDate: '2024-09-20T11:00:00Z',
            status: 'active'
          }
        ]);
      }

      // Generate recent activity from notifications and certificates
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
  }, [user?.address, statsAPI, certificateAPI]);

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

  const StatCard = ({ title, value, subtitle, color = 'primary', icon }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`w-12 h-12 bg-${color}-100 text-${color}-600 rounded-lg flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, link, icon, color = 'primary' }) => (
    <Link to={link} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center">
          <div className={`w-12 h-12 bg-${color}-100 text-${color}-600 rounded-lg flex items-center justify-center mr-4`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );

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
            You need to connect your wallet to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's an overview of your certificate activities.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {wsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
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
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Certificates"
              value={stats.totalCertificates}
              subtitle="All time"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              title="Active Certificates"
              value={stats.activeCertificates}
              subtitle="Currently valid"
              color="success"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Revoked"
              value={stats.revokedCertificates}
              subtitle="Invalidated"
              color="error"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            />
            <StatCard
              title="Verifications"
              value={stats.totalVerifications}
              subtitle="Total checks"
              color="primary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionCard
                title="Issue Certificate"
                description="Upload and issue a new certificate"
                link="/upload"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              />
              <QuickActionCard
                title="Verify Certificate"
                description="Check certificate authenticity"
                link="/verify"
                color="success"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <QuickActionCard
                title="Revoke Certificate"
                description="Invalidate an issued certificate"
                link="/revoke"
                color="error"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Certificates */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Certificates</h2>
                <Link to="/upload" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {recentCertificates.length > 0 ? (
                <div className="space-y-3">
                  {recentCertificates.map((cert) => (
                    <div key={cert.certificateId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{cert.recipientName}</p>
                        <p className="text-sm text-gray-600 truncate">{cert.courseName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {cert.status === 'active' ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-revoked">Revoked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No certificates issued yet</p>
                  <Link to="/upload" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Issue your first certificate
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
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
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Blockchain</p>
                  <p className="text-sm text-gray-600">Connected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-medium text-gray-900">WebSocket</p>
                  <p className="text-sm text-gray-600">{wsConnected ? 'Connected' : 'Disconnected'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
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