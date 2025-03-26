import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaKey, FaSignOutAlt, FaSave } from 'react-icons/fa';
import { showSuccess, showError, showInfo } from '../utils/toast';

const ProfileContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

const UserName = styled.div`
  font-weight: 500;
`;

const UserEmail = styled.div`
  font-size: 0.9rem;
  color: var(--text-light);
`;

const LogoutButton = styled.button`
  background-color: var(--danger-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--danger-dark);
  }
`;

const UserQueries = styled.div`
  margin-top: 1.5rem;
`;

const QueriesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const QueriesTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const QueriesCount = styled.span`
  font-size: 0.9rem;
  color: var(--text-light);
  margin-left: 0.5rem;
`;

const EmptyQueries = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
  font-style: italic;
  padding: 1rem 0;
`;

const UserProfile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [error, setError] = useState('');

  if (!currentUser) {
    return null;
  }

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const savedQueriesCount = currentUser.savedQueries?.length || 0;

  const handleLogout = async () => {
    try {
      await logout();
      showInfo('You have been logged out');
    } catch (err) {
      setError('Failed to log out');
      showError('Failed to log out: ' + err.message);
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <UserInfo>
          <Avatar>{getInitials(currentUser.username)}</Avatar>
          <div>
            <UserName>{currentUser.username}</UserName>
            <UserEmail>{currentUser.email}</UserEmail>
          </div>
        </UserInfo>
        <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
      </ProfileHeader>

      <UserQueries>
        <QueriesHeader>
          <div>
            <QueriesTitle>Your Saved Queries</QueriesTitle>
            <QueriesCount>({savedQueriesCount})</QueriesCount>
          </div>
        </QueriesHeader>

        {savedQueriesCount === 0 ? (
          <EmptyQueries>You don't have any saved queries yet. Run a query and save it to your collection.</EmptyQueries>
        ) : (
          <EmptyQueries>Scroll down to view and manage your saved queries.</EmptyQueries>
        )}
      </UserQueries>
    </ProfileContainer>
  );
};

export default UserProfile; 