import React from 'react';
import styled from 'styled-components';
import { sampleQueries } from '../data/sampleData';

const SelectorContainer = styled.div`
  margin-bottom: 1rem;
`;

const SelectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SelectorTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
`;

const SelectorSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    outline: none;
  }
`;

const QueryDescription = styled.p`
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const QuerySelector = ({ selectedQueryId, onQuerySelect }) => {
  const handleChange = (e) => {
    const id = parseInt(e.target.value);
    const query = sampleQueries.find(q => q.id === id);
    onQuerySelect(query);
  };

  const selectedQuery = sampleQueries.find(q => q.id === selectedQueryId);

  return (
    <SelectorContainer>
      <SelectorHeader>
        <SelectorTitle>Example Queries</SelectorTitle>
      </SelectorHeader>
      <SelectorSelect 
        value={selectedQueryId} 
        onChange={handleChange}
      >
        <option value="">-- Select a query --</option>
        {sampleQueries.map(query => (
          <option key={query.id} value={query.id}>
            {query.name}
          </option>
        ))}
      </SelectorSelect>
      {selectedQuery && (
        <QueryDescription>
          {selectedQuery.description}
        </QueryDescription>
      )}
    </SelectorContainer>
  );
};

export default QuerySelector; 