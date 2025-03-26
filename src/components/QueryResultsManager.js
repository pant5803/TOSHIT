import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFilter, FaSort, FaHistory, FaExchangeAlt, FaTrash } from 'react-icons/fa';
import { showInfo, showSuccess, showError } from '../utils/toast';

const ResultsManagerContainer = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ResultsTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.1em;
`;

const ResultsActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryHover};
  }

  &:disabled {
    background: ${props => props.theme.disabled};
    cursor: not-allowed;
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResultItem = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResultName = styled.span`
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const ResultMeta = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9em;
`;

const ResultActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.background};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 400px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const FilterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${props => props.theme.text};
  font-size: 0.9em;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;

  ${props => props.$primary && `
    background: ${props.theme.primary};
    color: white;
    border: none;

    &:hover {
      background: ${props.theme.primaryHover};
    }
  `}

  ${props => props.$secondary && `
    background: transparent;
    color: ${props.theme.text};
    border: 1px solid ${props.theme.border};

    &:hover {
      background: ${props.theme.surface};
    }
  `}
`;

const QueryResultsManager = ({ queryId, results, onCompare, onFilter, onSort }) => {
  const [cachedResults, setCachedResults] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    column: '',
    operator: 'equals',
    value: ''
  });
  const [sortConfig, setSortConfig] = useState({
    column: '',
    direction: 'asc'
  });

  useEffect(() => {
    // Load cached results from localStorage
    const loadCachedResults = () => {
      const cached = localStorage.getItem(`query_results_${queryId}`);
      if (cached) {
        setCachedResults(JSON.parse(cached));
      }
    };

    loadCachedResults();
  }, [queryId]);

  const handleCacheResult = () => {
    if (!results || !results.length) {
      showError('No results to cache');
      return;
    }

    const newCache = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      results: results,
      queryId: queryId
    };

    const updatedCache = [...cachedResults, newCache];
    setCachedResults(updatedCache);
    localStorage.setItem(`query_results_${queryId}`, JSON.stringify(updatedCache));
    showSuccess('Results cached successfully');
  };

  const handleCompareResults = (cacheId) => {
    const selectedCache = cachedResults.find(cache => cache.id === cacheId);
    if (!selectedCache) {
      showError('Selected cache not found');
      return;
    }

    onCompare(selectedCache.results);
  };

  const handleDeleteCache = (cacheId) => {
    const updatedCache = cachedResults.filter(cache => cache.id !== cacheId);
    setCachedResults(updatedCache);
    localStorage.setItem(`query_results_${queryId}`, JSON.stringify(updatedCache));
    showSuccess('Cache deleted successfully');
  };

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter(filterCriteria);
    setShowFilterModal(false);
  };

  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction });
    onSort(column, direction);
  };

  return (
    <ResultsManagerContainer>
      <ResultsHeader>
        <ResultsTitle>Results Management</ResultsTitle>
        <ResultsActions>
          <ActionButton onClick={handleCacheResult}>
            <FaHistory /> Cache Results
          </ActionButton>
          <ActionButton onClick={() => setShowFilterModal(true)}>
            <FaFilter /> Filter
          </ActionButton>
          <ActionButton onClick={() => handleSort('timestamp')}>
            <FaSort /> Sort
          </ActionButton>
        </ResultsActions>
      </ResultsHeader>

      <ResultsList>
        {cachedResults.map(cache => (
          <ResultItem key={cache.id}>
            <ResultInfo>
              <ResultName>Cache {new Date(cache.timestamp).toLocaleString()}</ResultName>
              <ResultMeta>{cache.results.length} rows</ResultMeta>
            </ResultInfo>
            <ResultActions>
              <ActionButton onClick={() => handleCompareResults(cache.id)}>
                <FaExchangeAlt /> Compare
              </ActionButton>
              <ActionButton onClick={() => handleDeleteCache(cache.id)}>
                <FaTrash /> Delete
              </ActionButton>
            </ResultActions>
          </ResultItem>
        ))}
      </ResultsList>

      {showFilterModal && (
        <>
          <ModalOverlay onClick={() => setShowFilterModal(false)} />
          <FilterModal>
            <h3>Filter Results</h3>
            <FilterForm onSubmit={handleFilter}>
              <FormGroup>
                <Label>Column</Label>
                <Select
                  value={filterCriteria.column}
                  onChange={(e) => setFilterCriteria({ ...filterCriteria, column: e.target.value })}
                >
                  <option value="">Select Column</option>
                  {results[0] && Object.keys(results[0]).map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Operator</Label>
                <Select
                  value={filterCriteria.operator}
                  onChange={(e) => setFilterCriteria({ ...filterCriteria, operator: e.target.value })}
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greaterThan">Greater Than</option>
                  <option value="lessThan">Less Than</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Value</Label>
                <Input
                  type="text"
                  value={filterCriteria.value}
                  onChange={(e) => setFilterCriteria({ ...filterCriteria, value: e.target.value })}
                />
              </FormGroup>
              <ModalFooter>
                <Button $secondary onClick={() => setShowFilterModal(false)}>
                  Cancel
                </Button>
                <Button $primary type="submit">
                  Apply Filter
                </Button>
              </ModalFooter>
            </FilterForm>
          </FilterModal>
        </>
      )}
    </ResultsManagerContainer>
  );
};

export default QueryResultsManager; 