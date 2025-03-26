import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaEdit, FaShareAlt, FaUsers, FaBook, FaPuzzlePiece, FaHistory, FaProjectDiagram, FaChartBar, FaMemory, FaClock } from 'react-icons/fa';
import ShareQueryModal from './ShareQueryModal';
import CollaborationIndicator from './CollaborationIndicator';
import QueryTemplates from './QueryTemplates';
import QuerySnippets from './QuerySnippets';
import QueryVersioning from './QueryVersioning';
import SqlFormatter from './SqlFormatter';
import QueryExplainVisualizer from './QueryExplainVisualizer';
import ResourceMonitor from './ResourceMonitor';
import QueryScheduler from './QueryScheduler';
import { showError, showInfo, showSuccess } from '../utils/toast';
import QueryResultsManager from './QueryResultsManager';

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TabHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
`;

const TabTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabTitleInput = styled.input`
  font-size: 1.1rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const TabActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  padding: 0.25rem;
  transition: var(--transition);
  border-radius: var(--border-radius);
  
  &:hover {
    color: ${props => {
      if (props.$delete) return 'var(--danger-color)';
      if (props.$share) return 'var(--success-color)';
      return 'var(--primary-color)';
    }};
    background-color: ${props => {
      if (props.$delete) return 'rgba(239, 68, 68, 0.1)';
      if (props.$share) return 'rgba(16, 185, 129, 0.1)';
      return 'rgba(37, 99, 235, 0.1)';
    }};
  }
`;

const QueryTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-family: monospace;
  resize: vertical;
  transition: var(--transition);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background-color: ${props => {
    if (props.$secondary) return 'transparent';
    if (props.$danger) return 'var(--danger-color)';
    if (props.$success) return 'var(--success-color)';
    return 'var(--primary-color)';
  }};
  
  color: ${props => props.$secondary ? 'var(--text-color)' : 'white'};
  
  border: ${props => props.$secondary ? '1px solid var(--border-color)' : 'none'};
  
  &:hover {
    background-color: ${props => {
      if (props.$secondary) return 'var(--bg-secondary)';
      if (props.$danger) return 'var(--danger-dark)';
      if (props.$success) return 'var(--success-dark)';
      return 'var(--primary-dark)';
    }};
  }
`;

const CollaborationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CollaborationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CollaborationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CollaborationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.$active ? 'var(--success-light)' : 'var(--bg-secondary)'};
  color: ${props => props.$active ? 'var(--success-color)' : 'var(--text-light)'};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const ToolToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  
  ${props => props.$active && `
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    
    &:hover {
      background-color: var(--primary-dark);
      color: white;
    }
  `}
`;

const ToolbarDivider = styled.div`
  height: 24px;
  width: 1px;
  background-color: var(--border-color);
  margin: 0 0.25rem;
