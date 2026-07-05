import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Use the local express port for API requests
export const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const [translations, setTranslations] = useState(null);

  // Load translations
  useEffect(() => {
    fetch('/static/translations.json')
      .then(res => res.json())
      .then(data => {
        setTranslations(data);
      })
      .catch(err => console.error('Failed to load translations:', err));
  }, []);

  // Fetch logged in user details if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user);
        } catch (err) {
          console.error('Session expired or invalid token', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { username, password });
    const { token: userToken, user: userData } = res.data;
    localStorage.setItem('token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const signup = async (username, email, password) => {
    const res = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
    const { token: userToken, user: userData } = res.data;
    localStorage.setItem('token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    localStorage.setItem('lang', nextLang);
    setLanguage(nextLang);
  };

  // Get dynamic translated string or fallback to key itself
  const t = (key) => {
    if (!translations || !translations[language]) return key;
    return translations[language][key] || key;
  };

  const getCannedResponse = (emotion) => {
    if (!translations || !translations[language]) return '';
    return translations[language].canned_responses?.[emotion] || '';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      language,
      toggleLanguage,
      t,
      getCannedResponse
    }}>
      {children}
    </AuthContext.Provider>
  );
};
