import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  FileCheck, 
  Upload, 
  BarChart3, 
  Users, 
  Lock,
  ArrowRight
} from 'lucide-react';
const ProfessionalHome = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Blockchain-based certificate verification ensures authenticity and prevents fraud.',
    },
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Simple and intuitive certificate upload process with instant blockchain registration.',
    },
    {
      icon: FileCheck,
      title: 'Instant Verification',
      description: 'Verify any certificate in seconds with our advanced verification system.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting tools for certificate management.',
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Role-based access control for institutions, administrators, and users.',
    },
    {
      icon: Lock,
      title: 'Immutable Records',
      description: 'Once issued, certificates cannot be tampered with or falsified.',
    },
  ];
  const stats = [
    { value: '10,000+', label: 'Certificates Issued' },
    { value: '500+', label: 'Institutions' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background-secondary)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {}
      <header style={{
        backgroundColor: 'var(--background-primary)',
        borderBottom: '1px solid var(--border-color)',
        padding: 'var(--spacing-md) 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Shield size={32} style={{ color: 'var(--primary-color)' }} />
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--text-primary)',
              margin: 0
            }}>
              CertifyChain
            </h1>
          </div>
          <nav style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline">
                  Dashboard
                </Link>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Welcome, {user.name}
                </span>
              </>
            ) : (
              <>
                <Link to="/verify" style={{ 
                  color: 'var(--text-secondary)', 
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Verify Certificate
                </Link>
                <Link to="/dashboard" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        backgroundColor: 'var(--background-primary)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-lg)',
            lineHeight: '1.1'
          }}>
            Secure Certificate Management
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-2xl) auto',
            lineHeight: '1.6'
          }}>
            Issue, verify, and manage certificates with blockchain technology. 
            Ensure authenticity and prevent fraud with our secure platform.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/upload" className="btn btn-primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
              <Upload size={20} />
              Issue Certificate
            </Link>
            <Link to="/verify" className="btn btn-outline" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
              <FileCheck size={20} />
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>
      {}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        backgroundColor: 'var(--background-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-xl)',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--primary-color)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section style={{ padding: 'var(--spacing-2xl) 0' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h3 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Why Choose CertifyChain?
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Our platform provides enterprise-grade security and user-friendly tools 
              for complete certificate lifecycle management.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="card-content">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#eff6ff',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--spacing-lg)'
                  }}>
                    <feature.icon size={24} style={{ color: 'var(--primary-color)' }} />
                  </div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section style={{
        padding: 'var(--spacing-2xl) 0',
        backgroundColor: 'var(--background-primary)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Ready to Get Started?
          </h3>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            Join thousands of institutions already using CertifyChain for secure certificate management.
          </p>
          <Link to="/dashboard" className="btn btn-primary" style={{ 
            padding: 'var(--spacing-md) var(--spacing-xl)',
            fontSize: '1rem'
          }}>
            Access Dashboard
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      {}
      <footer style={{
        backgroundColor: 'var(--background-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--spacing-xl) 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <Shield size={24} style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              CertifyChain
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            © 2024 CertifyChain. Secure certificate management powered by blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default ProfessionalHome;
