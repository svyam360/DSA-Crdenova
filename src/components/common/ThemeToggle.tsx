import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
      <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;
