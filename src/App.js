import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import ResultTable from './components/ResultTable';
import AuthContainer from './components/AuthContainer';
import QueryHistory from './components/QueryHistory';
import PerformanceMetrics from './components/PerformanceMetrics';
import QueryTab from './components/QueryTab';
import TabsContainer from './components/TabsContainer';
import CollaborationInvites from './components/CollaborationInvites';
import ThemeCustomizer from './components/ThemeCustomizer';
import { FaPalette } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccess, showError, showInfo } from './utils/toast';
import './App.css';

// Sample data
const sampleQueries = [
  {
    id: 1,
    name: "List All Customers",
    query: "SELECT * FROM Customers",
    description: "Display a list of all customers and their details"
  },
  {
    id: 2,
    name: "Top 10 Most Expensive Products",
    query: "SELECT ProductName, UnitPrice FROM Products ORDER BY UnitPrice DESC LIMIT 10",
    description: "Show the top 10 most expensive products"
  },
  {
    id: 3,
    name: "Orders by Customer",
    query: "SELECT c.CompanyName, COUNT(o.OrderID) as OrderCount \nFROM Customers c \nJOIN Orders o ON c.CustomerID = o.CustomerID \nGROUP BY c.CompanyName \nORDER BY OrderCount DESC",
    description: "Count of orders placed by each customer"
  },
  {
    id: 4,
    name: "Product Sales by Category",
    query: "SELECT c.CategoryName, SUM(od.Quantity * od.UnitPrice) as TotalSales \nFROM Categories c \nJOIN Products p ON c.CategoryID = p.CategoryID \nJOIN OrderDetails od ON p.ProductID = od.ProductID \nGROUP BY c.CategoryName \nORDER BY TotalSales DESC",
    description: "Total sales amount by product category"
  },
  {
    id: 5,
    name: "Employee Sales Performance",
    query: "SELECT e.FirstName, e.LastName, COUNT(o.OrderID) as OrderCount, SUM(od.Quantity * od.UnitPrice) as TotalSales \nFROM Employees e \nJOIN Orders o ON e.EmployeeID = o.EmployeeID \nJOIN OrderDetails od ON o.OrderID = od.OrderID \nGROUP BY e.EmployeeID \nORDER BY TotalSales DESC",
    description: "Sales performance by employee"
  }
];

const queryResults = {
  1: {
    columns: ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "City", "Country"],
    data: [
      ["ALFKI", "Alfreds Futterkiste", "Maria Anders", "Sales Representative", "Berlin", "Germany"],
      ["ANATR", "Ana Trujillo Emparedados y helados", "Ana Trujillo", "Owner", "México D.F.", "Mexico"],
      ["ANTON", "Antonio Moreno Taquería", "Antonio Moreno", "Owner", "México D.F.", "Mexico"],
      ["AROUT", "Around the Horn", "Thomas Hardy", "Sales Representative", "London", "UK"],
      ["BERGS", "Berglunds snabbköp", "Christina Berglund", "Order Administrator", "Luleå", "Sweden"]
    ]
  },
  2: {
    columns: ["ProductName", "UnitPrice"],
    data: [
      ["Côte de Blaye", "$263.50"],
      ["Thüringer Rostbratwurst", "$123.79"],
      ["Mishi Kobe Niku", "$97.00"],
      ["Sir Rodney's Marmalade", "$81.00"],
      ["Carnarvon Tigers", "$62.50"]
    ],
    visualizable: true,
    visualizationType: "bar"
  },
  3: {
    columns: ["CompanyName", "OrderCount"],
    data: [
      ["Ernst Handel", "10"],
      ["QUICK-Stop", "7"],
      ["Save-a-lot Markets", "6"],
      ["Folk och fä HB", "5"],
      ["Bon app'", "4"]
    ],
    visualizable: true,
    visualizationType: "bar"
  },
  4: {
    columns: ["CategoryName", "TotalSales"],
    data: [
      ["Beverages", "$267,868.79"],
      ["Dairy Products", "$234,516.97"],
      ["Confections", "$167,378.55"],
      ["Seafood", "$141,623.41"],
      ["Meat/Poultry", "$114,837.99"],
      ["Produce", "$105,268.51"],
      ["Condiments", "$88,323.11"],
      ["Grains/Cereals", "$68,178.45"]
    ],
    visualizable: true,
    visualizationType: "pie"
  },
  5: {
    columns: ["FirstName", "LastName", "OrderCount", "TotalSales"],
    data: [
      ["Margaret", "Peacock", "40", "$250,187.45"],
      ["Janet", "Leverling", "31", "$213,051.30"],
      ["Andrew", "Fuller", "20", "$177,913.95"],
      ["Nancy", "Davolio", "27", "$157,936.10"],
      ["Robert", "King", "14", "$141,295.99"]
    ],
    visualizable: true,
    visualizationType: "bar"
  }
};

