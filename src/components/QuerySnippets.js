import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPuzzlePiece, FaPlus, FaTrash, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import { showSuccess, showError } from '../utils/toast';

const SnippetsContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const SnippetsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SnippetsTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const AddButton = styled.button`
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
`;

const SnippetsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const SnippetCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  overflow: hidden;
  transition: var(--transition);
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow);
  }
`;

const SnippetCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
`;

const SnippetTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
`;

const SnippetActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.25rem;
  transition: var(--transition);
  
  &:hover {
    color: ${props => props.delete ? 'var(--danger-color)' : 'var(--primary-color)'};
  }
`;

const SnippetContent = styled.pre`
  margin: 0;
  padding: 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-color);
  background-color: var(--bg-secondary);
  overflow-x: auto;
  max-height: 200px;
  cursor: pointer;
  white-space: pre-wrap;
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
  max-width: 600px;
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
  color: var(--text-light);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-family: monospace;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
    if (props.danger) return 'var(--danger-color)';
    if (props.success) return 'var(--success-color)';
    return 'var(--primary-color)';
  }};
  
  color: ${props => props.secondary ? 'var(--text-color)' : 'white'};
  
  border: ${props => props.secondary ? '1px solid var(--border-color)' : 'none'};
  
  &:hover {
    background-color: ${props => {
      if (props.secondary) return 'var(--bg-secondary)';
      if (props.danger) return 'var(--danger-dark)';
      if (props.success) return 'var(--success-dark)';
      return 'var(--primary-dark)';
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  grid-column: 1 / -1;
`;

// Sample default snippets
const DEFAULT_SNIPPETS = [
  {
    id: 1,
    name: "Common Table Expression (CTE)",
    content: "WITH cte_name AS (\n  SELECT column1, column2\n  FROM table_name\n  WHERE condition\n)\nSELECT * FROM cte_name;"
  },
  {
    id: 2,
    name: "CASE Statement",
    content: "SELECT column1,\n  CASE\n    WHEN condition1 THEN result1\n    WHEN condition2 THEN result2\n    ELSE default_result\n  END AS new_column\nFROM table_name;"
  },
  {
    id: 3,
    name: "Date Formatting",
    content: "-- MySQL\nSELECT DATE_FORMAT(date_column, '%Y-%m-%d') AS formatted_date\nFROM table_name;\n\n-- PostgreSQL\nSELECT TO_CHAR(date_column, 'YYYY-MM-DD') AS formatted_date\nFROM table_name;"
  }
];

const QuerySnippets = ({ onInsertSnippet }) => {
  const [snippets, setSnippets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState({ name: '', content: '' });
  
  // Load snippets from localStorage on component mount
  useEffect(() => {
    const savedSnippets = JSON.parse(localStorage.getItem('querySnippets') || 'null');
    if (savedSnippets) {
      setSnippets(savedSnippets);
    } else {
      // Initialize with default snippets if none exist
      setSnippets(DEFAULT_SNIPPETS);
      localStorage.setItem('querySnippets', JSON.stringify(DEFAULT_SNIPPETS));
    }
  }, []);
  
  const handleAddSnippet = () => {
    setCurrentSnippet({ name: '', content: '' });
    setEditMode(false);
    setShowModal(true);
  };
  
  const handleEditSnippet = (snippet) => {
    setCurrentSnippet(snippet);
    setEditMode(true);
    setShowModal(true);
  };
  
  const handleDeleteSnippet = (id) => {
    const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
    setSnippets(updatedSnippets);
    localStorage.setItem('querySnippets', JSON.stringify(updatedSnippets));
    showSuccess('Snippet deleted successfully');
  };
  
  const handleSaveSnippet = () => {
    if (!currentSnippet.name.trim() || !currentSnippet.content.trim()) {
      showError('Name and content are required');
      return;
    }
    
    let updatedSnippets;
    
    if (editMode) {
      // Update existing snippet
      updatedSnippets = snippets.map(snippet => 
        snippet.id === currentSnippet.id ? currentSnippet : snippet
      );
      showSuccess('Snippet updated successfully');
    } else {
      // Add new snippet
      const newSnippet = {
        ...currentSnippet,
        id: Date.now()
      };
      updatedSnippets = [...snippets, newSnippet];
      showSuccess('Snippet created successfully');
    }
    
    setSnippets(updatedSnippets);
    localStorage.setItem('querySnippets', JSON.stringify(updatedSnippets));
    setShowModal(false);
  };
  
  const handleInsertSnippet = (content) => {
    onInsertSnippet(content);
    showSuccess('Snippet inserted into query');
  };
  
  return (
    <SnippetsContainer>
      <SnippetsHeader>
        <SnippetsTitle>
          <FaPuzzlePiece /> SQL Snippets
        </SnippetsTitle>
        <AddButton onClick={handleAddSnippet}>
          <FaPlus size={12} /> Add Snippet
        </AddButton>
      </SnippetsHeader>
      
      <SnippetsList>
        {snippets.length === 0 ? (
          <EmptyState>
            No snippets yet. Create your first snippet to reuse SQL code.
          </EmptyState>
        ) : (
          snippets.map(snippet => (
            <SnippetCard key={snippet.id}>
              <SnippetCardHeader>
                <SnippetTitle>{snippet.name}</SnippetTitle>
                <SnippetActions>
                  <ActionButton 
                    onClick={() => handleEditSnippet(snippet)}
                    title="Edit snippet"
                  >
                    <FaEdit size={14} />
                  </ActionButton>
                  <ActionButton 
                    delete
                    onClick={() => handleDeleteSnippet(snippet.id)}
                    title="Delete snippet"
                  >
                    <FaTrash size={14} />
                  </ActionButton>
                </SnippetActions>
              </SnippetCardHeader>
              <SnippetContent 
                onClick={() => handleInsertSnippet(snippet.content)}
                title="Click to insert this snippet into your query"
              >
                {snippet.content}
              </SnippetContent>
            </SnippetCard>
          ))
        )}
      </SnippetsList>
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editMode ? 'Edit Snippet' : 'Create New Snippet'}</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <FaTimes size={18} />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <FormGroup>
                <Label htmlFor="snippetName">Snippet Name</Label>
                <Input
                  id="snippetName"
                  value={currentSnippet.name}
                  onChange={(e) => setCurrentSnippet({ ...currentSnippet, name: e.target.value })}
                  placeholder="Enter a descriptive name for your snippet"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="snippetContent">SQL Code</Label>
                <TextArea
                  id="snippetContent"
                  value={currentSnippet.content}
                  onChange={(e) => setCurrentSnippet({ ...currentSnippet, content: e.target.value })}
                  placeholder="Enter the SQL code for this snippet"
                />
              </FormGroup>
            </ModalBody>
            
            <ModalFooter>
              <Button secondary onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSnippet}>
                <FaSave size={14} /> {editMode ? 'Update Snippet' : 'Save Snippet'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </SnippetsContainer>
  );
};

export default QuerySnippets; 