import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaExclamationCircle, FaEye, FaEdit, FaUsersCog } from 'react-icons/fa';
import { showSuccess, showInfo, showWarning } from '../utils/toast';

const InvitesContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
`;

const InvitesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const InvitesTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const CountBadge = styled.span`
  background-color: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
`;

const InvitesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NoInvites = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--text-light);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
`;

const InviteItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  transition: var(--transition);
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const InviteInfo = styled.div`
  flex: 1;
`;

const InviteTitle = styled.div`
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.25rem;
`;

const InviteDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-light);
`;

const InviterName = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PermissionTag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  background-color: ${props => {
    if (props.permission === 'view') return 'rgba(59, 130, 246, 0.1)';
    if (props.permission === 'edit') return 'rgba(16, 185, 129, 0.1)';
    if (props.permission === 'full') return 'rgba(139, 92, 246, 0.1)';
    return 'var(--bg-secondary)';
  }};
  color: ${props => {
    if (props.permission === 'view') return 'var(--primary-color)';
    if (props.permission === 'edit') return 'var(--success-color)';
    if (props.permission === 'full') return '#8b5cf6';
    return 'var(--text-light)';
  }};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const InviteDate = styled.span`
  font-size: 0.75rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    if (props.isAccept) return 'rgba(16, 185, 129, 0.1)';
    if (props.isReject) return 'rgba(239, 68, 68, 0.1)';
    return 'var(--bg-secondary)';
  }};
  color: ${props => {
    if (props.isAccept) return 'var(--success-color)';
    if (props.isReject) return 'var(--danger-color)';
    return 'var(--text-color)';
  }};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => {
      if (props.isAccept) return 'var(--success-color)';
      if (props.isReject) return 'var(--danger-color)';
      return 'var(--border-color)';
    }};
    color: ${props => {
      if (props.isAccept || props.isReject) return 'white';
      return 'var(--text-color)';
    }};
  }
`;

const CollaborationInvites = ({ currentUser }) => {
  // In a real app, this would come from a backend API
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch invites from an API
    // This is just mock data for demonstration
    setTimeout(() => {
      if (currentUser) {
        setInvites([
          {
            id: 1,
            queryId: 'q123456',
            queryName: 'Monthly Revenue Analysis',
            invitedBy: 'John Smith',
            invitedByEmail: 'john.smith@example.com',
            permission: 'edit',
            invitedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: 2,
            queryId: 'q789012',
            queryName: 'Customer Retention Query',
            invitedBy: 'Sarah Johnson',
            invitedByEmail: 'sarah.j@example.com',
            permission: 'view',
            invitedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
          {
            id: 3,
            queryId: 'q345678',
            queryName: 'Marketing Campaign Performance',
            invitedBy: 'Michael Davis',
            invitedByEmail: 'michael.d@example.com',
            permission: 'full',
            invitedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          }
        ]);
      }
      setLoading(false);
    }, 1000); // Simulate API delay
  }, [currentUser]);
  
  const handleAcceptInvite = (inviteId) => {
    // In a real app, this would make an API call to accept the invite
    console.log(`Accepting invite ${inviteId}`);
    
    const invite = invites.find(inv => inv.id === inviteId);
    
    // Filter out the accepted invite for the UI
    setInvites(invites.filter(invite => invite.id !== inviteId));
    
    // Show success notification
    showSuccess(`You are now collaborating on "${invite?.queryName || 'the query'}"`);
  };
  
  const handleRejectInvite = (inviteId) => {
    // In a real app, this would make an API call to reject the invite
    console.log(`Rejecting invite ${inviteId}`);
    
    const invite = invites.find(inv => inv.id === inviteId);
    
    // Filter out the rejected invite for the UI
    setInvites(invites.filter(invite => invite.id !== inviteId));
    
    // Show info notification
    showWarning(`Invitation for "${invite?.queryName || 'the query'}" rejected`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };
  
  const getPermissionIcon = (permission) => {
    switch (permission) {
      case 'view':
        return <FaEye size={12} />;
      case 'edit':
        return <FaEdit size={12} />;
      case 'full':
        return <FaUsersCog size={12} />;
      default:
        return null;
    }
  };
  
  const getPermissionText = (permission) => {
    switch (permission) {
      case 'view':
        return 'View only';
      case 'edit':
        return 'Can edit';
      case 'full':
        return 'Full access';
      default:
        return 'Unknown';
    }
  };
  
  // Don't render if user is not logged in
  if (!currentUser) return null;
  
  return (
    <InvitesContainer>
      <InvitesHeader>
        <InvitesTitle>
          Collaboration Invites
          {invites.length > 0 && <CountBadge>{invites.length}</CountBadge>}
        </InvitesTitle>
      </InvitesHeader>
      
      <InvitesList>
        {loading ? (
          <NoInvites>Loading collaboration invites...</NoInvites>
        ) : invites.length === 0 ? (
          <NoInvites>No pending invites at the moment</NoInvites>
        ) : (
          invites.map(invite => (
            <InviteItem key={invite.id}>
              <InviteInfo>
                <InviteTitle>{invite.queryName}</InviteTitle>
                <InviteDetails>
                  <InviterName>
                    From: {invite.invitedBy}
                  </InviterName>
                  <PermissionTag permission={invite.permission}>
                    {getPermissionIcon(invite.permission)} {getPermissionText(invite.permission)}
                  </PermissionTag>
                  <InviteDate>{formatDate(invite.invitedAt)}</InviteDate>
                </InviteDetails>
              </InviteInfo>
              
              <ActionButtons>
                <ActionButton 
                  isAccept
                  onClick={() => handleAcceptInvite(invite.id)}
                  title="Accept invitation"
                >
                  <FaCheck size={14} />
                </ActionButton>
                <ActionButton 
                  isReject
                  onClick={() => handleRejectInvite(invite.id)}
                  title="Reject invitation"
                >
                  <FaTimes size={14} />
                </ActionButton>
              </ActionButtons>
            </InviteItem>
          ))
        )}
      </InvitesList>
    </InvitesContainer>
  );
};

export default CollaborationInvites; 