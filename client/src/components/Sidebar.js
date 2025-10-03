import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileCheck, 
  UserX, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { path: '/upload', icon: Upload, label: 'Upload Certificate' },
    { path: '/verify', icon: FileCheck, label: 'Verify Certificate' },
    { path: '/revoke', icon: UserX, label: 'Revoke Certificate' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <Shield className="sidebar-nav-icon" />
        <h2>CertifyChain</h2>
      </div>

      <nav>
        <ul className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/dashboard' && location.pathname === '/');
            
            return (
              <li key={item.path} className="sidebar-nav-item">
                <Link 
                  to={item.path} 
                  className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon className="sidebar-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
        <button className="sidebar-nav-link" style={{ width: '100%', border: 'none', background: 'none' }}>
          <LogOut className="sidebar-nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;