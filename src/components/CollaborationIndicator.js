import React from 'react';
import styled from 'styled-components';

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CollaboratorAvatars = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.8rem;
  margin-right: -8px;
  border: 2px solid var(--bg-color);
  position: relative;
  
  &:hover::after {
    content: '${props => props.name}';
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--bg-secondary);
    color: var(--text-color);
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const CollaboratorCount = styled.div`
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  margin-left: 0.5rem;
`;

const StatusText = styled.div`
  font-size: 0.85rem;
  color: var(--text-light);
`;

const CollaborationIndicator = ({ collaborators }) => {
  // If no collaborators, don't render anything
  if (!collaborators || collaborators.length === 0) return null;
  
  // Generate avatar colors based on name
  const getColorForUser = (name) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
    ];
    
    // Simple hash function to get a consistent color for a name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };
  
  // Display at most 3 avatars, then show +X for the rest
  const visibleCollaborators = collaborators.slice(0, 3);
  const remainingCount = collaborators.length - visibleCollaborators.length;
  
  return (
    <IndicatorContainer>
      <CollaboratorAvatars>
        {visibleCollaborators.map(user => (
          <Avatar 
            key={user.id} 
            color={getColorForUser(user.name)}
            name={user.name}
          >
            {getInitials(user.name)}
          </Avatar>
        ))}
        
        {remainingCount > 0 && (
          <Avatar color="#64748b">
            +{remainingCount}
          </Avatar>
        )}
      </CollaboratorAvatars>
      
      <StatusText>
        {collaborators.length === 1 
          ? '1 person is viewing this query' 
          : `${collaborators.length} people are viewing this query`}
      </StatusText>
    </IndicatorContainer>
  );
};

export default CollaborationIndicator; 