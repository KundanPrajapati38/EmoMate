import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/login.css';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, language, toggleLanguage, t, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to emotion page
    if (user) {
      navigate('/emotion');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'कृपया सभी फ़ील्ड भरें');
      return;
    }

    try {
      await login(username, password);
      toast.success(language === 'en' ? 'Login successful!' : 'लॉगिन सफल!');
      setTimeout(() => {
        navigate('/emotion');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || (language === 'en' ? 'Invalid credentials' : 'अमान्य क्रेडेंशियल'));
    }
  };

  return (
    <div className="auth-body d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #74ebd5, #9face6)' }}>
      <Toaster />
      <div className="auth-container animate__animated animate__zoomIn">
        <div className="auth-image">
          <div className="auth-image-content">
            <div className="community-animation">
              <i className="fas fa-brain"></i>
              <div className="pulse-circle"></div>
            </div>
            <h2>{language === 'en' ? 'Welcome to EmoMate!' : 'EmoMate में आपका स्वागत है!'}</h2>
            <p>{language === 'en' ? 'Understand your emotions and improve your mental health.' : 'अपनी भावनाओं को समझें और अपने मानसिक स्वास्थ्य को बेहतर बनाएं।'}</p>
            <Link to="/signup" className="btn btn-outline-light">{language === 'en' ? 'Sign Up' : 'साइन अप करें'}</Link>
          </div>
        </div>
        
        <div className="auth-form">
          <h2>{language === 'en' ? 'Login' : 'लॉगिन'}</h2>
          
          <div className="form-check form-switch mb-3">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="languageToggle" 
              checked={language === 'hi'} 
              onChange={toggleLanguage} 
            />
            <label className="form-check-label" htmlFor="languageToggle">हिंदी / English</label>
          </div>

          <form onSubmit={handleSubmit} className="needs-validation">
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="username" 
                placeholder={language === 'en' ? 'Username' : 'उपयोगकर्ता नाम'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
              <label htmlFor="username">{language === 'en' ? 'Username' : 'उपयोगकर्ता नाम'}</label>
            </div>

            <div className="form-floating mb-3 password-container">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control" 
                id="password" 
                placeholder={language === 'en' ? 'Password' : 'पासवर्ड'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <label htmlFor="password">{language === 'en' ? 'Password' : 'पासवर्ड'}</label>
              <button 
                type="button" 
                id="password-toggle" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', position: 'absolute', right: '15px', top: '18px', zIndex: 10 }}
              >
                <i className={showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">
                  {language === 'en' ? 'Remember Me' : 'मुझे याद रखें'}
                </label>
              </div>
              <a href="#" className="forgot-password">{language === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}</a>
            </div>

            <button type="submit" className="btn btn-auth">{language === 'en' ? 'Login' : 'लॉगिन'}</button>
          </form>

          <div className="divider">{language === 'en' ? 'OR' : 'या'}</div>

          <div className="social-login">
            <button className="btn social-btn google-btn">
              <i className="fab fa-google"></i> {language === 'en' ? 'Login with Google' : 'Google के साथ लॉगिन करें'}
            </button>
            <button className="btn social-btn facebook-btn">
              <i className="fab fa-facebook-f"></i> {language === 'en' ? 'Login with Facebook' : 'Facebook के साथ लॉगिन करें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
