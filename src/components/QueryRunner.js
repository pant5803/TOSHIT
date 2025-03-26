import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaSave, FaDownload, FaChartLine, FaCog, FaClock } from 'react-icons/fa';
import Chart from 'chart.js/auto';
import { showSuccess, showError, showInfo } from '../utils/toast';

const QueryRunner = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [timeTaken, setTimeTaken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [queryHistory, setQueryHistory] = useState([]);

  const runQuery = () => {
    if (!query.trim()) {
      showError('Please enter a query before running');
      return;
    }
    
    setIsLoading(true);
    
    // Record start time for performance measurement
    const startTime = performance.now();
    
    // Mock API call to run SQL query
    setTimeout(() => {
      try {
        // This is where you'd send the query to your backend
        const mockResults = generateMockResults(query);
        
        // Record end time and calculate time taken
        const endTime = performance.now();
        const timeTaken = (endTime - startTime).toFixed(2);
        
        setTimeTaken(timeTaken);
        setResults(mockResults);
        setQueryHistory(prev => [
          {
            id: Date.now(),
            query,
            timestamp: new Date().toLocaleString(),
            duration: timeTaken
          },
          ...prev
        ].slice(0, 50)); // Keep only the most recent 50 queries
        
        showSuccess(`Query executed successfully in ${timeTaken}ms`);
      } catch (error) {
        console.error('Error executing query:', error);
        showError(`Error executing query: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  const saveQuery = () => {
    if (!query.trim()) {
      showError('Cannot save an empty query');
      return;
    }
    
    if (!isLoggedIn) {
      showError('Please log in to save queries');
      return;
    }
    
    // Get existing saved queries from localStorage
    const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
    
    // Create a new saved query object
    const newSavedQuery = {
      id: Date.now(),
      name: `Query ${savedQueries.length + 1}`,
      query,
      timestamp: new Date().toLocaleString()
    };
    
    // Add to saved queries
    localStorage.setItem('savedQueries', JSON.stringify([...savedQueries, newSavedQuery]));
    
    // Update tab name if needed
    if (onUpdateTabName) {
      onUpdateTabName(newSavedQuery.name);
    }
    
    showSuccess('Query saved successfully');
  };

  const loadQuery = (savedQuery) => {
    setQuery(savedQuery.query);
    showInfo(`Loaded query: ${savedQuery.name}`);
  };
  
  const exportResults = (format) => {
    if (!results || !results.data || results.data.length === 0) {
      showError('No results to export');
      return;
    }
    
    try {
      let content = '';
      const headers = Object.keys(results.data[0]);
      
      if (format === 'csv') {
        // Create CSV header
        content = headers.join(',') + '\n';
        
        // Add data rows
        results.data.forEach(row => {
          content += headers.map(header => {
            const value = row[header];
            // Handle values with commas by enclosing in quotes
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"`
              : value;
          }).join(',') + '\n';
        });
        
        downloadFile(content, 'query-results.csv', 'text/csv');
        showSuccess('Results exported as CSV');
      } else if (format === 'json') {
        content = JSON.stringify(results.data, null, 2);
        downloadFile(content, 'query-results.json', 'application/json');
        showSuccess('Results exported as JSON');
      }
    } catch (error) {
      console.error('Error exporting results:', error);
      showError(`Export failed: ${error.message}`);
    }
  };
  
  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default QueryRunner; 