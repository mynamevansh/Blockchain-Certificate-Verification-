import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Settings,
  Users, 
  Award,
  CheckCircle,
  Clock,
  Globe,
  ArrowRight,
  Play,
  Zap,
  Lock
} from 'lucide-react';
const HomePage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/auth');
  };
  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure & Trusted',
      description: 'Blockchain-powered verification ensures certificate authenticity with immutable records and cryptographic security.',
      color: '#10b981'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Verify any certificate in seconds with our advanced system providing real-time validation and results.',
      color: '#3b82f6'
    },
    {
      icon: Settings,
      title: 'Full Management',
      description: 'Complete certificate lifecycle management from issuance to tracking with comprehensive administrative control.',
      color: '#8b5cf6'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for seamless user experience with clean navigation and accessible design.',
      color: '#f59e0b'
    }
  ];
  const workflowSteps = [
    {
      step: '01',
      title: 'Certificate Creation',
      description: 'Educational institutions create and issue digital certificates with secure blockchain integration.',
      icon: Award
    },
    {
      step: '02',
      title: 'Secure Storage',
      description: 'Certificate data is encrypted and stored on blockchain ensuring permanent authenticity and tamper-proof records.',
      icon: Lock
    },
    {
      step: '03',
      title: 'Instant Access',
      description: 'Students and verifiers can instantly access and validate certificates using unique identification codes.',
      icon: Search
    },
    {
      step: '04',
      title: 'Lifecycle Control',
      description: 'Administrators maintain full control over certificate status, updates, and management throughout the entire lifecycle.',
      icon: Globe
    }
  ];
  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} style={{ color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              fontFamily: 'Roboto, sans-serif'
            }}>
              CertifyChain
            </h1>
          </div>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>
      </header>
      {}
      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '2rem',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            <CheckCircle size={16} />
            Trusted by Educational Institutions Worldwide
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            color: '#0f172a',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            fontFamily: 'Roboto, sans-serif'
          }}>
            Sसंरक्षपत्र
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '700px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.7',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            Verify certificate authenticity and manage certificate lifecycle with 
            blockchain technology.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              <Play size={20} />
              Start Verification
            </button>
            <button
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#374151';
              }}
            >
              Learn More
            </button>
          </div>
          {}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              { number: '10,000+', label: 'Certificates Verified' },
              { number: '50+', label: 'Institutions Trust Us' },
              { number: '99.9%', label: 'System Uptime' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '0.5rem',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontFamily: 'Open Sans, sans-serif'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section style={{
        padding: '6rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1.5rem',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Why Choose CertifyChain?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Our platform delivers comprehensive certificate management with industry-leading 
              security, reliability, and user experience.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2.5rem 2rem',
                borderRadius: '20px',
                border: '1px solid #f1f5f9',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = feature.color + '40';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.02)';
                e.currentTarget.style.borderColor = '#f1f5f9';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: feature.color + '15',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem auto'
                }}>
                  <feature.icon size={40} style={{ color: feature.color }} />
                </div>
                <h3 style={{
                  fontSize: '1.375rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '1rem',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  lineHeight: '1.7',
                  margin: 0,
                  fontFamily: 'Open Sans, sans-serif'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section style={{
        padding: '6rem 2rem',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1.5rem',
              fontFamily: 'Roboto, sans-serif'
            }}>
              How It Works
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Simple, secure, and efficient certificate verification process powered by 
              advanced blockchain technology.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {workflowSteps.map((step, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2.5rem 2rem',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                position: 'relative',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: 'white',
                  fontFamily: 'Roboto, sans-serif',
                  border: '4px solid white'
                }}>
                  {step.step}
                </div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '2rem auto 2rem auto'
                }}>
                  <step.icon size={32} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '1rem',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'Open Sans, sans-serif'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '1.5rem',
            fontFamily: 'Roboto, sans-serif'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '3rem',
            opacity: '0.9',
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '1.6'
          }}>
            Join educational institutions worldwide using CertifyChain for secure, 
            reliable certificate verification and management.
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '1.25rem 3rem',
              backgroundColor: 'white',
              color: '#3b82f6',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
            }}
          >
            Get Started Now
            <ArrowRight size={24} />
          </button>
        </div>
      </section>
      {}
      <footer style={{
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '4rem 2rem 2rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} style={{ color: 'white' }} />
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: 0,
              fontFamily: 'Roboto, sans-serif'
            }}>
              CertifyChain
            </h3>
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem auto',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            Secure, trusted, and efficient certificate verification powered by blockchain technology. 
            Building the future of educational credential management.
          </p>
          <div style={{
            borderTop: '1px solid #334155',
            paddingTop: '2rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Open Sans, sans-serif'
            }}>
              © 2024 CertifyChain. Built with ❤️ for educational institutions worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
