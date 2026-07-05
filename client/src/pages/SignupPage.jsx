import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/signup.css';

export const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signup, language, toggleLanguage, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/emotion');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'कृपया सभी फ़ील्ड भरें');
      return;
    }

    try {
      await signup(username, email, password);
      toast.success(language === 'en' ? 'Signup successful!' : 'साइन अप सफल!');
      setTimeout(() => {
        navigate('/emotion');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || (language === 'en' ? 'Signup failed' : 'साइन अप विफल रहा'));
    }
  };

  return (
    <div className="auth-body d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #74ebd5, #9face6)' }}>
      <Toaster />
      <div className="auth-container animate__animated animate__zoomIn">
        <div className="auth-form">
          <h2>{language === 'en' ? 'Sign Up' : 'साइन अप करें'}</h2>
          
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

            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder={language === 'en' ? 'Email' : 'ईमेल'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <label htmlFor="email">{language === 'en' ? 'Email' : 'ईमेल'}</label>
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

            <button type="submit" className="btn btn-auth">{language === 'en' ? 'Sign Up' : 'साइन अप करें'}</button>
          </form>

          <div className="divider">{language === 'en' ? 'OR' : 'या'}</div>

          <div className="social-login">
            <button className="btn social-btn google-btn">
              <i className="fab fa-google"></i> {language === 'en' ? 'Sign up with Google' : 'Google के साथ साइन अप करें'}
            </button>
            <button className="btn social-btn facebook-btn">
              <i className="fab fa-facebook-f"></i> {language === 'en' ? 'Sign up with Facebook' : 'Facebook के साथ साइन अप करें'}
            </button>
          </div>
        </div>

        <div className="auth-image">
          <div className="auth-image-content">
            <div className="community-animation">
              <i className="fas fa-brain"></i>
              <div className="pulse-circle"></div>
            </div>
            <h2>{language === 'en' ? 'Welcome to EmoMate!' : 'EmoMate में आपका स्वागत है!'}</h2>
            <p>{language === 'en' ? 'Understand your emotions and improve your mental health.' : 'अपनी भावनाओं को समझें और अपने मानसिक स्वास्थ्य को बेहतर बनाएं।'}</p>
            <Link to="/login" className="btn btn-outline-light">{language === 'en' ? 'Login' : 'लॉगिन करें'}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
