import React from 'react';
import styled from 'styled-components';
import { FaMagic } from 'react-icons/fa';
import { showSuccess } from '../utils/toast';

const FormatterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
`;

// Simple SQL formatter function
const formatSQL = (sql) => {
  if (!sql) return '';
  
  // Uppercase SQL keywords
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'HAVING', 'GROUP BY', 'ORDER BY', 'LIMIT',
    'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN',
    'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'TRUNCATE TABLE',
    'BEGIN', 'COMMIT', 'ROLLBACK', 'WITH'
  ];
  
  // Function to replace keywords with uppercase version
  // but only if they are standalone words
  const uppercaseKeywords = (sql) => {
    let result = sql;
    
    keywords.forEach(keyword => {
      // Split keyword into parts
      const parts = keyword.split(' ');
      
      if (parts.length === 1) {
        // Simple word replacement with word boundary check
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        result = result.replace(regex, keyword.toUpperCase());
      } else {
        // Multi-word phrase replacement
        const regex = new RegExp(parts.map(p => `\\b${p}\\b`).join('\\s+'), 'gi');
        result = result.replace(regex, keyword.toUpperCase());
      }
    });
    
    return result;
  };
  
  // Step 1: Trim whitespace
  let formatted = sql.trim();
  
  // Step 2: Uppercase keywords
  formatted = uppercaseKeywords(formatted);
  
  // Step 3: Add newlines after specific keywords and parentheses
  formatted = formatted
    .replace(/\s*,\s*/g, ', ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT)\b/gi, '\n$1')
    .replace(/\b(LEFT|RIGHT|INNER|OUTER|FULL)?\s*JOIN\b/gi, '\n$&')
    .replace(/\bON\b/gi, '\n  ON')
    .replace(/\bAND\b/gi, '\n  AND')
    .replace(/\bOR\b/gi, '\n  OR')
    .replace(/\bWHEN\b/gi, '\n  WHEN')
    .replace(/\bELSE\b/gi, '\n  ELSE')
    .replace(/\bCASE\b/gi, '\nCASE')
    .replace(/\bEND\b/gi, '\nEND');
  
  // Step 4: Indent lines after specific keywords
  const lines = formatted.split('\n');
  let indentLevel = 0;
  
  formatted = lines.map((line, i) => {
    const trimmedLine = line.trim();
    
    // Decrease indent for END
    if (/^END\b/i.test(trimmedLine)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add appropriate indentation
    const indentedLine = '  '.repeat(indentLevel) + trimmedLine;
    
    // Increase indent for CASE
    if (/^CASE\b/i.test(trimmedLine)) {
      indentLevel++;
    }
    
    return indentedLine;
  }).join('\n');
  
  return formatted;
};

const SqlFormatter = ({ queryText, onApplyFormatting }) => {
  const handleFormat = () => {
    if (!queryText.trim()) return;
    
    const formattedSQL = formatSQL(queryText);
    onApplyFormatting(formattedSQL);
    showSuccess('Query formatted successfully');
  };
  
  return (
    <FormatterButton onClick={handleFormat} title="Format SQL query">
      <FaMagic /> Format SQL
    </FormatterButton>
  );
};

export default SqlFormatter; 