import React, { useState } from 'react';
import styled from 'styled-components';
import { FaProjectDiagram, FaInfoCircle, FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { showInfo } from '../utils/toast';

const VisualizerContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const VisualizerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const VisualizerTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const AnalyzeButton = styled.button`
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

const ExplainContainer = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid var(--border-color);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const TreeContainer = styled.div`
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  overflow-x: auto;
`;

const TreeNode = styled.div`
  margin-left: ${props => props.level * 20}px;
  padding: 0.5rem;
  border-left: 2px solid ${props => props.$isLeaf ? 'var(--success-color)' : 'var(--primary-color)'};
  margin-bottom: 0.5rem;
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: monospace;
`;

const NodeOperation = styled.span`
  font-weight: 600;
  color: var(--primary-color);
`;

const NodeDetails = styled.div`
  color: var(--text-color);
  font-family: monospace;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const NodeCost = styled.span`
  display: inline-block;
  margin-left: 1rem;
  padding: 0.1rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background-color: ${props => {
    if (props.$high) return 'rgba(239, 68, 68, 0.2)'; 
    if (props.$medium) return 'rgba(245, 158, 11, 0.2)';
    return 'rgba(16, 185, 129, 0.2)';
  }};
  color: ${props => {
    if (props.$high) return 'var(--danger-color)';
    if (props.$medium) return 'rgb(245, 158, 11)';
    return 'var(--success-color)';
  }};
`;

const NodeMetrics = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  color: var(--text-light);
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricLabel = styled.span`
  font-weight: 500;
`;

const MetricValue = styled.span`
  color: var(--text-color);
`;

const NodeChildren = styled.div`
  margin-top: 0.5rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-light)'};
  font-weight: ${props => props.$active ? '500' : 'normal'};
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TabContent = styled.div`
  padding: 1rem;
  background-color: var(--bg-color);
`;

const ExplainTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    background-color: var(--bg-secondary);
    font-weight: 500;
    color: var(--text-color);
  }
  
  tr:nth-child(even) {
    background-color: var(--bg-secondary);
  }
  
  tr:hover {
    background-color: rgba(59, 130, 246, 0.05);
  }
`;

const OptimizationTips = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
`;

const TipItem = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const TipIcon = styled.div`
  color: ${props => {
    if (props.$high) return 'var(--danger-color)';
    if (props.$medium) return 'rgb(245, 158, 11)';
    return 'var(--primary-color)';
  }};
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const TipContent = styled.div`
  flex: 1;
`;

const TipTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-color);
`;

const TipDescription = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.4;
`;

// Sample data for tree view explanation
const SAMPLE_EXPLAIN_DATA = {
  operation: "Nested Loop",
  cost: 32.73,
  rows: 1,
  width: 1064,
  actualTime: 0.025,
  loops: 1,
  details: "Inner Join",
  metrics: {
    "Execution Time": "0.025 ms",
    "Planning Time": "0.138 ms",
    "Memory Usage": "10 kB"
  },
  children: [
    {
      operation: "Index Scan",
      cost: 0.29,
      rows: 1,
      width: 540,
      actualTime: 0.012,
      loops: 1,
      details: "using pkey on users",
      metrics: {
        "Filter": "id = 123",
        "Rows Removed by Filter": 0,
        "Index Condition": "id = 123"
      },
      children: []
    },
    {
      operation: "Index Scan",
      cost: 32.44,
      rows: 10,
      width: 524,
      actualTime: 0.008,
      loops: 1,
      details: "using order_user_id_idx on orders",
      metrics: {
        "Filter": "user_id = 123",
        "Rows Removed by Filter": 0,
        "Index Condition": "user_id = 123"
      },
      children: []
    }
  ]
};

// Sample data for tabular explanation
const SAMPLE_TABULAR_DATA = [
  {
    id: 1,
    operation: "Nested Loop",
    startupCost: 0.00,
    totalCost: 32.73,
    rows: 1,
    width: 1064,
    parentRelationship: ""
  },
  {
    id: 2,
    operation: "Index Scan on users",
    startupCost: 0.00,
    totalCost: 0.29,
    rows: 1,
    width: 540,
    parentRelationship: "Inner"
  },
  {
    id: 3,
    operation: "Index Scan on orders",
    startupCost: 0.00,
    totalCost: 32.44,
    rows: 10,
    width: 524,
    parentRelationship: "Inner"
  }
];

// Sample optimization tips
const SAMPLE_TIPS = [
  {
    id: 1,
    severity: "high",
    title: "Missing Index on orders.product_id",
    description: "Adding an index on orders.product_id could significantly improve query performance when filtering by product."
  },
  {
    id: 2,
    severity: "medium",
    title: "Consider using a CTE instead of subquery",
    description: "The nested subquery could be rewritten as a CTE to improve readability and potentially performance."
  },
  {
    id: 3,
    severity: "low",
    title: "Optimize JOIN order",
    description: "Consider reordering your JOINs to filter the larger tables first, reducing the amount of data processed in subsequent joins."
  }
];

