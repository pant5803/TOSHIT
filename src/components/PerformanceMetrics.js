import React, { useState } from 'react';
import styled from 'styled-components';
import { FaClock, FaTable, FaCalendarAlt, FaLightbulb } from 'react-icons/fa';

const MetricsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const MetricIcon = styled.div`
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-light);
`;

const MetricValue = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color);
`;

const TipsButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  cursor: pointer;
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(37, 99, 235, 0.1);
  }
`;

const TipsContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1rem;
  margin-top: 0.5rem;
  z-index: 10;
  display: ${props => props.show ? 'block' : 'none'};
`;

const TipsList = styled.ul`
  margin: 0.5rem 0 0;
  padding-left: 1.5rem;
`;

const TipItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const TipsTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

// Optimization tips based on query metrics
const getOptimizationTips = (metrics) => {
  const tips = [
    "Use specific column names instead of SELECT * to reduce data transfer",
    "Add appropriate indexes for columns used in WHERE, JOIN, and ORDER BY clauses",
    "Use LIMIT to restrict the number of rows returned when you don't need the entire result set",
  ];

  if (metrics.rowCount > 100) {
    tips.push("Consider pagination for large result sets (> 100 rows)");
  }

  const executionTimeMs = parseFloat(metrics.executionTime);
  if (executionTimeMs > 500) {
    tips.push("Consider optimizing queries that take longer than 500ms to execute");
  }

  return tips;
};

const PerformanceMetrics = ({ metrics }) => {
  const [showTips, setShowTips] = useState(false);
  
  if (!metrics) return null;
  
  const { executionTime, rowCount, timestamp } = metrics;
  const optimizationTips = getOptimizationTips(metrics);
  
  return (
    <MetricsContainer>
      <MetricItem>
        <MetricIcon>
          <FaClock />
        </MetricIcon>
        <div>
          <MetricLabel>Execution Time</MetricLabel>
          <MetricValue>{executionTime}</MetricValue>
        </div>
      </MetricItem>
      
      <MetricItem>
        <MetricIcon>
          <FaTable />
        </MetricIcon>
        <div>
          <MetricLabel>Rows Returned</MetricLabel>
          <MetricValue>{rowCount} rows</MetricValue>
        </div>
      </MetricItem>
      
      <MetricItem>
        <MetricIcon>
          <FaCalendarAlt />
        </MetricIcon>
        <div>
          <MetricLabel>Executed At</MetricLabel>
          <MetricValue>{formatDate(timestamp)}</MetricValue>
        </div>
      </MetricItem>
      
      <TipsButton onClick={() => setShowTips(!showTips)}>
        <FaLightbulb />
        {showTips ? 'Hide Tips' : 'Optimization Tips'}
      </TipsButton>
      
      <TipsContainer show={showTips}>
        <TipsTitle>
          <FaLightbulb />
          Query Optimization Tips
        </TipsTitle>
        <TipsList>
          {optimizationTips.map((tip, index) => (
            <TipItem key={index}>{tip}</TipItem>
          ))}
        </TipsList>
      </TipsContainer>
    </MetricsContainer>
  );
};

export default PerformanceMetrics; 