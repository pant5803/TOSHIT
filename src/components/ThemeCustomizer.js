import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { FaPalette, FaFont, FaTimes, FaCheck, FaSave, FaUndo } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import { showSuccess, showInfo } from '../utils/toast';

const CustomizerContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-320px'};
  width: 320px;
  height: 100vh;
  background-color: var(--bg-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const CustomizerHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CustomizerTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const CustomizerContent = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
`;

const CustomizerSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorOption = styled.button`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    display: ${props => props.selected ? 'block' : 'none'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
    background-size: 18px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const ColorInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  color: var(--text-color);
  background-color: var(--bg-secondary);
`;

const FontOption = styled.button`
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  font-family: ${props => props.fontFamily};
  font-size: 1rem;
  background-color: ${props => props.selected ? 'var(--bg-secondary)' : 'transparent'};
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const FontSizeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SizeButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  
  &:hover {
    background-color: var(--border-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SizeLabel = styled.span`
  min-width: 40px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-color);
`;

const CustomizerFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
`;

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--bg-secondary)'};
  }
`;

const PresetThemes = [
  {
    name: 'Default Blue',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    bgColor: '#ffffff',
    bgSecondary: '#f3f4f6',
    textColor: '#1f2937',
    borderColor: '#e5e7eb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Ocean',
    primaryColor: '#0ea5e9',
    secondaryColor: '#14b8a6',
    bgColor: '#f0f9ff',
    bgSecondary: '#e0f2fe',
    textColor: '#0c4a6e',
    borderColor: '#bae6fd',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Forest',
    primaryColor: '#22c55e',
    secondaryColor: '#eab308',
    bgColor: '#f0fdf4',
    bgSecondary: '#dcfce7',
    textColor: '#166534',
    borderColor: '#bbf7d0',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Sunset',
    primaryColor: '#f97316',
    secondaryColor: '#8b5cf6',
    bgColor: '#fff7ed',
    bgSecondary: '#ffedd5',
    textColor: '#9a3412',
    borderColor: '#fed7aa',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Ruby',
    primaryColor: '#e11d48',
    secondaryColor: '#0891b2',
    bgColor: '#fff1f2',
    bgSecondary: '#ffe4e6',
    textColor: '#9f1239',
    borderColor: '#fecdd3',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Dark Blue',
    primaryColor: '#60a5fa',
    secondaryColor: '#34d399',
    bgColor: '#0f172a',
    bgSecondary: '#1e293b',
    textColor: '#e2e8f0',
    borderColor: '#334155',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Dark Green',
    primaryColor: '#4ade80',
    secondaryColor: '#f472b6',
    bgColor: '#064e3b',
    bgSecondary: '#065f46',
    textColor: '#ecfdf5',
    borderColor: '#047857',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  {
    name: 'Dark Purple',
    primaryColor: '#a78bfa',
    secondaryColor: '#fb923c',
    bgColor: '#2e1065',
    bgSecondary: '#4c1d95',
    textColor: '#f5f3ff',
    borderColor: '#6d28d9',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }
];

const FontOptions = [
  { name: 'System UI', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' }
];

const ThemeCustomizer = ({ isOpen, toggleCustomizer }) => {
  const { isDarkMode, customTheme, setCustomTheme } = useContext(ThemeContext);
  
  const [currentTab, setCurrentTab] = useState('colors');
  const [currentTheme, setCurrentTheme] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    bgColor: isDarkMode ? '#1f2937' : '#ffffff',
    bgSecondary: isDarkMode ? '#374151' : '#f3f4f6',
    textColor: isDarkMode ? '#f9fafb' : '#1f2937',
    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 16
  });
  
  // Initialize theme from context if available
  useEffect(() => {
    if (customTheme) {
      setCurrentTheme({
        ...currentTheme,
        ...customTheme
      });
    }
  }, []);
  
  // Update when dark mode changes
  useEffect(() => {
    // Always update color scheme when dark mode changes, even with custom theme
    setCurrentTheme(prev => ({
      ...prev,
      bgColor: isDarkMode ? '#1f2937' : '#ffffff',
      bgSecondary: isDarkMode ? '#374151' : '#f3f4f6',
      textColor: isDarkMode ? '#f9fafb' : '#1f2937',
      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
    }));
  }, [isDarkMode]);
  
  const handleColorChange = (property, value) => {
    setCurrentTheme(prev => ({
      ...prev,
      [property]: value
    }));
  };
  
  const handleInputColorChange = (property, e) => {
    handleColorChange(property, e.target.value);
  };
  
  const handleFontChange = (fontFamily) => {
    setCurrentTheme(prev => ({
      ...prev,
      fontFamily
    }));
  };
  
  const handleFontSizeChange = (increment) => {
    setCurrentTheme(prev => ({
      ...prev,
      fontSize: Math.max(12, Math.min(20, prev.fontSize + increment))
    }));
  };
  
  const applyTheme = () => {
    // Save the current theme to context
    setCustomTheme(currentTheme);
    
    // Apply custom theme CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primaryColor);
    root.style.setProperty('--primary-dark', adjustColor(currentTheme.primaryColor, -20));
    root.style.setProperty('--secondary-color', currentTheme.secondaryColor);
    root.style.setProperty('--secondary-dark', adjustColor(currentTheme.secondaryColor, -20));
    root.style.setProperty('--bg-color', currentTheme.bgColor);
    root.style.setProperty('--bg-secondary', currentTheme.bgSecondary);
    root.style.setProperty('--text-color', currentTheme.textColor);
    root.style.setProperty('--text-light', adjustColor(currentTheme.textColor, 30, true));
    root.style.setProperty('--border-color', currentTheme.borderColor);
    root.style.setProperty('--font-family', currentTheme.fontFamily);
    root.style.fontSize = `${currentTheme.fontSize}px`;
    
    // Save theme to localStorage
    localStorage.setItem('customTheme', JSON.stringify(currentTheme));
    
    // Show success notification
    showSuccess("Theme changes applied successfully");
  };
  
  const resetTheme = () => {
    const defaultTheme = {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      bgColor: isDarkMode ? '#1f2937' : '#ffffff',
      bgSecondary: isDarkMode ? '#374151' : '#f3f4f6',
      textColor: isDarkMode ? '#f9fafb' : '#1f2937',
      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 16
    };
    
    setCurrentTheme(defaultTheme);
    setCustomTheme(null);
    
    // Reset CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--primary-dark');
    root.style.removeProperty('--secondary-color');
    root.style.removeProperty('--secondary-dark');
    root.style.removeProperty('--bg-color');
    root.style.removeProperty('--bg-secondary');
    root.style.removeProperty('--text-color');
    root.style.removeProperty('--text-light');
    root.style.removeProperty('--border-color');
    root.style.removeProperty('--font-family');
    root.style.removeProperty('font-size');
    
    // Remove from localStorage
    localStorage.removeItem('customTheme');
    
    // Show info notification
    showInfo("Theme reset to default");
  };
  
  const applyPresetTheme = (theme) => {
    setCurrentTheme(prev => ({
      ...prev,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      bgColor: theme.bgColor,
      bgSecondary: theme.bgSecondary,
      textColor: theme.textColor,
      borderColor: theme.borderColor,
      fontFamily: theme.fontFamily
    }));
    
    // Show info notification
    showInfo(`Applied ${theme.name} theme`);
  };
  
  // Helper function to darken/lighten colors
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
  
  return (
    <>
      <CustomizerContainer isOpen={isOpen}>
        <CustomizerHeader>
          <CustomizerTitle>Customize Theme</CustomizerTitle>
          <CloseButton onClick={toggleCustomizer}>
            <FaTimes />
          </CloseButton>
        </CustomizerHeader>
        
        <CustomizerContent>
          <CustomizerSection>
            <SectionTitle>
              <FaPalette /> Preset Themes
            </SectionTitle>
            <ColorGrid>
              {PresetThemes.map((theme, index) => (
                <ColorOption 
                  key={index}
                  color={theme.primaryColor}
                  onClick={() => applyPresetTheme(theme)}
                  title={theme.name}
                  selected={
                    theme.primaryColor === currentTheme.primaryColor &&
                    theme.bgColor === currentTheme.bgColor
                  }
                />
              ))}
            </ColorGrid>
          </CustomizerSection>
          
          <CustomizerSection>
            <SectionTitle>
              <FaPalette /> Colors
            </SectionTitle>
            
            <div>
              <h5>Primary Color</h5>
              <ColorInput 
                type="color" 
                value={currentTheme.primaryColor}
                onChange={(e) => handleInputColorChange('primaryColor', e)}
              />
            </div>
            
            <div>
              <h5>Secondary Color</h5>
              <ColorInput 
                type="color" 
                value={currentTheme.secondaryColor}
                onChange={(e) => handleInputColorChange('secondaryColor', e)}
              />
            </div>
            
            <div>
              <h5>Background Color</h5>
              <ColorInput 
                type="color" 
                value={currentTheme.bgColor}
                onChange={(e) => handleInputColorChange('bgColor', e)}
              />
            </div>
            
            <div>
              <h5>Secondary Background</h5>
              <ColorInput 
                type="color" 
                value={currentTheme.bgSecondary}
                onChange={(e) => handleInputColorChange('bgSecondary', e)}
              />
            </div>
            
            <div>
              <h5>Text Color</h5>
              <ColorInput 
                type="color" 
                value={currentTheme.textColor}
                onChange={(e) => handleInputColorChange('textColor', e)}
              />
            </div>
            
            <div>
              <h5>Border Color</h5>
              <ColorInput 
                type="color" 
                value={currentTheme.borderColor}
                onChange={(e) => handleInputColorChange('borderColor', e)}
              />
            </div>
          </CustomizerSection>
          
          <CustomizerSection>
            <SectionTitle>
              <FaFont /> Typography
            </SectionTitle>
            
            <div>
              <h5>Font Family</h5>
              {FontOptions.map((font, index) => (
                <FontOption
                  key={index}
                  fontFamily={font.value}
                  selected={currentTheme.fontFamily === font.value}
                  onClick={() => handleFontChange(font.value)}
                >
                  {font.name}
                  {currentTheme.fontFamily === font.value && <FaCheck size={14} />}
                </FontOption>
              ))}
            </div>
            
            <div>
              <h5>Font Size</h5>
              <FontSizeControls>
                <SizeButton 
                  onClick={() => handleFontSizeChange(-1)}
                  disabled={currentTheme.fontSize <= 12}
                >
                  -
                </SizeButton>
                <SizeLabel>{currentTheme.fontSize}px</SizeLabel>
                <SizeButton 
                  onClick={() => handleFontSizeChange(1)}
                  disabled={currentTheme.fontSize >= 20}
                >
                  +
                </SizeButton>
              </FontSizeControls>
            </div>
          </CustomizerSection>
        </CustomizerContent>
        
        <CustomizerFooter>
          <FooterButton onClick={resetTheme}>
            <FaUndo size={14} /> Reset
          </FooterButton>
          <FooterButton primary onClick={applyTheme}>
            <FaSave size={14} /> Apply Theme
          </FooterButton>
        </CustomizerFooter>
      </CustomizerContainer>
    </>
  );
};

export default ThemeCustomizer; 