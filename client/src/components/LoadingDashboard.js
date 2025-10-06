import React, { useEffect } from 'react';

const LoadingDashboard = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes loading-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loading-spinner {
        animation: loading-spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Open Sans", sans-serif',
      padding: '1rem'
    }}>
      
      <div 
        className="loading-spinner"
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          marginBottom: '1.5rem'
        }} 
      />
      
      
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '500',
        color: '#475569',
        margin: 0,
        letterSpacing: '0.025em',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Loading Dashboard...
      </h2>
      
      
      <p style={{
        fontSize: '0.875rem',
        color: '#94a3b8',
        margin: '0.5rem 0 0 0',
        textAlign: 'center',
        fontWeight: '400',
        lineHeight: '1.5',
        maxWidth: '300px'
      }}>
        Please wait while we prepare your workspace
      </p>

      
      <div style={{
        display: 'flex',
        gap: '0.375rem',
        marginTop: '2rem'
      }}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#cbd5e1',
              animation: `loading-pulse 1.4s ease-in-out ${index * 0.2}s infinite`
            }}
          />
        ))}
      </div>

      
      <style>{`
        @keyframes loading-pulse {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingDashboard;