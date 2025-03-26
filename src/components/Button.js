import React from 'react';
import styled from 'styled-components';

const ButtonVariants = {
  primary: {
    background: 'var(--primary-color)',
    color: 'white',
    border: '1px solid var(--primary-color)',
    hoverBg: 'var(--primary-dark)',
  },
  secondary: {
    background: 'var(--secondary-color)',
    color: 'white',
    border: '1px solid var(--secondary-color)',
    hoverBg: 'var(--secondary-color)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--primary-color)',
    border: '1px solid var(--primary-color)',
    hoverBg: 'var(--primary-color)',
    hoverColor: 'white',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent',
    hoverBg: 'var(--background-secondary)',
  },
  danger: {
    background: 'var(--error-color)',
    color: 'white',
    border: '1px solid var(--error-color)',
    hoverBg: '#b91c1c',
  },
};

const ButtonSizes = {
  sm: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
  },
  md: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
  },
  lg: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
  },
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  outline: none;
  white-space: nowrap;
  
  /* Variant styles */
  background-color: ${({ variant }) => ButtonVariants[variant].background};
  color: ${({ variant }) => ButtonVariants[variant].color};
  border: ${({ variant }) => ButtonVariants[variant].border};
  
  /* Size styles */
  padding: ${({ size }) => ButtonSizes[size].padding};
  font-size: ${({ size }) => ButtonSizes[size].fontSize};
  
  /* Full width */
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  &:hover:not(:disabled) {
    background-color: ${({ variant }) => ButtonVariants[variant].hoverBg};
    color: ${({ variant }) => ButtonVariants[variant].hoverColor || ButtonVariants[variant].color};
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Icon positioning */
  svg {
    font-size: 1em;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  fullWidth = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </StyledButton>
  );
};

export default Button; 