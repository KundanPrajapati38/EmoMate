import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './AuthContext';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light-mode');

  useEffect(() => {
    // Apply theme class to body element
    const body = document.body;
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async (token) => {
    const nextTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(nextTheme);

    // Save to user settings if logged in
    if (token) {
      try {
        await axios.put(`${API_URL}/auth/theme`, { theme: nextTheme });
      } catch (err) {
        console.error('Failed to sync theme preference with server', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
