import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/header.css';

export const Header = () => {
  const { user, logout, language, toggleLanguage, t } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/static/images/headerlogo.png" alt="Emomate Logo" className="img-fluid" style={{ maxWidth: '50px' }} />
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/')}`} to="/">
                  {t('home')}
                </Link>
              </li>
              
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/emotion')}`} to="/emotion">
                  {t('emotion')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/companion')}`} to="/companion">
                  {t('companion')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/about')}`} to="/about">
                  {t('about')}
                </Link>
              </li>
            </ul>
            
            <div className="d-flex align-items-center">
              {/* Language Switcher */}
              <button onClick={toggleLanguage} className="btn btn-outline-info btn-sm me-2">
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>

              {user ? (
                <>
                  <Link to="/settings" className="btn btn-outline-primary me-2">
                    {t('settings')}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger">
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">
                    {t('login')}
                  </Link>
                  <Link to="/signup" className="btn btn-success">
                    {t('signup')}
                  </Link>
                </>
              )}

              {/* Theme Toggle Button */}
              <button 
                id="theme-toggle" 
                onClick={() => toggleTheme(localStorage.getItem('token'))} 
                className="btn btn-outline-secondary ms-2"
              >
                <i className={theme === 'light-mode' ? 'fas fa-moon' : 'fas fa-sun'}></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
