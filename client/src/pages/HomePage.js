import React, { useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import useNavigateWithLoading from '../hooks/useNavigateWithLoading';
import { 
  ShieldCheck, 
  Search, 
  Settings,
  Users, 
  Award,
  CheckCircle,
  Globe,
  ArrowRight,
  Play,
  Zap,
  Lock,
  X,
  Code,
  Database,
  Cpu,
  Cloud,
  Layers,
  Target,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

const HomePage = () => {
  const navigateWithLoading = useNavigateWithLoading();
  useLoading();
  const [showProjectModal, setShowProjectModal] = useState(false);

  const handleGetStarted = () => {
    navigateWithLoading('/auth', {
      message: 'Preparing your authentication...',
      delay: 3300
    });
  };

  const handleLearnMore = () => {
    setShowProjectModal(true);
  };

  const ProjectInfoModal = () => {
    if (!showProjectModal) return null;

    const techStack = [
      { name: 'React.js', description: 'Modern frontend framework for building interactive user interfaces', icon: Code, color: '#61dafb' },
      { name: 'Node.js', description: 'Server-side JavaScript runtime for scalable backend development', icon: Cpu, color: '#339933' },
      { name: 'Blockchain', description: 'Distributed ledger technology ensuring data immutability and security', icon: Lock, color: '#f7931a' },
      { name: 'MongoDB', description: 'NoSQL database for flexible and scalable data storage', icon: Database, color: '#47a248' },
      { name: 'AWS Cloud', description: 'Cloud infrastructure for reliable and scalable deployment', icon: Cloud, color: '#ff9900' },
      { name: 'IPFS', description: 'Distributed file system for decentralized certificate storage', icon: Layers, color: '#65c2cb' }
    ];

    const projectHighlights = [
      { title: 'Market Need', description: 'Certificate fraud costs the global economy billions annually. Our solution addresses the critical need for tamper-proof credential verification.', icon: Target },
      { title: 'Innovation', description: 'First blockchain-based certificate management system with instant verification and complete lifecycle management.', icon: Lightbulb },
      { title: 'Scalability', description: 'Built to handle millions of certificates with enterprise-grade security and performance optimization.', icon: TrendingUp }
    ];

    return (
      <div 
        onClick={() => setShowProjectModal(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          cursor: 'pointer',
          animation: 'fadeIn 0.3s ease-out'
        }}>
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            cursor: 'default',
            animation: 'slideIn 0.4s ease-out'
          }}>
          {/* Modal Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            borderRadius: '20px 20px 0 0',
            color: 'white',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowProjectModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <ShieldCheck size={48} style={{ color: 'white' }} />
              <div>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  CertifyChain
                </h2>
                <p style={{
                  fontSize: '1.2rem',
                  opacity: 0.9,
                  margin: 0,
                  fontWeight: '300'
                }}>
                  Blockchain-Powered Certificate Management Revolution
                </p>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div style={{ padding: '2rem' }}>
            {/* Project Purpose & Significance */}
            <section style={{ marginBottom: '3rem' }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>Project Overview</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {projectHighlights.map((highlight, index) => {
                  const IconComponent = highlight.icon;
                  return (
                    <div key={index} style={{
                      padding: '1.5rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(59, 130, 246, 0.15)';
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <IconComponent size={24} style={{ color: '#3b82f6' }} />
                        <h4 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: 0
                        }}>{highlight.title}</h4>
                      </div>
                      <p style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        lineHeight: '1.6',
                        margin: 0
                      }}>{highlight.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Detailed Purpose */}
            <section style={{ marginBottom: '3rem' }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1.5rem'
              }}>Purpose & Significance</h3>
              
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #0ea5e9',
                borderLeft: '4px solid #0ea5e9',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(14, 165, 233, 0.2)';
                e.currentTarget.style.borderLeftWidth = '6px';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderLeftWidth = '4px';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
              }}>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#0f172a',
                  lineHeight: '1.7',
                  margin: '0 0 1rem 0'
                }}>
                  <strong>CertifyChain</strong> revolutionizes credential verification by leveraging blockchain technology to create an immutable, 
                  transparent, and instantly verifiable certificate management ecosystem. Our platform addresses the global challenge of 
                  educational credential fraud, which affects millions of students and employers worldwide.
                </p>
                
                <p style={{
                  fontSize: '1rem',
                  color: '#334155',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  By combining cutting-edge blockchain technology with intuitive user experience design, we enable educational institutions 
                  to issue tamper-proof digital certificates while providing employers and verification agencies with instant, reliable 
                  credential validation. This eliminates the need for time-consuming manual verification processes and reduces the risk 
                  of credential fraud by 99.9%.
                </p>
              </div>
            </section>

            {/* Technology Stack */}
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1.5rem'
              }}>Technology Stack</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {techStack.map((tech, index) => {
                  const IconComponent = tech.icon;
                  return (
                    <div key={index} style={{
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '2px solid #f1f5f9',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = tech.color;
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 10px 25px ${tech.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f1f5f9';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <IconComponent size={32} style={{ color: tech.color }} />
                        <h4 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: 0
                        }}>{tech.name}</h4>
                      </div>
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#64748b',
                        lineHeight: '1.5',
                        margin: 0
                      }}>{tech.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Call to Action */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                margin: '0 0 1.5rem 0',
                fontWeight: '500'
              }}>
                Ready to experience the future of certificate management?
              </p>
              
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  handleGetStarted();
                }}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Play size={20} />
                Get Started Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Modal Animation Styles */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>
      </div>
    );
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
      <ProjectInfoModal />
      {/* Navigation Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(5deg) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
              e.currentTarget.style.backgroundColor = '#3b82f6';
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

      {/* Hero Section */}
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
            fontFamily: 'Open Sans, sans-serif',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#bfdbfe';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#dbeafe';
            e.currentTarget.style.transform = 'scale(1)';
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
            Secure Certificate Management
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
              onClick={handleLearnMore}
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
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#374151';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Lightbulb size={20} />
              Learn More
            </button>
          </div>

          {/* Value Proposition Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                icon: ShieldCheck,
                title: 'Immutable Security',
                description: 'Blockchain-powered certificates that cannot be tampered with or forged',
                gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                iconBg: '#ecfdf5',
                feature: 'Tamper-Proof Technology'
              },
              {
                icon: Zap,
                title: 'Instant Verification',
                description: 'Verify any certificate in seconds with our lightning-fast validation system',
                gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                iconBg: '#eff6ff',
                feature: 'Real-Time Processing'
              },
              {
                icon: Globe,
                title: 'Global Accessibility',
                description: 'Access and verify certificates from anywhere in the world, anytime',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                iconBg: '#f3e8ff',
                feature: 'Worldwide Reach'
              },
              {
                icon: Award,
                title: 'Institution Ready',
                description: 'Built for educational institutions with enterprise-grade reliability',
                gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                iconBg: '#fffbeb',
                feature: 'Enterprise Solution'
              }
            ].map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '0',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.querySelector('.gradient-header').style.transform = 'scaleX(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                  e.currentTarget.querySelector('.gradient-header').style.transform = 'scaleX(1)';
                }}>
                  {/* Gradient Header */}
                  <div 
                    className="gradient-header"
                    style={{
                      background: card.gradient,
                      height: '80px',
                      position: 'relative',
                      transition: 'transform 0.4s ease',
                      transformOrigin: 'center'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '2rem',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <IconComponent size={24} style={{ color: 'white' }} />
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {card.feature}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {card.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '1rem',
                      color: '#64748b',
                      lineHeight: '1.6',
                      margin: 0,
                      fontFamily: 'Open Sans, sans-serif'
                    }}>
                      {card.description}
                    </p>
                    
                    {/* Feature Badge */}
                    <div style={{
                      marginTop: '1.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: card.iconBg,
                      borderRadius: '50px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: card.gradient.includes('#10b981') ? '#065f46' : 
                             card.gradient.includes('#3b82f6') ? '#1e40af' :
                             card.gradient.includes('#8b5cf6') ? '#6b21a8' : '#92400e'
                    }}>
                      <CheckCircle size={16} />
                      Verified Technology
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '60px',
                    height: '60px',
                    background: card.gradient,
                    borderRadius: '50%',
                    opacity: 0.1,
                    transform: 'rotate(45deg)'
                  }} />
                </div>
              );
            })}
          </div>
          
          {/* Trust Indicators */}
          <div style={{
            marginTop: '4rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginBottom: '2rem',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Trusted by educational institutions worldwide
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              opacity: 0.6
            }}>
              {[
                'Universities',
                'Colleges', 
                'Training Centers',
                'Certification Bodies',
                'Government Agencies'
              ].map((org, index) => (
                <div key={index} style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#94a3b8',
                  padding: '0.5rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  {org}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* How It Works Section */}
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
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = '#e2e8f0';
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
                  border: '4px solid white',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
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
                  margin: '2rem auto 2rem auto',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.transform = 'scale(1)';
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '4rem 2rem 2rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', cursor: 'pointer' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(-5deg) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
              e.currentTarget.style.backgroundColor = '#3b82f6';
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
              © 2025 CertifyChain. Built with ❤️ for educational institutions worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;