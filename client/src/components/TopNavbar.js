import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
const TopNavbar = ({ onMenuToggle, user }) => {
  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <button 
          className="btn btn-secondary"
          onClick={onMenuToggle}
          style={{ padding: '0.5rem', minWidth: 'auto' }}
        >
          <Menu size={18} />
        </button>
        <h1 className="navbar-title">Certificate Management Dashboard</h1>
      </div>
      <div className="navbar-right">
        <div className="search-container" style={{ position: 'relative', marginRight: '1rem' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input 
            type="text" 
            placeholder="Search certificates..." 
            style={{
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              minWidth: '200px',
              backgroundColor: 'var(--background-secondary)'
            }}
          />
        </div>
        <button className="btn btn-secondary" style={{ padding: '0.5rem', minWidth: 'auto' }}>
          <Bell size={18} />
        </button>
        <div className="navbar-user">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
              {user?.name || 'Admin User'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {user?.role || 'Administrator'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopNavbar;
