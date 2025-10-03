import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isConnected, connectWallet } = useAuth();

  const features = [
    {
      icon: '🔐',
      title: 'Secure & Tamper-Proof',
      description: 'Certificates are stored on blockchain, making them impossible to forge or modify.',
    },
    {
      icon: '⚡',
      title: 'Instant Verification',
      description: 'Verify any certificate in seconds with our advanced blockchain technology.',
    },
    {
      icon: '🌍',
      title: 'Globally Accessible',
      description: 'Access and verify certificates from anywhere in the world, 24/7.',
    },
    {
      icon: '📱',
      title: 'User-Friendly',
      description: 'Simple, intuitive interface designed for both institutions and individuals.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Certificates Issued' },
    { value: '500+', label: 'Institutions' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50K+', label: 'Verifications' },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔗 CertVerify
          </h1>
          <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
            The future of certificate verification is here. Secure, instant, and globally accessible blockchain-based certificate management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isConnected ? (
              <>
                <Link to="/dashboard" className="btn-modern btn-primary text-lg px-8 py-4">
                  🚀 Go to Dashboard
                </Link>
                <Link to="/upload" className="btn-modern btn-secondary text-lg px-8 py-4">
                  📤 Issue Certificate
                </Link>
              </>
            ) : (
              <>
                <button onClick={connectWallet} className="btn-modern btn-primary text-lg px-8 py-4">
                  🚀 Get Started
                </button>
                <Link to="/verify" className="btn-modern btn-secondary text-lg px-8 py-4">
                  🔍 Verify Certificate
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="p-8">
        <div className="dashboard-grid max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card text-center slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-value text-4xl">{stat.value}</div>
              <div className="stat-label text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose CertVerify?</h2>
          
          <div className="dashboard-grid">
            {features.map((feature, index) => (
              <div key={index} className="modern-card text-center slide-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="stat-icon primary mb-6" style={{ margin: '0 auto 1.5rem', fontSize: '3rem' }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="dashboard-grid">
            <div className="modern-card text-center">
              <div className="stat-icon primary mb-6" style={{ margin: '0 auto 1.5rem' }}>
                1️⃣
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Certificate</h3>
              <p className="text-gray-600">
                Institutions upload certificates to our secure blockchain network with cryptographic signatures.
              </p>
            </div>
            
            <div className="modern-card text-center">
              <div className="stat-icon success mb-6" style={{ margin: '0 auto 1.5rem' }}>
                2️⃣
              </div>
              <h3 className="text-xl font-semibold mb-4">Blockchain Storage</h3>
              <p className="text-gray-600">
                Certificates are permanently stored on the blockchain, ensuring immutability and transparency.
              </p>
            </div>
            
            <div className="modern-card text-center">
              <div className="stat-icon error mb-6" style={{ margin: '0 auto 1.5rem' }}>
                3️⃣
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Verification</h3>
              <p className="text-gray-600">
                Anyone can verify certificate authenticity instantly using our verification system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="p-8">
        <div className="modern-card text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Certificates?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of institutions already using CertVerify to issue and verify tamper-proof certificates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link to="/upload" className="btn-modern btn-primary text-lg px-8 py-4">
                📤 Issue Your First Certificate
              </Link>
            ) : (
              <button onClick={connectWallet} className="btn-modern btn-primary text-lg px-8 py-4">
                👛 Connect Wallet & Start
              </button>
            )}
            <Link to="/verify" className="btn-modern btn-secondary text-lg px-8 py-4">
              🔍 Verify a Certificate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;