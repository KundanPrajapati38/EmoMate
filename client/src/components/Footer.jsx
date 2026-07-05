import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export const Footer = () => {
  return (
    <footer className="footer bg-dark pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-white">About Us</h5>
            <p className="text-light">We are dedicated to providing cutting-edge facial recognition technology for a safer and more connected world.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-decoration-none text-light">About</Link></li>
              <li><Link to="/emotion" className="text-decoration-none text-light">Emotion Detection</Link></li>
              <li><a href="#" className="text-decoration-none text-light">Privacy Policy</a></li>
              <li><a href="#" className="text-decoration-none text-light">Terms of Service</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-white">Connect With Us</h5>
            <div className="social-icons mt-3">
              <a href="#" className="me-3 text-light"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="me-3 text-light"><i className="fab fa-twitter"></i></a>
              <a href="#" className="me-3 text-light"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-light"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <hr className="bg-light my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-light">&copy; 2026 EmoMate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