`;

const PerformanceTabsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const PerformanceTab = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-light)'};
  font-weight: ${props => props.$active ? '500' : 'normal'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const QueryTab = ({ 
  queryText, 
  setQueryText, 
  results, 
  executeQuery, 
  onTabClose, 
  onTabRename,
  tabId,
  tabName,
  showSaveForm, 
  setShowSaveForm,
  queryName,
  setQueryName, 
  queryDescription, 
  setQueryDescription,
  saveCurrentQuery,
  handleSaveQueryClick,
  currentUser,
  isQueryRunning,
  queryExecutionTime
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(tabName);
  const [showShareModal, setShowShareModal] = useState(false);
  // Mock data for active collaborators - in a real app, this would come from a real-time service
  const [activeCollaborators, setActiveCollaborators] = useState([]);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);
  
  // State for advanced query management features
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  
  // New state for performance & optimization features
  const [showPerformance, setShowPerformance] = useState(false);
  const [activePerformanceTab, setActivePerformanceTab] = useState('explain');

  const [filteredResults, setFilteredResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(tabName);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      onTabRename(tabId, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  const handleTabClose = () => {
    onTabClose(tabId);
  };

  const toggleShareModal = () => {
    // Require login to share queries
    if (!currentUser) {
      // Show an error notification that user needs to log in
      showError("Please log in to share queries with others");
      return;
    }
    setShowShareModal(!showShareModal);
  };

  const toggleCollaboration = () => {
    // Require login to enable collaboration
    if (!currentUser) {
      // Show an error notification that user needs to log in
      showError("Please log in to enable collaboration features");
      return;
    }
    
    if (!collaborationEnabled) {
      // In a real app, this would connect to a real-time service
      console.log('Enabling real-time collaboration for query', tabId);
      
      // Mock data for demonstration - in a real app, this would come from the real-time service
      setActiveCollaborators([
        { id: 1, name: 'John Doe', active: true, lastActive: new Date() },
        { id: 2, name: 'Jane Smith', active: true, lastActive: new Date() }
      ]);
      
      // Show success notification
      showSuccess("Real-time collaboration enabled");
    } else {
      // In a real app, this would disconnect from the real-time service
      console.log('Disabling real-time collaboration for query', tabId);
      setActiveCollaborators([]);
      
      // Show info notification
      showInfo("Collaboration disabled");
    }
    
    setCollaborationEnabled(!collaborationEnabled);
  };

  const handleTemplateSelect = (templateQuery) => {
    setQueryText(templateQuery);
    showInfo('Template applied to query');
  };
  
  const handleInsertSnippet = (snippetText) => {
    // Get cursor position or end of text
    const textarea = document.querySelector(`textarea[id="query-${tabId}"]`);
    const cursorPos = textarea ? textarea.selectionStart : queryText.length;
    
    // Insert snippet at cursor position
    const newText = queryText.substring(0, cursorPos) + snippetText + queryText.substring(cursorPos);
    setQueryText(newText);
  };
  
  const handleRestoreVersion = (versionText) => {
    setQueryText(versionText);
  };
  
  const handleFormatQuery = (formattedQuery) => {
    setQueryText(formattedQuery);
  };
  
  const toggleTemplates = () => {
    setShowTemplates(!showTemplates);
    if (showSnippets) setShowSnippets(false);
    if (showVersions) setShowVersions(false);
  };
  
  const toggleSnippets = () => {
    setShowSnippets(!showSnippets);
    if (showTemplates) setShowTemplates(false);
    if (showVersions) setShowVersions(false);
  };
  
  const toggleVersions = () => {
    setShowVersions(!showVersions);
    if (showTemplates) setShowTemplates(false);
    if (showSnippets) setShowSnippets(false);
  };

  const togglePerformance = () => {
    setShowPerformance(!showPerformance);
  };

  const handleFilterResults = (filterCriteria) => {
    if (!results || !results.length) {
      showError('No results to filter');
      return;
    }

    const filtered = results.filter(row => {
      const value = row[filterCriteria.column];
      const filterValue = filterCriteria.value;

      switch (filterCriteria.operator) {
        case 'equals':
          return value === filterValue;
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'greaterThan':
          return Number(value) > Number(filterValue);
        case 'lessThan':
          return Number(value) < Number(filterValue);
        default:
          return true;
      }
    });

    setFilteredResults(filtered);
    showSuccess('Results filtered successfully');
  };

  const handleSortResults = (column, direction) => {
    if (!results || !results.length) {
      showError('No results to sort');
      return;
    }

    const sorted = [...results].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setSortedResults(sorted);
    showSuccess('Results sorted successfully');
  };

  const handleCompareResults = (cachedResults) => {
    if (!results || !results.length) {
      showError('No current results to compare');
      return;
    }

    // Implement comparison logic here
    showInfo('Results comparison feature coming soon');
  };

  console.log("QueryTab rendering with isQueryRunning:", isQueryRunning, "queryExecutionTime:", queryExecutionTime);

  return (
    <TabContainer>
      <TabHeader>
        {isEditingTitle ? (
          <TabTitleInput
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <TabTitle>
            {tabName}
            <ActionButton onClick={handleTitleClick}>
              <FaEdit size={14} />
            </ActionButton>
          </TabTitle>
        )}
        <TabActions>
          <ActionButton 
            $share 
            onClick={toggleShareModal}
            title={currentUser ? "Share this query" : "Log in to share"}
          >
            <FaShareAlt size={16} />
          </ActionButton>
          <ActionButton $delete onClick={handleTabClose}>
            <FaTimes size={16} />
          </ActionButton>
        </TabActions>
      </TabHeader>
      
      <TabContent>
        {/* Collaboration UI - only show if user is logged in */}
        {currentUser && (
          <>
            <CollaborationHeader>
              <CollaborationStatus>
                <CollaborationBadge $active={collaborationEnabled}>
                  <FaUsers size={12} />
                  {collaborationEnabled ? 'Collaboration On' : 'Collaboration Off'}
                </CollaborationBadge>
              </CollaborationStatus>
              
              <CollaborationButtons>
                <Button 
                  $secondary={collaborationEnabled}
                  $success={!collaborationEnabled}
                  onClick={toggleCollaboration}
                  title={collaborationEnabled ? 'Turn off real-time collaboration' : 'Turn on real-time collaboration'}
                  size="small"
                >
                  {collaborationEnabled ? 'Stop Collaborating' : 'Start Collaborating'}
                </Button>
              </CollaborationButtons>
            </CollaborationHeader>
            
            {/* Show collaborators if there are any */}
            {activeCollaborators.length > 0 && (
              <CollaborationIndicator collaborators={activeCollaborators} />
            )}
          </>
        )}
        
        {/* Advanced Query Management Toolbar */}
        <ToolbarContainer>
          <ToolToggleButton 
            $active={showTemplates}
            onClick={toggleTemplates}
          >
            <FaBook size={14} /> Templates
          </ToolToggleButton>
          
          <ToolToggleButton
            $active={showSnippets}
            onClick={toggleSnippets}
          >
            <FaPuzzlePiece size={14} /> Snippets
          </ToolToggleButton>
          
          <ToolToggleButton
            $active={showVersions}
            onClick={toggleVersions}
          >
            <FaHistory size={14} /> Versions
          </ToolToggleButton>
          
          <SqlFormatter 
            queryText={queryText} 
            onApplyFormatting={handleFormatQuery} 
          />
          
          <ToolbarDivider />
          
          <ToolToggleButton
            $active={showPerformance}
            onClick={togglePerformance}
          >
            <FaChartBar size={14} /> Performance
          </ToolToggleButton>
        </ToolbarContainer>
        
        {/* Show Templates when activated */}
        {showTemplates && (
          <QueryTemplates onSelectTemplate={handleTemplateSelect} />
        )}
        
        {/* Show Snippets when activated */}
        {showSnippets && (
          <QuerySnippets onInsertSnippet={handleInsertSnippet} />
        )}
        
        {/* Show Versions when activated */}
        {showVersions && (
          <QueryVersioning 
            queryText={queryText}
            activeQueryId={tabId}
            onRestoreVersion={handleRestoreVersion}
            currentUser={currentUser}
          />
        )}
        
        {/* Performance & Optimization Section */}
        {showPerformance && (
          <>
            <PerformanceTabsContainer>
              <PerformanceTab 
                $active={activePerformanceTab === 'explain'} 
                onClick={() => setActivePerformanceTab('explain')}
              >
                <FaProjectDiagram size={14} /> Explain Plan
              </PerformanceTab>
              <PerformanceTab 
                $active={activePerformanceTab === 'resources'} 
                onClick={() => setActivePerformanceTab('resources')}
              >
                <FaMemory size={14} /> Resource Usage
              </PerformanceTab>
              <PerformanceTab 
                $active={activePerformanceTab === 'scheduler'} 
                onClick={() => setActivePerformanceTab('scheduler')}
              >
                <FaClock size={14} /> Scheduled Runs
              </PerformanceTab>
            </PerformanceTabsContainer>
            
            {activePerformanceTab === 'explain' && (
              <QueryExplainVisualizer queryText={queryText} />
            )}
            
            {activePerformanceTab === 'resources' && (
              <ResourceMonitor 
                isQueryRunning={isQueryRunning} 
                queryExecutionTime={queryExecutionTime} 
              />
            )}
            
            {activePerformanceTab === 'scheduler' && (
              <QueryScheduler 
                queryText={queryText}
                queryName={queryName || tabName}
                tabId={tabId}
                currentUser={currentUser}
              />
            )}
          </>
        )}
        
        <div className="query-editor">
          <h3>SQL Query Editor</h3>
          <QueryTextArea
            id={`query-${tabId}`}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={8}
            placeholder="Write your SQL query here..."
          />
        </div>
        
        <div className="query-actions">
          <ButtonGroup>
            <Button onClick={executeQuery}>
              Run Query
            </Button>
            
            <Button 
              $secondary
              onClick={handleSaveQueryClick}
            >
              {showSaveForm ? 'Cancel' : 'Save Query'}
            </Button>
          </ButtonGroup>
        </div>
        
        {showSaveForm && currentUser && (
          <div className="save-query-form">
            <h3>Save Query</h3>
            <div className="form-group">
              <label htmlFor={`queryName-${tabId}`}>Query Name (required)</label>
              <input
                type="text"
                id={`queryName-${tabId}`}
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="Enter a name for your query"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`queryDescription-${tabId}`}>Description (optional)</label>
              <textarea
                id={`queryDescription-${tabId}`}
                value={queryDescription}
                onChange={(e) => setQueryDescription(e.target.value)}
                placeholder="Enter a description for your query"
                rows={3}
              />
            </div>
            
            <div className="form-actions">
              <Button onClick={saveCurrentQuery}>
                Save
              </Button>
              <Button 
                $secondary
                onClick={() => setShowSaveForm(false)} 
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {results && results.length > 0 && (
          <QueryResultsManager
            queryId={tabId}
            results={results}
            onCompare={handleCompareResults}
            onFilter={handleFilterResults}
            onSort={handleSortResults}
          />
        )}
      </TabContent>
      
      {/* Share Modal */}
      <ShareQueryModal
        isOpen={showShareModal}
        onClose={toggleShareModal}
        queryId={tabId}
        queryName={tabName}
      />
    </TabContainer>
  );
};

export default QueryTab; 