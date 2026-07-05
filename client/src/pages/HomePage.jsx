import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/home.css';

export const HomePage = () => {
  const { t } = useContext(AuthContext);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section py-5 mb-5" id="hero-section">
        <div className="hero-background" id="hero-background"></div>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold main-title">
                {t('heroTitle') || 'Advanced Face Recognition Technology'}
              </h1>
              <p className="lead mb-4 hero-subtitle">
                <strong>
                  {t('heroSubtitle') || 'Experience the future of facial recognition with our cutting-edge AI technology that provides secure, fast, and accurate identification.'}
                </strong>
              </p>
              <div className="d-flex gap-3">
                <Link to="/emotion" className="btn btn-primary btn-lg">
                  <i className="fas fa-face-smile me-2"></i>
                  <span>{t('tryEmotionDetection') || 'Try Emotion Detection'}</span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <div id="hero-right-content" className="position-relative">
                <div id="three-d-animation">
                  <div className="face-front"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                  <div className="face-back"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                  <div className="face-right"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                  <div className="face-left"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                  <div className="face-top"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                  <div className="face-bottom"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">{t('featuresTitle') || 'Our Technology Features'}</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-shield-alt fa-2x"></i>
                  </div>
                  <h4>{t('featureSecurityTitle') || 'Advanced Security'}</h4>
                  <p className="text-muted">{t('featureSecurityDescription') || 'Our facial recognition system provides enterprise-grade security with liveness detection to prevent spoofing attempts.'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-success bg-gradient text-white rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-bolt fa-2x"></i>
                  </div>
                  <h4>{t('featureFastResponseTitle') || 'Fast Response'}</h4>
                  <p className="text-muted">{t('featureFastResponseDescription') || 'Get real-time results with our optimized algorithms that can process facial data in milliseconds.'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-info bg-gradient text-white rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-brain fa-2x"></i>
                  </div>
                  <h4>{t('featureAITechnologyTitle') || 'AI-Based Technology'}</h4>
                  <p className="text-muted">{t('featureAITechnologyDescription') || 'Powered by deep learning neural networks trained on diverse datasets for high accuracy across all demographics.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Applications Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">{t('applicationsTitle') || 'Applications'}</h2>
          <div className="row g-4">
            <div className="col-md-3 col-6 text-center">
              <div className="app-icon rounded-circle bg-primary bg-opacity-10 p-3 mb-3 mx-auto" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-building text-primary fa-2x"></i>
              </div>
              <h5>{t('applicationAccessControl') || 'Access Control'}</h5>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="app-icon rounded-circle bg-success bg-opacity-10 p-3 mb-3 mx-auto" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-mobile-alt text-success fa-2x"></i>
              </div>
              <h5>{t('applicationMobileAuthentication') || 'Mobile Authentication'}</h5>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="app-icon rounded-circle bg-warning bg-opacity-10 p-3 mb-3 mx-auto" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-credit-card text-warning fa-2x"></i>
              </div>
              <h5>{t('applicationPaymentSystems') || 'Payment Systems'}</h5>
            </div>
            <div className="col-md-3 col-6 text-center">
              <div className="app-icon rounded-circle bg-danger bg-opacity-10 p-3 mb-3 mx-auto" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i class="fas fa-user-shield text-danger fa-2x"></i>
              </div>
              <h5>{t('applicationSecuritySystems') || 'Security Systems'}</h5>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img src="https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=2069&auto=format&fit=crop" alt="Face Recognition Demo" className="img-fluid rounded shadow" />
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4">{t('demoTitle') || 'Try Our Emotion Detection System'}</h2>
              <p className="lead mb-4"><strong>{t('demoSubtitle') || 'Experience our facial emotion recognition technology that can detect 7 different emotions with high accuracy.'}</strong></p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> <span>{t('demoFeature1') || 'Real-time analysis'}</span></li>
                <li className="mb-2"><i class="fas fa-check-circle text-success me-2"></i> <span>{t('demoFeature2') || 'Works on any device with a camera'}</span></li>
                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> <span>{t('demoFeature3') || 'No registration required'}</span></li>
                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> <span>{t('demoFeature4') || 'Privacy-focused (no data stored)'}</span></li>
              </ul>
              <Link to="/emotion" className="btn btn-primary btn-lg">
                <i className="fas fa-play-circle me-2"></i><span>{t('demoTryNow') || 'Try Demo Now'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">{t('testimonialsTitle') || 'What Our Users Say'}</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <img src="/static/images/Aman.jpg" alt="User Photo" className="rounded-circle mb-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  <p className="card-text">"{t('testimonial1') || 'This emotion system is incredibly accurate and easy to use. It greatly improved our customer service interactions.'}"</p>
                  <footer className="blockquote-footer">{t('testimonialAuthor1') || 'Aman Yadav, user of Tech Solutions'}</footer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <img src="/static/images/Abhi.jpg" alt="User Photo" className="rounded-circle mb-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  <p className="card-text">"{t('testimonial2') || 'I\'m amazed by the real-time capabilities. It\'s a powerful tool for understanding user sentiment.'}"</p>
                  <footer className="blockquote-footer">{t('testimonialAuthor2') || 'Abhinav Prajapati, Marketing Director'}</footer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <img src="/static/images/us.png" alt="User Photo" className="rounded-circle mb-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  <p className="card-text">"{t('testimonial3') || 'The privacy-focused approach is a huge plus. We can analyze emotions without compromising user data.'}"</p>
                  <footer className="blockquote-footer">{t('testimonialAuthor3') || 'Mayur Prajapati, Data Security Analyst'}</footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};
export default HomePage;
