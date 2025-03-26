import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMemory, FaMicrochip, FaClock } from 'react-icons/fa';

const MonitorContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const MonitorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonitorTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const MonitorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ResourceCard = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
`;

const ResourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ResourceTitle = styled.h4`
  margin: 0;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.95rem;
`;

const ResourceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  background-color: ${props => {
    if (props.$memory) return 'rgba(59, 130, 246, 0.1)';
    if (props.$cpu) return 'rgba(16, 185, 129, 0.1)';
    if (props.$time) return 'rgba(245, 158, 11, 0.1)';
    return 'var(--bg-color)';
  }};
  color: ${props => {
    if (props.$memory) return 'var(--primary-color)';
    if (props.$cpu) return 'var(--success-color)';
    if (props.$time) return 'rgb(245, 158, 11)';
    return 'var(--text-color)';
  }};
`;

const ProgressContainer = styled.div`
  height: 8px;
  background-color: var(--bg-color);
  border-radius: 9999px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background-color: ${props => {
    if (props.value > 80) return 'var(--danger-color)';
    if (props.value > 60) return 'rgb(245, 158, 11)';
    return 'var(--success-color)';
  }};
  transition: width 0.3s ease-in-out;
`;

const ResourceValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const Value = styled.span`
  font-weight: 500;
  color: var(--text-color);
`;

const Label = styled.span`
  color: var(--text-light);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MetricCard = styled.div`
  padding: 0.75rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-light);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  font-style: italic;
`;

const ResourceMonitor = ({ isQueryRunning, queryExecutionTime }) => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [peak, setPeak] = useState({ cpu: 0, memory: 0 });
  const [metrics, setMetrics] = useState({
    rowsProcessed: 0,
    dataScanned: '0 MB',
    tempTableSize: '0 MB',
    sortOperations: 0
  });
  
  // Simulate resource usage when a query is running
  useEffect(() => {
    let interval;
    
    if (isQueryRunning) {
      // Reset metrics when starting a new query
      setElapsedTime(0);
      setCpuUsage(0);
      setMemoryUsage(0);
      setPeak({ cpu: 0, memory: 0 });
      
      // Generate sample metrics for the query
      setMetrics({
        rowsProcessed: Math.floor(Math.random() * 10000) + 500,
        dataScanned: `${(Math.random() * 100).toFixed(2)} MB`,
        tempTableSize: `${(Math.random() * 20).toFixed(2)} MB`,
        sortOperations: Math.floor(Math.random() * 5) + 1
      });
      
      interval = setInterval(() => {
        // Simulate CPU usage with some randomness
        const newCpuUsage = Math.min(85, Math.floor(30 + Math.random() * 40));
        setCpuUsage(newCpuUsage);
        
        // Simulate memory usage with some randomness
        const newMemoryUsage = Math.min(90, Math.floor(25 + Math.random() * 40));
        setMemoryUsage(newMemoryUsage);
        
        // Update elapsed time
        setElapsedTime(prev => prev + 0.1);
        
        // Update peak values
        setPeak(prev => ({
          cpu: Math.max(prev.cpu, newCpuUsage),
          memory: Math.max(prev.memory, newMemoryUsage)
        }));
      }, 100);
    } else {
      // When query stops, gradually decrease resource usage
      interval = setInterval(() => {
        setCpuUsage(prev => {
          const newValue = Math.max(0, prev - 5);
          if (newValue === 0) {
            clearInterval(interval);
          }
          return newValue;
        });
        
        setMemoryUsage(prev => Math.max(0, prev - 2));
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQueryRunning]);
  
  // Use the actual execution time when the query completes
  useEffect(() => {
    if (queryExecutionTime && !isQueryRunning) {
      setElapsedTime(queryExecutionTime / 1000); // Convert ms to seconds
    }
  }, [queryExecutionTime, isQueryRunning]);
  
  return (
    <MonitorContainer>
      <MonitorHeader>
        <MonitorTitle>
          <FaMicrochip /> Resource Monitor
        </MonitorTitle>
        
        {isQueryRunning && (
          <div style={{ color: 'var(--success-color)', fontWeight: '500', fontSize: '0.9rem' }}>
            Query in progress...
          </div>
        )}
      </MonitorHeader>
      
      {(isQueryRunning || queryExecutionTime) ? (
        <>
          <MonitorGrid>
            <ResourceCard>
              <ResourceHeader>
                <ResourceIcon $cpu>
                  <FaMicrochip size={16} />
                </ResourceIcon>
                <ResourceTitle>CPU Usage</ResourceTitle>
              </ResourceHeader>
              <ProgressContainer>
                <ProgressBar value={cpuUsage} />
              </ProgressContainer>
              <ResourceValue>
                <Label>Current:</Label>
                <Value>{cpuUsage}%</Value>
              </ResourceValue>
              <ResourceValue>
                <Label>Peak:</Label>
                <Value>{peak.cpu}%</Value>
              </ResourceValue>
            </ResourceCard>
            
            <ResourceCard>
              <ResourceHeader>
                <ResourceIcon $memory>
                  <FaMemory size={16} />
                </ResourceIcon>
                <ResourceTitle>Memory Usage</ResourceTitle>
              </ResourceHeader>
              <ProgressContainer>
                <ProgressBar value={memoryUsage} />
              </ProgressContainer>
              <ResourceValue>
                <Label>Current:</Label>
                <Value>{memoryUsage}%</Value>
              </ResourceValue>
              <ResourceValue>
                <Label>Peak:</Label>
                <Value>{peak.memory}%</Value>
              </ResourceValue>
            </ResourceCard>
            
            <ResourceCard>
              <ResourceHeader>
                <ResourceIcon $time>
                  <FaClock size={16} />
                </ResourceIcon>
                <ResourceTitle>Execution Time</ResourceTitle>
              </ResourceHeader>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '600', 
                  fontFamily: 'monospace',
                  color: isQueryRunning ? 'var(--primary-color)' : 'var(--text-color)'
                }}>
                  {elapsedTime.toFixed(2)}s
                </div>
              </div>
            </ResourceCard>
          </MonitorGrid>
          
          <MetricsGrid>
            <MetricCard>
              <MetricValue>{metrics.rowsProcessed.toLocaleString()}</MetricValue>
              <MetricLabel>Rows Processed</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>{metrics.dataScanned}</MetricValue>
              <MetricLabel>Data Scanned</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>{metrics.tempTableSize}</MetricValue>
              <MetricLabel>Temp Table Size</MetricLabel>
            </MetricCard>
            
            <MetricCard>
              <MetricValue>{metrics.sortOperations}</MetricValue>
              <MetricLabel>Sort Operations</MetricLabel>
            </MetricCard>
          </MetricsGrid>
        </>
      ) : (
        <EmptyState>
          Run a query to see resource usage metrics
        </EmptyState>
      )}
    </MonitorContainer>
  );
};

export default ResourceMonitor; 