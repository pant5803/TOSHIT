import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLink, FaCopy, FaEnvelope, FaTimes, FaUserPlus, FaCheck } from 'react-icons/fa';
import { showSuccess, showError, showInfo } from '../utils/toast';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ShareSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ShareHeader = styled.h4`
  margin: 0 0 0.75rem 0;
  color: var(--text-color);
`;

const ShareDescription = styled.p`
  margin: 0 0 1rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
`;

const LinkContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const PermissionSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.9rem;
`;

const CollaboratorsList = styled.div`
  margin-top: 1rem;
`;

const CollaboratorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  background-color: var(--bg-secondary);
`;

const CollaboratorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollaboratorName = styled.span`
  font-weight: 500;
  color: var(--text-color);
`;

const CollaboratorEmail = styled.span`
  font-size: 0.85rem;
  color: var(--text-light);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const EmailInputContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.75rem;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--bg-secondary)'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ShareQueryModal = ({ isOpen, onClose, queryId, queryName }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [permission, setPermission] = useState('view');
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  const shareableLink = `${window.location.origin}/shared-query/${queryId}?permission=${permission}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopied(true);
        showSuccess("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setErrorMessage('Failed to copy link to clipboard');
        showError("Failed to copy link to clipboard");
      });
  };
  
  const handleAddCollaborator = () => {
    // Validate email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage('Please enter a valid email address');
      showError("Please enter a valid email address");
      return;
    }
    
    // Check if email already exists
    if (collaborators.some(c => c.email === email)) {
      setErrorMessage('This email is already added as a collaborator');
      showError("This email is already added as a collaborator");
      return;
    }
    
    // Add collaborator
    const newCollaborator = {
      id: Date.now(),
      name: email.split('@')[0], // Simple name from email
      email,
      permission,
      status: 'pending' // Track invitation status: pending, accepted, rejected
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    setEmail('');
    setErrorMessage('');
    showSuccess(`Added ${email} as a collaborator`);
  };
  
  const handleRemoveCollaborator = (id) => {
    const collaborator = collaborators.find(c => c.id === id);
    setCollaborators(collaborators.filter(c => c.id !== id));
    showInfo(`Removed ${collaborator?.email || 'collaborator'}`);
  };
  
  const handleSave = () => {
    // Here we would save the collaborator settings to the backend
    // and send invitations to the collaborators
    
    // Mock the API call
    console.log('Sharing settings saved:', {
      queryId,
      permission,
      collaborators
    });
    
    // In a real app, we would make an API call to send invitation emails
    // and store the invitations in the database
    collaborators.forEach(collaborator => {
      console.log(`Sending invitation to ${collaborator.email} with ${collaborator.permission} permission`);
      
      // Mock API call to send invitation
      // This would be a real API call in a production app
      setTimeout(() => {
        console.log(`Invitation sent to ${collaborator.email}`);
      }, 500);
    });
    
    // Show success message or notification
    if (collaborators.length > 0) {
      showSuccess(`Invitations sent to ${collaborators.length} collaborator${collaborators.length > 1 ? 's' : ''}`);
    } else if (permission !== 'view') {
      showSuccess(`Shareable link created with ${
        permission === 'edit' ? 'edit' : 'full access'
      } permission`);
    } else {
      showSuccess("Shareable link created");
    }
    
    // Close modal
    onClose();
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Share "{queryName || 'Query'}"</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <TabButtons>
          <TabButton 
            active={activeTab === 'link'} 
            onClick={() => setActiveTab('link')}
          >
            Share Link
          </TabButton>
          <TabButton 
            active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')}
          >
            Invite Collaborators
          </TabButton>
        </TabButtons>
        
        {activeTab === 'link' && (
          <ShareSection>
            <ShareHeader>Create a shareable link</ShareHeader>
            <ShareDescription>
              Anyone with this link will be able to access this query based on the permission settings.
            </ShareDescription>
            
            <PermissionSelect 
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="view">Can view (Read-only)</option>
              <option value="edit">Can edit (Modify query)</option>
              <option value="full">Full access (Modify and share)</option>
            </PermissionSelect>
            
            <LinkContainer>
              <LinkInput 
                type="text" 
                value={shareableLink} 
                readOnly 
                onClick={(e) => e.target.select()}
              />
              <CopyButton onClick={copyLink}>
                <FaCopy />
                {copied ? 'Copied!' : 'Copy'}
              </CopyButton>
            </LinkContainer>
          </ShareSection>
        )}
        
        {activeTab === 'email' && (
          <ShareSection>
            <ShareHeader>Invite people</ShareHeader>
            <ShareDescription>
              Add people by email to collaborate on this query.
            </ShareDescription>
            
            {errorMessage && (
              <ErrorMessage>
                {errorMessage}
              </ErrorMessage>
            )}
            
            <EmailInputContainer>
              <EmailInput 
                type="email" 
                placeholder="Add people by email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCollaborator();
                }}
              />
              <AddButton onClick={handleAddCollaborator}>
                Invite
              </AddButton>
            </EmailInputContainer>
            
            <PermissionSelect 
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="view">Can view (Read-only)</option>
              <option value="edit">Can edit (Modify query)</option>
              <option value="full">Full access (Modify and share)</option>
            </PermissionSelect>
            
            {collaborators.length > 0 && (
              <CollaboratorsList>
                <ShareHeader>Collaborators</ShareHeader>
                {collaborators.map(collaborator => (
                  <CollaboratorItem key={collaborator.id}>
                    <CollaboratorInfo>
                      <CollaboratorName>{collaborator.name}</CollaboratorName>
                      <CollaboratorEmail>{collaborator.email}</CollaboratorEmail>
                    </CollaboratorInfo>
                    <RemoveButton 
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      title="Remove collaborator"
                    >
                      <FaTimes />
                    </RemoveButton>
                  </CollaboratorItem>
                ))}
              </CollaboratorsList>
            )}
          </ShareSection>
        )}
        
        <ButtonGroup>
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton primary onClick={handleSave}>
            Save
          </ActionButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ShareQueryModal; 