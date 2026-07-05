import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/settings.css';

export const SettingsPage = () => {
  const { user, logout, language, toggleLanguage, t } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApplyLanguage = () => {
    toast.success(language === 'en' ? 'Language settings applied!' : 'भाषा सेटिंग्स लागू की गईं!');
  };

  return (
    <>
      <Header />
      <Toaster />
      <div className="container page-container mt-4" style={{ minHeight: '80vh' }}>
        <h1 className="mb-4">{t('settingsAndProfile') || 'Settings & Profile'}</h1>

        <div className="row">
          {/* Settings Panel */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">{t('settings') || 'Settings'}</div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="mb-3">
                  <label htmlFor="languageSelect" className="form-label fw-medium">{t('language') || 'Language'}</label>
                  <select 
                    className="form-select" 
                    id="languageSelect"
                    value={language}
                    onChange={toggleLanguage}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                  <button onClick={handleApplyLanguage} className="btn btn-primary mt-3 w-100">
                    {t('applyLanguage') || 'Apply Language'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Panel */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">{t('userProfile') || 'User Profile'}</div>
              <div className="card-body">
                <div className="user-info text-center mb-4">
                  <div className="profile-img-container mb-3 mx-auto d-flex align-items-center justify-content-center bg-light border rounded-circle" style={{ width: '100px', height: '100px' }}>
                    <i className="fas fa-user-circle fa-5x text-secondary"></i>
                  </div>
                  <h5 className="mb-1">{user ? user.username : 'Guest'}</h5>
                  <p className="text-muted small">{user ? user.email : 'guest@example.com'}</p>
                </div>
                
                <div className="mb-3">
                  <label className="form-label small fw-medium">{t('username') || 'Username'}</label>
                  <input type="text" className="form-control" value={user ? user.username : ''} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">{t('email') || 'Email'}</label>
                  <input type="email" className="form-control" value={user ? user.email : ''} readOnly />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button onClick={() => toast.success('Profile editing is coming soon!')} className="btn btn-outline-primary">
                    {t('editProfile') || 'Edit Profile'}
                  </button>
                  <button onClick={handleLogout} className="btn btn-danger">
                    {t('logout') || 'Logout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default SettingsPage;
