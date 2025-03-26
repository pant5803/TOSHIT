import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';
import UserProfile from './UserProfile';

const AuthContainerWrapper = styled.div`
  margin-bottom: 2rem;
`;

const AuthContainer = () => {
  const [authMode, setAuthMode] = useState('login');
  const { currentUser } = useContext(AuthContext);

  // If user is logged in, show profile
  if (currentUser) {
    return (
      <AuthContainerWrapper>
        <UserProfile />
      </AuthContainerWrapper>
    );
  }

  // Otherwise show login or register form
  return (
    <AuthContainerWrapper>
      {authMode === 'login' ? (
        <Login onRegisterClick={() => setAuthMode('register')} />
      ) : (
        <Register onLoginClick={() => setAuthMode('login')} />
      )}
    </AuthContainerWrapper>
  );
};

export default AuthContainer; 