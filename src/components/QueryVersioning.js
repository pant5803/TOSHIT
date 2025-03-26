import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHistory, FaUndo, FaEye, FaInfoCircle, FaSave } from 'react-icons/fa';
import { showSuccess, showInfo } from '../utils/toast';

const VersioningContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const VersioningHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const VersioningTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const SaveVersionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
`;

const VersionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const VersionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  ${props => props.active && `
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
    background-color: rgba(59, 130, 246, 0.05);
  `}
`;

const VersionInfo = styled.div`
  flex: 1;
`;

const VersionName = styled.div`
  font-weight: 500;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.active && `
    color: var(--primary-color);
  `}
`;

const VersionMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-light);
`;

const VersionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    if (props.primary) return 'var(--primary-color)';
    return 'transparent';
  }};
  color: ${props => {
    if (props.primary) return 'white';
    return 'var(--text-light)';
  }};
  border: ${props => {
    if (props.primary) return 'none';
    return '1px solid var(--border-color)';
  }};
  padding: ${props => props.primary ? '0.4rem 0.6rem' : '0.3rem 0.5rem'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => {
      if (props.primary) return 'var(--primary-dark)';
      return 'var(--bg-color)';
    }};
    color: ${props => {
      if (props.primary) return 'white';
      return 'var(--primary-color)';
    }};
    border-color: ${props => props.primary ? 'none' : 'var(--primary-color)'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  font-style: italic;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text-color);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-light);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const CodeViewer = styled.pre`
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--border-radius);
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-color);
  max-height: 400px;
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background-color: ${props => {
    if (props.secondary) return 'transparent';
    return 'var(--primary-color)';
  }};
  
  color: ${props => props.secondary ? 'var(--text-color)' : 'white'};
  
  border: ${props => props.secondary ? '1px solid var(--border-color)' : 'none'};
  
  &:hover {
    background-color: ${props => {
      if (props.secondary) return 'var(--bg-secondary)';
      return 'var(--primary-dark)';
    }};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const QueryVersioning = ({ 
  queryText, 
  activeQueryId,
  onRestoreVersion,
  currentUser
}) => {
  const [versions, setVersions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [versionName, setVersionName] = useState('');
  
  // Load versions from localStorage on component mount and when queryId changes
  useEffect(() => {
    if (activeQueryId) {
      loadVersions();
    }
  }, [activeQueryId]);
  
  const loadVersions = () => {
    // In a real app, this would fetch from a database
    // Here we use localStorage as a simple storage
    const savedVersions = JSON.parse(localStorage.getItem(`query_versions_${activeQueryId}`) || '[]');
    setVersions(savedVersions);
  };
  
  const handleSaveVersion = () => {
    if (!queryText.trim()) {
      return;
    }
    
    setVersionName('');
    setShowSaveModal(true);
  };
  
  const saveVersion = () => {
    const newVersion = {
      id: Date.now(),
      name: versionName || `Version ${versions.length + 1}`,
      queryText,
      timestamp: new Date().toISOString(),
      user: currentUser ? currentUser.username : 'Anonymous'
    };
    
    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    
    // Save to localStorage
    localStorage.setItem(`query_versions_${activeQueryId}`, JSON.stringify(updatedVersions));
    
    setShowSaveModal(false);
    showSuccess(`Version "${newVersion.name}" saved successfully`);
  };
  
  const handleViewVersion = (version) => {
    setSelectedVersion(version);
    setShowModal(true);
  };
  
  const handleRestoreVersion = (version) => {
    onRestoreVersion(version.queryText);
    showInfo(`Restored to version: ${version.name}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  return (
    <VersioningContainer>
      <VersioningHeader>
        <VersioningTitle>
          <FaHistory /> Query History & Versions
        </VersioningTitle>
        <SaveVersionButton 
          onClick={handleSaveVersion}
          disabled={!queryText.trim()}
        >
          <FaSave size={14} /> Save Current Version
        </SaveVersionButton>
      </VersioningHeader>
      
      <VersionsList>
        {versions.length === 0 ? (
          <EmptyState>
            No saved versions yet. Save a version to track changes to your query.
          </EmptyState>
        ) : (
          versions.map((version, index) => (
            <VersionItem key={version.id}>
              <VersionInfo>
                <VersionName>
                  {version.name} 
                  {index === 0 && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: 'var(--primary-color)', 
                      color: 'white',
                      padding: '0.15rem 0.4rem', 
                      borderRadius: '9999px', 
                      marginLeft: '0.5rem' 
                    }}>
                      LATEST
                    </span>
                  )}
                </VersionName>
                <VersionMeta>
                  <span>By: {version.user}</span>
                  <span>Saved: {formatDate(version.timestamp)}</span>
                </VersionMeta>
              </VersionInfo>
              <VersionActions>
                <ActionButton 
                  onClick={() => handleViewVersion(version)}
                  title="View this version"
                >
                  <FaEye size={14} />
                </ActionButton>
                <ActionButton 
                  primary
                  onClick={() => handleRestoreVersion(version)}
                  title="Restore this version"
                >
                  <FaUndo size={14} /> Restore
                </ActionButton>
              </VersionActions>
            </VersionItem>
          ))
        )}
      </VersionsList>
      
      {/* View Version Modal */}
      {showModal && selectedVersion && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selectedVersion.name}</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                <FaInfoCircle style={{ marginRight: '0.5rem' }} />
                Saved by {selectedVersion.user} on {formatDate(selectedVersion.timestamp)}
              </div>
              <CodeViewer>{selectedVersion.queryText}</CodeViewer>
            </ModalBody>
            <ModalFooter>
              <Button secondary onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                handleRestoreVersion(selectedVersion);
                setShowModal(false);
              }}>
                <FaUndo size={14} /> Restore This Version
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      
      {/* Save Version Modal */}
      {showSaveModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Save Current Version</ModalTitle>
              <CloseButton onClick={() => setShowSaveModal(false)}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label htmlFor="versionName">Version Name (optional)</Label>
                <Input
                  id="versionName"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder={`Version ${versions.length + 1}`}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button secondary onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={saveVersion}>
                <FaSave size={14} /> Save Version
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VersioningContainer>
  );
};

export default QueryVersioning; 