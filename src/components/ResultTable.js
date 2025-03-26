import React, { useState } from 'react';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';
import { FaDownload, FaChevronLeft, FaChevronRight, FaTable, FaClock } from 'react-icons/fa';

const TableContainer = styled.div`
  margin-top: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: var(--transition);
  background-color: var(--background-primary);
`;

const TableHeader = styled.div`
  background-color: var(--background-secondary);
  padding: 0.75rem 1rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
`;

const TableTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResultCount = styled.span`
  font-weight: normal;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
`;

const TableControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--background-primary)'};
  color: ${props => props.primary ? 'white' : 'var(--text-primary)'};
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : 'var(--border-color)'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--background-secondary)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: var(--background-secondary);
  position: sticky;
  top: 0;
`;

const TableHeadCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  white-space: nowrap;
`;

const TableBody = styled.tbody`
  width: 100%;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--background-secondary);
  }
  
  &:hover {
    background-color: ${props => props.clickable ? 'rgba(37, 99, 235, 0.1)' : 'inherit'};
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
`;

const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--background-secondary);
  border-top: 1px solid var(--border-color);
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaginationInfo = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ExportMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const ExportButton = styled(ControlButton)`
  margin-right: 0;
`;

const ExportOptions = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 160px;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const ExportOption = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 14px;
  
  &:hover {
    background-color: var(--background-secondary);
  }
`;

const MetricsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-light);
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    color: var(--primary-color);
  }
  
  &.slow {
    color: var(--warning-color, #f59e0b);
  }
  
  &.very-slow {
    color: var(--danger-color, #ef4444);
  }
`;

// Determine if a query is slow based on execution time
const getPerformanceClass = (executionTime) => {
  if (!executionTime) return '';
  
  // Extract just the number from strings like "123.45 ms"
  const timeMs = parseFloat(executionTime);
  
  if (timeMs > 1000) {
    return 'very-slow';
  } else if (timeMs > 500) {
    return 'slow';
  }
  return '';
};

const ResultTable = ({ results, loading }) => {
  const [page, setPage] = useState(1);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const rowsPerPage = 10;
  
  if (!results || !results.columns || !results.data) {
    return (
      <TableContainer>
        <TableHeader>
          <span>Query Results</span>
        </TableHeader>
        <EmptyState>
          <EmptyStateIcon>📊</EmptyStateIcon>
          <h3>No Results to Display</h3>
          <p>Run a query to see results here</p>
        </EmptyState>
      </TableContainer>
    );
  }

  const totalRows = results.data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const currentPageData = results.data.slice(startIndex, endIndex);

  // Prepare CSV data
  const csvData = [
    results.columns,
    ...results.data
  ];

  // Handle pagination
  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  // Export to Excel (XLSX)
  const exportToExcel = () => {
    // Create a CSV string
    const csvString = [
      results.columns.join(','),
      ...results.data.map(row => row.join(','))
    ].join('\n');
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvString], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and click it to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'query_results.xlsx';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  // Export to JSON
  const exportToJSON = () => {
    // Convert data to JSON format
    const jsonData = results.data.map(row => {
      const obj = {};
      results.columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
    
    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and click it to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'query_results.json';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  // Export to PDF
  const exportToPDF = () => {
    // Since we can't install jspdf and html2canvas, we'll create a printable view
    // that the browser can convert to PDF using the browser's print functionality
    
    // Create a new window with styled content
    const printWindow = window.open('', '_blank');
    
    // Add HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>SQL Query Results</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f2f2f2; padding: 8px; text-align: left; border: 1px solid #ddd; }
            td { padding: 8px; border: 1px solid #ddd; }
            h1 { margin-bottom: 10px; }
            .print-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>SQL Query Results</h1>
          <table>
            <thead>
              <tr>
                ${results.columns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${results.data.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="print-footer">Generated from SQL Query Runner</div>
          <script>
            // Auto print when loaded
            window.onload = function() {
              window.print();
              // Optional: Close the window after printing
              // setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setExportMenuOpen(false);
  };

  // Toggle export menu
  const toggleExportMenu = () => {
    setExportMenuOpen(!exportMenuOpen);
  };

  // Get the performance metrics for the current query
  const { performanceMetrics } = results;

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          Query Results
          <ResultCount>{totalRows} rows</ResultCount>
          
          {/* Display key performance metrics if available */}
          {performanceMetrics && (
            <MetricsInfo>
              <MetricItem className={getPerformanceClass(performanceMetrics.executionTime)}>
                <FaClock size={12} />
                <span>{performanceMetrics.executionTime}</span>
              </MetricItem>
              <MetricItem>
                <FaTable size={12} />
                <span>{performanceMetrics.rowCount} rows</span>
              </MetricItem>
            </MetricsInfo>
          )}
        </TableTitle>
        <TableControls>
          <div className="export-menu">
            <button 
              className="export-button" 
              title="Export Results" 
              onClick={toggleExportMenu}
            >
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Export
            </button>
            <div className={`export-options ${exportMenuOpen ? 'open' : ''}`}>
              <CSVLink 
                data={csvData} 
                filename="query_results.csv"
                className="csv-link"
                onClick={() => setExportMenuOpen(false)}
              >
                <button className="export-option">CSV (.csv)</button>
              </CSVLink>
              <button className="export-option" onClick={exportToExcel}>Excel (.xlsx)</button>
              <button className="export-option" onClick={exportToPDF}>PDF (.pdf)</button>
              <button className="export-option" onClick={exportToJSON}>JSON (.json)</button>
            </div>
          </div>
        </TableControls>
      </TableHeader>
      <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
        <StyledTable>
          <TableHead>
            <tr>
              {results.columns.map((column, index) => (
                <TableHeadCell key={index}>{column}</TableHeadCell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </div>
      {totalPages > 1 && (
        <TableFooter>
          <PaginationInfo>
            Showing {startIndex + 1}-{endIndex} of {totalRows} rows
          </PaginationInfo>
          <Pagination>
            <ControlButton 
              onClick={handlePrevPage} 
              disabled={page === 1}
              title="Previous Page"
            >
              <FaChevronLeft />
            </ControlButton>
            <span>Page {page} of {totalPages}</span>
            <ControlButton 
              onClick={handleNextPage} 
              disabled={page === totalPages}
              title="Next Page"
            >
              <FaChevronRight />
            </ControlButton>
          </Pagination>
        </TableFooter>
      )}
    </TableContainer>
  );
};

export default ResultTable; 