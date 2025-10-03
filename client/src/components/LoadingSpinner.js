import React from 'react';
import { ShieldCheck } from 'lucide-react';

const LoadingSpinner = ({ show, message = "Loading..." }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", sans-serif'
    }}>
      {/* Brand Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        animation: 'fadeInUp 0.6s ease-out',
        '@media (max-width: 640px)': {
          flexDirection: 'column',
          gap: '0.5rem'
        }
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#3b82f6',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <ShieldCheck size={28} style={{ color: 'white' }} />
        </div>
        <h1 style={{
          fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
          fontWeight: '700',
          color: '#111827',
          margin: 0,
          textAlign: 'center'
        }}>
          CertifyChain
        </h1>
      </div>

      {/* Animated Spinner */}
      <div style={{
        position: 'relative',
        marginBottom: '1.5rem'
      }}>
        {/* Outer Ring */}
        <div style={{
          width: '64px',
          height: '64px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        {/* Inner Ring */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '48px',
          height: '48px',
          border: '2px solid transparent',
          borderBottom: '2px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite reverse'
        }}></div>

        {/* Center Dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          backgroundColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'pulse 1s ease-in-out infinite'
        }}></div>
      </div>

      {/* Loading Message */}
      <p style={{
        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
        color: '#6b7280',
        margin: '0 0 0.5rem 0',
        fontWeight: '500',
        animation: 'fadeIn 0.8s ease-out',
        textAlign: 'center',
        maxWidth: '300px',
        padding: '0 1rem'
      }}>
        {message}
      </p>

      {/* Progress Bar */}
      <div style={{
        width: '200px',
        height: '2px',
        backgroundColor: '#f3f4f6',
        borderRadius: '1px',
        marginTop: '1rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '30%',
          height: '100%',
          backgroundColor: '#3b82f6',
          borderRadius: '1px',
          animation: 'progressSlide 2s ease-in-out infinite'
        }}></div>
      </div>

      {/* Progress Dots */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: '1rem'
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              animation: `bounce 1.5s ease-in-out ${i * 0.2}s infinite`
            }}
          ></div>
        ))}
      </div>

      {/* Inject CSS animations into document head */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { 
              opacity: 1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.7;
              transform: scale(0.95);
            }
          }

          @keyframes bounce {
            0%, 100% { 
              transform: translateY(0);
              opacity: 0.4;
            }
            50% { 
              transform: translateY(-8px);
              opacity: 1;
            }
          }

          @keyframes fadeIn {
            0% { 
              opacity: 0;
            }
            100% { 
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            0% { 
              opacity: 0;
              transform: translateY(20px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes progressSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(300%); }
          }
        `
      }} />
    </div>
  );
};

export default LoadingSpinner;