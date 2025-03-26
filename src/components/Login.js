import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { showSuccess, showError, showInfo } from '../utils/toast';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
`;

const LoginHeader = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.5rem;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SwitchMode = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      showSuccess('Login successful! Welcome back.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>Log In</LoginHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LoginForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Log In</SubmitButton>
      </LoginForm>
      <SwitchMode>
        Don't have an account?
        <SwitchButton type="button" onClick={onRegisterClick}>
          Register
        </SwitchButton>
      </SwitchMode>
    </LoginContainer>
  );
};

export default Login; 