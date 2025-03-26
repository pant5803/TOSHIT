import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import { FaMoon, FaSun, FaGithub } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  height: var(--header-height);
  background-color: var(--background-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: var(--text-primary);
  background-color: var(--background-secondary);
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
    color: white;
  }
`;

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <NavbarContainer>
      <Logo>
        <span role="img" aria-label="database-icon">🗄️</span>
        SQL Query Runner
      </Logo>
      <NavItems>
        <NavButton 
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} 
          onClick={toggleTheme}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </NavButton>
        <NavButton 
          as="a" 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          title="View source code"
        >
          <FaGithub />
        </NavButton>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar; 