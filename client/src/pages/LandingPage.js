import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Users,
    Award,
    CheckCircle,
    ArrowRight,
    Play,
    Zap,
    Rocket,
    TrendingUp,
    Code,
    Server,
    Database,
    Cloud,
    FileText,
    Settings
} from 'lucide-react';
import Loader from '../components/Loader';
const LandingPage = () => {
    const navigate = useNavigate();
    // const [showModal, setShowModal] = useState(false); // unused
    const [isLoading, setIsLoading] = useState(false);
    const handleGetStarted = () => {
        setIsLoading(true);
        setTimeout(() => {
            navigate('/auth');
        }, 800);
    };
    const handleLearnMore = () => {
        const projectSection = document.getElementById('project-overview');
        if (projectSection) {
            projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    /* const features = [
        {
            icon: Lock,
            title: 'Immutable Security',
            tag: 'TAMPER-PROOF TECHNOLOGY',
            tagColor: '#10b981',
            description: 'Blockchain-powered certificates that cannot be tampered with or forged.',
            pill: 'Verified Technology'
        },
        {
            icon: Zap,
            title: 'Instant Verification',
            tag: 'REAL-TIME PROCESSING',
            tagColor: '#3b82f6',
            description: 'Verify any certificate in seconds with our lightning-fast validation system.',
            pill: 'Verified Technology'
        },
        {
            icon: Globe,
            title: 'Global Accessibility',
            tag: 'WORLDWIDE REACH',
            tagColor: '#8b5cf6',
            description: 'Access and verify certificates from anywhere in the world, anytime.',
            pill: 'Verified Technology'
        },
        {
            icon: Building2,
            title: 'Institution Ready',
            tag: 'ENTERPRISE SOLUTION',
            tagColor: '#f59e0b',
            description: 'Built for educational institutions with enterprise-grade reliability.',
            pill: 'Verified Technology'
        }
    ]; // unused */
    const whyChooseFeatures = [
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
    /* const workflowSteps = [
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
    ]; // unused */
    const projectCards = [
        {
            icon: TrendingUp,
            title: 'Market Need',
            description: 'Certificate fraud costs the global economy billions annually. Our solution addresses the critical need for tamper-proof credential verification.'
        },
        {
            icon: Rocket,
            title: 'Innovation',
            description: 'First blockchain-based certificate management system with instant verification and complete lifecycle management.'
        },
        {
            icon: Award,
            title: 'Scalability',
            description: 'Built to handle millions of certificates with enterprise-grade security and performance optimization.'
        }
    ];
    const techStack = [
        {
            icon: Code,
            name: 'React.js',
            description: 'Modern frontend framework for building interactive user interfaces.'
        },
        {
            icon: Server,
            name: 'Node.js',
            description: 'Server-side JavaScript runtime for scalable backend development.'
        },
        {
            icon: ShieldCheck,
            name: 'Blockchain',
            description: 'Distributed ledger technology ensuring data immutability and security.'
        },
        {
            icon: Database,
            name: 'MongoDB',
            description: 'NoSQL database for flexible and scalable data storage.'
        },
        {
            icon: Cloud,
            name: 'AWS Cloud',
            description: 'Cloud infrastructure for reliable and scalable deployment.'
        },
        {
            icon: FileText,
            name: 'IPFS',
            description: 'Distributed file system for decentralized certificate storage.'
        }
    ];
    return (
        <div style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", sans-serif',
            backgroundColor: '#ffffff',
            minHeight: '100vh'
        }}>
            { }
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Loader size={60} color="#3b82f6" />
                </div>
            )}
            { }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/verify/CERT-2024-001')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'white',
                                color: '#3b82f6',
                                border: '1px solid #3b82f6',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontFamily: 'Roboto, sans-serif',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#eff6ff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                            }}
                        >
                            Start Verification
                        </button>
                        <button
                            onClick={handleGetStarted}
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontFamily: 'Roboto, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease',
                                opacity: isLoading ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = '#2563eb';
                                    e.target.style.transform = 'translateY(-1px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = '#3b82f6';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            Get Started
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </header>
            { }
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
                        Tampered Proof Certificate Verification
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
                            disabled={isLoading}
                            style={{
                                padding: '1rem 2.5rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontFamily: 'Roboto, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: isLoading ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                                }
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
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.color = '#374151';
                            }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
            { }
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {whyChooseFeatures.map((feature, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                padding: '2.5rem 2rem',
                                borderRadius: '20px',
                                border: '1px solid #f1f5f9',
                                textAlign: 'center',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = feature.color + '40';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
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
            { }
            <section id="project-overview" style={{
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
                            Project Overview
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {projectCards.map((card, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                padding: '2.5rem 2rem',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                                }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <card.icon size={32} style={{ color: '#3b82f6' }} />
                                </div>
                                <h3 style={{
                                    fontSize: '1.375rem',
                                    fontWeight: '600',
                                    color: '#0f172a',
                                    marginBottom: '1rem',
                                    fontFamily: 'Roboto, sans-serif'
                                }}>
                                    {card.title}
                                </h3>
                                <p style={{
                                    fontSize: '1rem',
                                    color: '#64748b',
                                    lineHeight: '1.7',
                                    margin: 0,
                                    fontFamily: 'Open Sans, sans-serif'
                                }}>
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            { }
            <section style={{
                padding: '6rem 2rem',
                backgroundColor: 'white'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        backgroundColor: '#eff6ff',
                        padding: '3rem 2.5rem',
                        borderRadius: '20px',
                        border: '2px solid #bfdbfe'
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                            fontWeight: '700',
                            color: '#1e40af',
                            marginBottom: '2rem',
                            fontFamily: 'Roboto, sans-serif',
                            textAlign: 'center'
                        }}>
                            Purpose & Significance
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#1e293b',
                            lineHeight: '1.8',
                            marginBottom: '1.5rem',
                            fontFamily: 'Open Sans, sans-serif'
                        }}>
                            CertifyChain revolutionizes credential verification by leveraging blockchain technology to create an immutable, transparent, and instantly verifiable certificate management ecosystem. Our platform addresses the global challenge of educational credential fraud, which affects millions of students and employers worldwide.
                        </p>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#1e293b',
                            lineHeight: '1.8',
                            margin: 0,
                            fontFamily: 'Open Sans, sans-serif'
                        }}>
                            By combining cutting-edge blockchain technology with intuitive user experience design, we enable educational institutions to issue tamper-proof digital certificates while providing employers and verification agencies with instant, reliable credential validation. This eliminates the need for time-consuming manual verification processes and reduces the risk of credential fraud by 99.9%.
                        </p>
                    </div>
                </div>
            </section>
            { }
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
                            Technology Stack
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#64748b',
                            maxWidth: '600px',
                            margin: '0 auto',
                            fontFamily: 'Open Sans, sans-serif'
                        }}>
                            Built with modern, industry-leading technologies for maximum reliability and performance.
                        </p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {techStack.map((tech, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor: '#f1f5f9',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <tech.icon size={24} style={{ color: '#3b82f6' }} />
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: '#0f172a',
                                        margin: 0,
                                        fontFamily: 'Roboto, sans-serif'
                                    }}>
                                        {tech.name}
                                    </h3>
                                </div>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: '#64748b',
                                    lineHeight: '1.6',
                                    margin: 0,
                                    fontFamily: 'Open Sans, sans-serif'
                                }}>
                                    {tech.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            { }
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
                        disabled={isLoading}
                        style={{
                            padding: '1.25rem 3rem',
                            backgroundColor: 'white',
                            color: '#3b82f6',
                            border: 'none',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontFamily: 'Roboto, sans-serif',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            opacity: isLoading ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                            }
                        }}
                    >
                        Get Started Now
                        <ArrowRight size={24} />
                    </button>
                </div>
            </section>
            { }
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
                            © 2025 CertifyChain. Built with ❤️ for educational institutions worldwide.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default LandingPage;
