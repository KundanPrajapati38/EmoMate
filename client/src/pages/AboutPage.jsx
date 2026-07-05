import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/about.css';

export const AboutPage = () => {
  return (
    <>
      <Header />
      <main>
        {/* About Section */}
        <section id="about" className="about-section py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0 text-center">
                <img src="/static/images/face_icon.svg" alt="EMOMATE Logo" className="img-fluid mb-2 animated-face-icon" style={{ maxWidth: '200px' }} />
              </div>
              <div className="col-lg-6">
                <h2 className="section-title mb-4">Who We Are</h2>
                <p className="lead"><strong>Emotion AI is at the forefront of developing cutting-edge artificial intelligence solutions that understand and interpret human emotions.</strong></p>
                <p><strong>Our mission is to bridge the gap between technology and human feelings, creating more intuitive and empathetic digital experiences. We believe in a future where technology enhances our emotional well-being and understanding.</strong></p>
                <div className="row mt-4">
                  <div className="col-md-6 feature-item">
                    <i className="fas fa-brain fa-2x mb-2 text-primary"></i>
                    <h5>Advanced Algorithms</h5>
                    <p>Utilizing the latest in machine learning and deep learning.</p>
                  </div>
                  <div className="col-md-6 feature-item">
                    <i className="fas fa-hand-holding-heart fa-2x mb-2 text-danger"></i>
                    <h5>Empathetic Technology</h5>
                    <p>Building systems that truly connect with users.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section id="vision-mission" className="vision-mission-section py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">Our Vision & Mission</h2>
              <p className="lead text-muted"><strong>Guiding principles that drive our innovation.</strong></p>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="vision-mission-card p-4 text-center rounded bg-white shadow-sm">
                  <i className="fas fa-eye fa-3x mb-3 text-primary"></i>
                  <h3>Our Vision</h3>
                  <p>To be the global leader in emotional intelligence technology, fostering a world where technology understands and responds to human emotions seamlessly.</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="vision-mission-card p-4 text-center rounded bg-white shadow-sm">
                  <i className="fas fa-rocket fa-3x mb-3 text-success"></i>
                  <h3>Our Mission</h3>
                  <p>To develop innovative, accurate, and ethical AI solutions that empower individuals and businesses to better understand, manage, and leverage emotional insights.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section id="impact-stats" className="impact-stats-section py-5 bg-primary text-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title text-white">Our Impact</h2>
              <p className="lead"><strong>Quantifying our contribution to a better, more empathetic world.</strong></p>
            </div>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="impact-card p-4 rounded bg-opacity-10 bg-white">
                  <i className="fas fa-users fa-3x mb-3"></i>
                  <h3>100K+</h3>
                  <p className="mb-0">Users Reached</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="impact-card p-4 rounded bg-opacity-10 bg-white">
                  <i className="fas fa-brain fa-3x mb-3"></i>
                  <h3>50M+</h3>
                  <p className="mb-0">Emotions Analyzed</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="impact-card p-4 rounded bg-opacity-10 bg-white">
                  <i className="fas fa-globe fa-3x mb-3"></i>
                  <h3>15</h3>
                  <p className="mb-0">Countries Engaged</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="team-section py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title">Our Team</h2>
              <p className="lead text-muted"><strong>Meet the passionate individuals behind Emotion AI.</strong></p>
            </div>
            <div className="row justify-content-center text-center">
              <div className="col-md-3 mb-4">
                <div className="team-member-card p-4 rounded shadow-sm border bg-white">
                  <img src="/static/images/Kundan.jpg" alt="Kundan" className="img-fluid rounded-circle mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} onError={(e)=>{e.target.src='/static/images/face_icon.svg'}} />
                  <h5>Kundan Prajapati</h5>
                  <p className="text-muted mb-0">CEO & Founder</p>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="team-member-card p-4 rounded shadow-sm border bg-white">
                  <div className="avatar-placeholder rounded-circle bg-light d-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: '120px', height: '120px' }}>
                    <i className="fas fa-user-circle fa-4x text-secondary"></i>
                  </div>
                  <h5>Muskan Jha</h5>
                  <p className="text-muted mb-0">Lead AI Engineer</p>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="team-member-card p-4 rounded shadow-sm border bg-white">
                  <img src="/static/images/Rahul.jpg" alt="Rahul" className="img-fluid rounded-circle mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} onError={(e)=>{e.target.src='/static/images/face_icon.svg'}} />
                  <h5>Rahul Kumar</h5>
                  <p className="text-muted mb-0">Product Manager</p>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="team-member-card p-4 rounded shadow-sm border bg-white">
                  <img src="/static/images/Vishwajeet.png" alt="Vishwajeet" className="img-fluid rounded-circle mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} onError={(e)=>{e.target.src='/static/images/face_icon.svg'}} />
                  <h5>Vishwajeet Kumar</h5>
                  <p className="text-muted mb-0">UX Designer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section id="cta" className="cta-section py-5 text-center text-white bg-dark">
          <div className="container">
            <h2 className="display-5 fw-bold mb-3">Ready to Transform Your Understanding?</h2>
            <p className="lead mb-4"><strong>Join us in exploring the power of emotional intelligence.</strong></p>
            <Link to="/emotion" className="btn btn-light btn-lg rounded-pill px-4 py-2">Get Started</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
export default AboutPage;
