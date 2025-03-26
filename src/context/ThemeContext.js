import React, { createContext, useState, useEffect } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customTheme, setCustomTheme] = useState(null);
  
  // Initialize theme from localStorage if available
  useEffect(() => {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    } else {
      // Check if user prefers dark mode at the OS level
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
    }
    
    // Check for custom theme
    const savedCustomTheme = localStorage.getItem('customTheme');
    if (savedCustomTheme) {
      try {
        const parsedTheme = JSON.parse(savedCustomTheme);
        setCustomTheme(parsedTheme);
        
        // Apply custom theme CSS variables
        applyCustomTheme(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);
  
  // Update theme when dark mode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDarkMode);
    
    // If using a custom theme, update it for dark/light mode
    if (customTheme) {
      const updatedTheme = {
        ...customTheme,
        bgColor: isDarkMode ? '#1f2937' : '#ffffff',
        bgSecondary: isDarkMode ? '#374151' : '#f3f4f6',
        textColor: isDarkMode ? '#f9fafb' : '#1f2937',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
      };
      applyCustomTheme(updatedTheme);
    }
  }, [isDarkMode, customTheme]);
  
  // Function to toggle between light and dark modes
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Function to apply custom theme CSS variables
  const applyCustomTheme = (theme) => {
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--primary-dark', adjustColor(theme.primaryColor, -20));
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--secondary-dark', adjustColor(theme.secondaryColor, -20));
    root.style.setProperty('--bg-color', theme.bgColor);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--text-light', adjustColor(theme.textColor, 30, true));
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    
    if (theme.fontSize) {
      root.style.fontSize = `${theme.fontSize}px`;
    }
  };
  
  // Helper function to adjust colors (simplified version)
  const adjustColor = (hex, amount, isTransparency = false) => {
    if (isTransparency) {
      // Convert hex to RGB and add transparency
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }
    
    return hex;
  };

  // Provide the theme context values to children
  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      customTheme, 
      setCustomTheme: (theme) => {
        setCustomTheme(theme);
        applyCustomTheme(theme);
      }
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 