// Simple Bar Chart Component
const BarChart = ({ data, labels, title }) => {
  const maxValue = Math.max(...data);
  const scale = 100 / maxValue;

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="bar-chart">
        {data.map((value, index) => (
          <div key={index} className="bar-group">
            <div className="bar-label">{labels[index]}</div>
            <div className="bar-container">
              <div 
                className="bar" 
                style={{ width: `${value * scale}%` }}
                title={`${labels[index]}: ${value}`}
              >
                <span className="bar-value">{value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Pie Chart Component
const PieChart = ({ data, labels, title }) => {
  // Remove $ and commas from values
  const cleanData = data.map(value => 
    parseFloat(value.replace(/[$,]/g, ''))
  );
  
  // Calculate total for percentages
  const total = cleanData.reduce((acc, val) => acc + val, 0);
  
  // Calculate percentage and cumulative percentage for positioning
  let cumulativePercentage = 0;
  const segments = cleanData.map((value, index) => {
    const percentage = (value / total) * 100;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;
    
    return {
      value,
      percentage,
      startPercentage,
      endPercentage: cumulativePercentage,
      color: getColorForIndex(index),
      label: labels[index]
    };
  });

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="pie-chart-container">
        <div className="pie-chart">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="pie-segment"
              style={{
                '--start': `${segment.startPercentage * 3.6}deg`,
                '--end': `${segment.endPercentage * 3.6}deg`,
                '--bg': segment.color
              }}
              title={`${segment.label}: ${data[index]} (${segment.percentage.toFixed(1)}%)`}
            ></div>
          ))}
        </div>
        <div className="pie-legend">
          {segments.map((segment, index) => (
            <div key={index} className="legend-item">
              <div className="color-box" style={{ backgroundColor: segment.color }}></div>
              <div className="legend-label">{segment.label}: {data[index]} ({segment.percentage.toFixed(1)}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get colors for pie chart
function getColorForIndex(index) {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
  ];
  return colors[index % colors.length];
}

function App() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { currentUser, saveQuery, deleteSavedQuery } = useContext(AuthContext);
  const [selectedQueryId, setSelectedQueryId] = useState(1);
  const [savedQueries, setSavedQueries] = useState([]);
  const [showSavedQueries, setShowSavedQueries] = useState(false);
  const [showQueryHistory, setShowQueryHistory] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [showVisualization, setShowVisualization] = useState(false);

  // Tab state
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [tabCounter, setTabCounter] = useState(1);

  // Add state for theme customizer visibility
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  
  // New state for tracking query execution status
  const [isQueryRunning, setIsQueryRunning] = useState(false);
  const [queryExecutionTimes, setQueryExecutionTimes] = useState({});

  // Initialize with a default tab
  useEffect(() => {
    if (tabs.length === 0) {
      const newTabId = Date.now();
      const newTab = {
        id: newTabId,
        name: `Query 1`,
        queryText: '',
        results: null,
        showSaveForm: false,
        queryName: '',
        queryDescription: ''
      };

      setTabs([newTab]);
      setActiveTabId(newTabId);
      setTabCounter(2); // Set to 2 so the next tab will be Query 2
    }
  }, []);

  // Load user's saved queries if logged in
  useEffect(() => {
    if (currentUser && currentUser.savedQueries) {
      setSavedQueries(currentUser.savedQueries);
    } else {
      // If not logged in, clear the saved queries
      setSavedQueries([]);
    }
  }, [currentUser]);

  const createNewTab = () => {
    const newTabId = Date.now();
    const newTab = {
      id: newTabId,
      name: `Query ${tabCounter}`,
      queryText: '',
      results: null,
      showSaveForm: false,
      queryName: '',
      queryDescription: ''
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTabId);
    setTabCounter(prevCounter => prevCounter + 1);
  };

  const updateTabProperty = (tabId, property, value) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === tabId ? { ...tab, [property]: value } : tab
      )
    );
  };

  const handleTabClose = (tabId) => {
    // Don't close the last tab
    if (tabs.length <= 1) {
      return;
    }

    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If we're closing the active tab, set a new active tab
      if (tabId === activeTabId) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      
      return newTabs;
    });
  };

  const handleTabRename = (tabId, newName) => {
    updateTabProperty(tabId, 'name', newName);
  };

  const getActiveTab = () => {
    return tabs.find(tab => tab.id === activeTabId) || {};
  };

  const setActiveTabProperty = (property, value) => {
    if (activeTabId) {
      updateTabProperty(activeTabId, property, value);
    }
  };
  
  const handleQuerySelect = (e) => {
    const id = parseInt(e.target.value);
    setSelectedQueryId(id);
    
    if (id) {
      // Find the selected query
      const selectedQuery = sampleQueries.find(q => q.id === id);
      
      // Update the active tab's query text
      setActiveTabProperty('queryText', selectedQuery.query);
      
      // Automatically set results
      executeQueryForTab(activeTabId, selectedQuery.query, id);
    } else {
      setActiveTabProperty('queryText', '');
      setActiveTabProperty('results', null);
    }
  };
  
  const executeQueryForTab = (tabId, query, sampleId) => {
    if (!query || !query.trim()) {
      showError('Please enter a query before running');
      return;
    }
    
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    // Set query as running
    setIsQueryRunning(true);
    
    // Start timer for query execution
    const startTime = performance.now();
    
    // In a real app, we would send the query to a backend
    // For this demo, we'll simulate a delay to show the resource monitoring
    setTimeout(() => {
      // For this demo, we'll just use a sample result
      const sampleQuery = sampleQueries.find(q => q.query === query);
      
      let queryResult;
      if (sampleQuery) {
        queryResult = queryResults[sampleQuery.id];
      } else if (sampleId) {
        queryResult = queryResults[sampleId];
      } else {
        // Default result if query not found
        queryResult = queryResults[1];
      }
      
      // End timer and calculate execution time
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Update execution time for this tab
      setQueryExecutionTimes(prev => ({
        ...prev,
        [tabId]: executionTime
      }));
      
      // Add performance metrics to results
      const resultsWithMetrics = {
        ...queryResult,
        performanceMetrics: {
          executionTime: `${executionTime.toFixed(2)} ms`,
          rowCount: queryResult.data.length,
          timestamp: new Date().toISOString()
        }
      };
      
      // Update the tab's results
      updateTabProperty(tabId, 'results', resultsWithMetrics);
      
      // Add to query history with timestamp and metrics
      const newQuery = {
        id: Date.now().toString(),
        query: query,
        timestamp: new Date().toISOString(),
        performanceMetrics: {
          executionTime: `${executionTime.toFixed(2)} ms`,
          rowCount: queryResult.data.length
        }
      };
      
      // Store history in localStorage
      const queryHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
      localStorage.setItem('queryHistory', JSON.stringify([newQuery, ...queryHistory].slice(0, 50))); // Keep last 50 queries
      
      // Set query as no longer running
      setIsQueryRunning(false);
      
      // Show success toast notification
      showSuccess(`Query executed successfully in ${executionTime.toFixed(2)}ms`);
    }, 2000); // Simulate a 2-second delay for query execution
  };

  const executeQuery = () => {
    const tab = getActiveTab();
    executeQueryForTab(activeTabId, tab.queryText);
  };

  const handleQueryFromHistory = (query) => {
    // Clear any selected sample query
    setSelectedQueryId('');
    
    // Update the active tab's query text
    setActiveTabProperty('queryText', query);
    
    // Auto-run the query
    executeQueryForTab(activeTabId, query);
  };

  const handleSaveQueryClick = () => {
    if (!currentUser) {
      // Show login message if user isn't logged in
      setLoginMessage('Please log in to save queries');
      setTimeout(() => setLoginMessage(''), 3000); // Clear message after 3 seconds
      return;
    }
    
    // Toggle the save form visibility for the active tab
    const currentValue = getActiveTab().showSaveForm || false;
    setActiveTabProperty('showSaveForm', !currentValue);
  };

  const saveCurrentQuery = () => {
    const tab = getActiveTab();
    
    if (!tab.queryText || !tab.queryText.trim() || !tab.queryName || !tab.queryName.trim()) {
      showError('Please provide a query name and valid query text');
      return;
    }
    
    if (!currentUser) {
      setLoginMessage('Please log in to save queries');
      setTimeout(() => setLoginMessage(''), 3000);
      showError('Please log in to save queries');
      return;
    }
    
    const newQuery = {
      id: Date.now().toString(),
      name: tab.queryName,
      description: tab.queryDescription,
      query: tab.queryText,
      savedAt: new Date().toISOString()
    };
    
    // Save to user's account
    saveQuery(newQuery);
    
    // Reset form
    setActiveTabProperty('queryName', '');
    setActiveTabProperty('queryDescription', '');
    setActiveTabProperty('showSaveForm', false);
    
    // Show success notification
    showSuccess(`Query "${tab.queryName}" saved successfully`);
  };

  const loadSavedQuery = (query) => {
    setActiveTabProperty('queryText', query.query);
    setShowSavedQueries(false);
    showInfo(`Loaded query: "${query.name}"`);
  };

  const deleteSavedQueryHandler = (queryId) => {
    if (currentUser) {
      // Get the query name before deletion for the notification
      const queryToDelete = savedQueries.find(q => q.id === queryId);
      const queryName = queryToDelete ? queryToDelete.name : 'Query';
      
      // Delete from user's account
      deleteSavedQuery(queryId);
      
      // Show success notification
      showSuccess(`"${queryName}" deleted successfully`);
    }
  };

  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
  };

  // Toggle theme customizer visibility
  const toggleThemeCustomizer = () => {
    setShowThemeCustomizer(!showThemeCustomizer);
  };

  // Create tab content with a QueryTab component
  const renderTabContent = (tab) => {
    return (
      <QueryTab
        key={tab.id}
        tabId={tab.id}
        tabName={tab.name}
        queryText={tab.queryText}
        setQueryText={(text) => updateTabProperty(tab.id, 'queryText', text)}
        results={tab.results}
        executeQuery={() => executeQueryForTab(tab.id, tab.queryText)}
        onTabClose={handleTabClose}
        onTabRename={handleTabRename}
        showSaveForm={tab.showSaveForm}
        setShowSaveForm={(value) => updateTabProperty(tab.id, 'showSaveForm', value)}
        queryName={tab.queryName}
        setQueryName={(name) => updateTabProperty(tab.id, 'queryName', name)}
        queryDescription={tab.queryDescription}
        setQueryDescription={(desc) => updateTabProperty(tab.id, 'queryDescription', desc)}
        saveCurrentQuery={saveCurrentQuery}
        handleSaveQueryClick={handleSaveQueryClick}
        currentUser={currentUser}
        isQueryRunning={isQueryRunning && activeTabId === tab.id}
        queryExecutionTime={queryExecutionTimes[tab.id]}
      />
    );
  };

  // Update tabs with rendered content
  useEffect(() => {
    setTabs(prevTabs => 
      prevTabs.map(tab => ({
        ...tab,
        content: renderTabContent(tab)
      }))
    );
  }, [
    tabs.map(tab => tab.id).join(','), // Rebuild when tab IDs change
    tabs.map(tab => tab.queryText).join(','), // Rebuild when query texts change
    tabs.map(tab => tab.showSaveForm).join(','), // Rebuild when save form visibility changes
    tabs.map(tab => tab.queryName).join(','), // Rebuild when query names change
    tabs.map(tab => tab.queryDescription).join(','), // Rebuild when query descriptions change
    isQueryRunning, // Rebuild when query execution status changes
    JSON.stringify(queryExecutionTimes), // Rebuild when execution times change
    activeTabId, // Rebuild when active tab changes
    currentUser // Rebuild when user changes
  ]);

  // Get the active tab's results
  const activeTabResults = getActiveTab().results;

  return (
    <div className="app">
      {/* ToastContainer for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
      
      <header className="app-header">
        <h1>SQL Query Runner</h1>
        <div className="header-actions">
          {/* Theme Customizer Button */}
          <button 
            className="theme-customize-button" 
            onClick={toggleThemeCustomizer}
            title="Customize Theme"
            aria-label="Customize Theme"
          >
            <FaPalette size={20} />
          </button>
          
          {/* Dark/Light Mode Toggle Button */}
          <button 
            className="theme-toggle-button" 
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M21 12H20M6.31412 6.31412L5.5 5.5M18.5 18.5L17.6859 17.6859M6.31412 17.6859L5.5 18.5M18.5 5.5L17.6859 6.31412M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00008C7 6.02072 8.62867 3.42175 11.0443 2.04492C5.96975 2.52607 2 6.79936 2 12.0001C2 17.5229 6.47715 22.0001 12 22.0001C17.2002 22.0001 21.4733 18.0308 21.9548 12.9564Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        {/* Theme Customizer - Pass isOpen prop */}
        <ThemeCustomizer isOpen={showThemeCustomizer} toggleCustomizer={toggleThemeCustomizer} />
        
        {/* Authentication Container */}
        <AuthContainer />
        
        {/* Collaboration Invites - will only show if user is logged in */}
        <CollaborationInvites currentUser={currentUser} />
        
        <section className="query-section">
          {/* Query History Section */}
          <div className="history-section">
            <div className="section-header">
              <h3>Query History</h3>
              <button 
                className="secondary-button"
                onClick={() => setShowQueryHistory(!showQueryHistory)}
              >
                {showQueryHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
            
            {showQueryHistory && (
              <QueryHistory onSelectQuery={handleQueryFromHistory} />
            )}
          </div>
          
          <div className="query-selector">
            <h3>Example Queries</h3>
            <select 
              value={selectedQueryId || ''} 
              onChange={handleQuerySelect}
            >
              <option value="">-- Select a sample query --</option>
              {sampleQueries.map(query => (
                <option key={query.id} value={query.id}>
                  {query.name}
                </option>
              ))}
            </select>
            {selectedQueryId && (
              <p className="query-description">
                {sampleQueries.find(q => q.id === selectedQueryId)?.description}
              </p>
            )}
          </div>
          
          {/* Only show saved queries section when user is logged in */}
          {currentUser && (
            <div className="saved-queries-section">
              <div className="section-header">
                <h3>Your Saved Queries</h3>
                <button 
                  className="secondary-button"
                  onClick={() => setShowSavedQueries(!showSavedQueries)}
                >
                  {showSavedQueries ? 'Hide' : 'Show'} Saved Queries ({savedQueries.length})
                </button>
              </div>
              
              {showSavedQueries && (
                <div className="saved-queries-list">
                  {savedQueries.length === 0 ? (
                    <p className="no-saved-queries">No saved queries yet. Save a query to see it here.</p>
                  ) : (
                    savedQueries.map(query => (
                      <div key={query.id} className="saved-query-item">
                        <div className="saved-query-info">
                          <h4>{query.name}</h4>
                          <p>{query.description}</p>
                        </div>
                        <div className="saved-query-actions">
                          <button 
                            className="secondary-button small"
                            onClick={() => loadSavedQuery(query)}
                          >
                            Load
                          </button>
                          <button 
                            className="danger-button small"
                            onClick={() => deleteSavedQueryHandler(query.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Tab Container for Multiple Queries */}
          <div className="tabs-container-wrapper">
            <TabsContainer 
              tabs={tabs}
              activeTabId={activeTabId}
              setActiveTabId={setActiveTabId}
              onNewTab={createNewTab}
              onTabClose={handleTabClose}
              setTabs={setTabs}
            />
          </div>
          
          {loginMessage && (
            <div className="login-message">
              {loginMessage}
            </div>
          )}
        </section>
        
        <section className="results-section">
          <div className="section-header">
            <h3>Query Results</h3>
            {activeTabResults && activeTabResults.visualizable && (
              <button 
                className="secondary-button"
                onClick={toggleVisualization}
              >
                {showVisualization ? 'Hide' : 'Show'} Visualization
              </button>
            )}
          </div>
          
          {/* Display performance metrics if available */}
          {activeTabResults && activeTabResults.performanceMetrics && (
            <PerformanceMetrics metrics={activeTabResults.performanceMetrics} />
          )}
          
          {activeTabResults && showVisualization && activeTabResults.visualizable && (
            <div className="visualization-container">
              {activeTabResults.visualizationType === 'bar' && (
                <BarChart 
                  labels={activeTabResults.data.map(row => row[0])}
                  data={activeTabResults.data.map(row => parseFloat(row[1].replace(/[$,]/g, '')))}
                  title={`${activeTabResults.columns[0]} by ${activeTabResults.columns[1]}`}
                />
              )}
              {activeTabResults.visualizationType === 'pie' && (
                <PieChart 
                  labels={activeTabResults.data.map(row => row[0])}
                  data={activeTabResults.data.map(row => row[1])}
                  title={`${activeTabResults.columns[0]} Distribution`}
                />
              )}
            </div>
          )}
          
          {activeTabResults && <ResultTable results={activeTabResults} loading={false} />}
        </section>
      </main>
    </div>
  );
}

export default App; 