import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaTrash, FaRedo, FaClock, FaTable } from 'react-icons/fa';

const HistoryContainer = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--bg-color);
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`;

const HistoryTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
`;

const HistoryCount = styled.span`
  font-size: 0.9rem;
  color: var(--text-light);
  margin-left: 0.5rem;
`;

const SearchContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
`;

const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const EmptyHistory = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-light);
  font-style: italic;
`;

const HistoryItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const HistoryQueryText = styled.div`
  font-family: monospace;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 0.9rem;
`;

const HistoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-light);
`;

const HistoryTimestamp = styled.div``;

const HistoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MetricsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-light);
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &.slow {
    color: var(--warning-color, #f59e0b);
  }
  
  &.very-slow {
    color: var(--danger-color, #ef4444);
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  
  &:hover {
    color: var(--primary-color);
    background-color: rgba(37, 99, 235, 0.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    color: var(--danger-color);
    background-color: rgba(239, 68, 68, 0.1);
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Determine if a query is slow based on execution time
const getPerformanceClass = (executionTime) => {
  // Extract just the number from strings like "123.45 ms"
  const timeMs = parseFloat(executionTime);
  
  if (timeMs > 1000) {
    return 'very-slow';
  } else if (timeMs > 500) {
    return 'slow';
  }
  return '';
};

const QueryHistory = ({ onSelectQuery }) => {
  const { currentUser } = useContext(AuthContext);
  const [queryHistory, setQueryHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  
  // Load query history on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('queryHistory');
    if (storedHistory) {
      setQueryHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  // Filter history based on search term
  const filteredHistory = queryHistory.filter(query => 
    query.query.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectQuery = (query) => {
    if (onSelectQuery) {
      onSelectQuery(query.query);
    }
  };
  
  const handleDeleteQuery = (e, queryId) => {
    e.stopPropagation(); // Prevent item click event
    
    const updatedHistory = queryHistory.filter(q => q.id !== queryId);
    setQueryHistory(updatedHistory);
    localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all query history?')) {
      setQueryHistory([]);
      localStorage.removeItem('queryHistory');
    }
  };
  
  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>
          Query History
          <HistoryCount>({filteredHistory.length})</HistoryCount>
        </HistoryTitle>
        <div>
          <ActionButton
            title="Clear all history"
            onClick={handleClearHistory}
          >
            Clear All
          </ActionButton>
        </div>
      </HistoryHeader>
      
      <SearchContainer>
        <FaSearch style={{ color: 'var(--text-light)' }} />
        <SearchInput
          type="text"
          placeholder="Search query history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <HistoryList>
        {filteredHistory.length === 0 ? (
          <EmptyHistory>
            {searchTerm 
              ? 'No queries match your search.' 
              : 'No query history yet. Run some queries to see them here.'}
          </EmptyHistory>
        ) : (
          filteredHistory.map(query => (
            <HistoryItem 
              key={query.id} 
              onClick={() => handleSelectQuery(query)}
            >
              <HistoryQueryText>{query.query}</HistoryQueryText>
              
              {/* Display performance metrics if available */}
              {query.performanceMetrics && (
                <MetricsWrapper>
                  <MetricItem 
                    className={
                      getPerformanceClass(query.performanceMetrics.executionTime)
                    }
                  >
                    <FaClock size={12} />
                    <span>{query.performanceMetrics.executionTime}</span>
                  </MetricItem>
                  <MetricItem>
                    <FaTable size={12} />
                    <span>{query.performanceMetrics.rowCount} rows</span>
                  </MetricItem>
                </MetricsWrapper>
              )}
              
              <HistoryMeta>
                <HistoryTimestamp>
                  {formatDate(query.timestamp)}
                </HistoryTimestamp>
                <HistoryActions>
                  <ActionButton 
                    title="Run this query again"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectQuery(query);
                    }}
                  >
                    <FaRedo size={14} />
                  </ActionButton>
                  <DeleteButton 
                    title="Delete from history"
                    onClick={(e) => handleDeleteQuery(e, query.id)}
                  >
                    <FaTrash size={14} />
                  </DeleteButton>
                </HistoryActions>
              </HistoryMeta>
            </HistoryItem>
          ))
        )}
      </HistoryList>
    </HistoryContainer>
  );
};

export default QueryHistory; 