// Tree node component for visualization
const ExplainNode = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const isLeaf = !node.children || node.children.length === 0;
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const getCostIndicator = (cost) => {
    if (cost > 20) return "high";
    if (cost > 5) return "medium";
    return "low";
  };
  
  return (
    <TreeNode level={level} $isLeaf={isLeaf}>
      <NodeHeader onClick={toggleExpanded}>
        {!isLeaf && (
          expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />
        )}
        <NodeOperation>{node.operation}</NodeOperation>
        <NodeDetails>{node.details}</NodeDetails>
        <NodeCost 
          $high={getCostIndicator(node.cost) === "high"}
          $medium={getCostIndicator(node.cost) === "medium"}
        >
          cost: {node.cost.toFixed(2)}
        </NodeCost>
      </NodeHeader>
      
      {expanded && (
        <>
          <NodeMetrics>
            {Object.entries(node.metrics).map(([key, value]) => (
              <MetricItem key={key}>
                <MetricLabel>{key}:</MetricLabel>
                <MetricValue>{value}</MetricValue>
              </MetricItem>
            ))}
          </NodeMetrics>
          
          {!isLeaf && (
            <NodeChildren>
              {node.children.map((child, index) => (
                <ExplainNode key={index} node={child} level={level + 1} />
              ))}
            </NodeChildren>
          )}
        </>
      )}
    </TreeNode>
  );
};

const QueryExplainVisualizer = ({ queryText }) => {
  const [explainData, setExplainData] = useState(null);
  const [activeTab, setActiveTab] = useState("tree");
  const [loading, setLoading] = useState(false);
  
  const handleAnalyzeQuery = () => {
    if (!queryText.trim()) return;
    
    setLoading(true);
    
    // In a real app, this would actually send the query to the backend for analysis
    // Here we simulate the analysis with a timeout and sample data
    setTimeout(() => {
      setExplainData({
        tree: SAMPLE_EXPLAIN_DATA,
        tabular: SAMPLE_TABULAR_DATA,
        tips: SAMPLE_TIPS,
        stats: {
          executionTime: "0.025 ms",
          planningTime: "0.138 ms",
          totalTime: "0.163 ms",
          rowsProcessed: 11
        }
      });
      setLoading(false);
      showInfo("Query analysis complete");
    }, 1000);
  };
  
  return (
    <VisualizerContainer>
      <VisualizerHeader>
        <VisualizerTitle>
          <FaProjectDiagram /> Query Explain Plan
        </VisualizerTitle>
        <AnalyzeButton 
          onClick={handleAnalyzeQuery}
          disabled={!queryText.trim() || loading}
        >
          <FaSearch size={14} /> 
          {loading ? "Analyzing..." : "Analyze Query"}
        </AnalyzeButton>
      </VisualizerHeader>
      
      {explainData ? (
        <>
          <StatsContainer>
            <StatCard>
              <StatValue>{explainData.stats.executionTime}</StatValue>
              <StatLabel>Execution Time</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{explainData.stats.planningTime}</StatValue>
              <StatLabel>Planning Time</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{explainData.stats.totalTime}</StatValue>
              <StatLabel>Total Time</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{explainData.stats.rowsProcessed}</StatValue>
              <StatLabel>Rows Processed</StatLabel>
            </StatCard>
          </StatsContainer>
          
          <ExplainContainer>
            <TabsContainer>
              <Tab 
                $active={activeTab === "tree"} 
                onClick={() => setActiveTab("tree")}
              >
                Visual Plan
              </Tab>
              <Tab 
                $active={activeTab === "table"} 
                onClick={() => setActiveTab("table")}
              >
                Tabular Plan
              </Tab>
              <Tab 
                $active={activeTab === "tips"} 
                onClick={() => setActiveTab("tips")}
              >
                Optimization Tips
              </Tab>
            </TabsContainer>
            
            {activeTab === "tree" && (
              <TreeContainer>
                <ExplainNode node={explainData.tree} />
              </TreeContainer>
            )}
            
            {activeTab === "table" && (
              <TabContent>
                <ExplainTable>
                  <thead>
                    <tr>
                      <th>Operation</th>
                      <th>Startup Cost</th>
                      <th>Total Cost</th>
                      <th>Rows</th>
                      <th>Width</th>
                      <th>Relationship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explainData.tabular.map(row => (
                      <tr key={row.id}>
                        <td>{row.operation}</td>
                        <td>{row.startupCost.toFixed(2)}</td>
                        <td>{row.totalCost.toFixed(2)}</td>
                        <td>{row.rows}</td>
                        <td>{row.width}</td>
                        <td>{row.parentRelationship}</td>
                      </tr>
                    ))}
                  </tbody>
                </ExplainTable>
              </TabContent>
            )}
            
            {activeTab === "tips" && (
              <TabContent>
                <OptimizationTips>
                  {explainData.tips.map(tip => (
                    <TipItem key={tip.id}>
                      <TipIcon 
                        $high={tip.severity === "high"}
                        $medium={tip.severity === "medium"}
                      >
                        <FaInfoCircle size={18} />
                      </TipIcon>
                      <TipContent>
                        <TipTitle>{tip.title}</TipTitle>
                        <TipDescription>{tip.description}</TipDescription>
                      </TipContent>
                    </TipItem>
                  ))}
                </OptimizationTips>
              </TabContent>
            )}
          </ExplainContainer>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
          <p>Click "Analyze Query" to view the execution plan and optimization suggestions</p>
        </div>
      )}
    </VisualizerContainer>
  );
};

export default QueryExplainVisualizer; 