import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
  const { user, isConnected, connectWallet, disconnectWallet, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/verify', label: 'Verify', icon: '🔍' },
    { path: '/revoke', label: 'Revoke', icon: '🚫' },
  ];
  const handleWalletAction = async () => {
    if (isConnected) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <nav className="modern-nav">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          🔗 CertVerify
        </Link>
        <ul className="nav-links hidden md:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {isConnected && user?.address && (
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {truncateAddress(user.address)}
              </span>
            </div>
          )}
          <button
            onClick={handleWalletAction}
            disabled={isLoading}
            className={`btn-modern ${isConnected ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <span>🔌</span>
                Disconnect
              </>
            ) : (
              <>
                <span>👛</span>
                Connect Wallet
              </>
            )}
          </button>
          <button
            className="md:hidden btn-modern btn-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <ul className="flex flex-col gap-2 pt-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {isConnected && user?.address && (
            <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {truncateAddress(user.address)}
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
