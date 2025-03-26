import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { ThemeContext } from '../context/ThemeContext';

// CodeMirror imports
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/placeholder';

const EditorContainer = styled.div`
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
  overflow: hidden;
  transition: var(--transition);
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const EditorHeader = styled.div`
  background-color: var(--background-secondary);
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EditorControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const QueryEditor = ({ 
  code, 
  onChange, 
  onExecute, 
  placeholder = "Write your SQL query here..." 
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  const handleKeyDown = (editor, event) => {
    // Ctrl+Enter or Cmd+Enter to execute query
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      onExecute();
    }
  };

  const editorOptions = {
    mode: 'text/x-sql',
    theme: isDarkMode ? 'material' : 'neat',
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    placeholder: placeholder,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Ctrl-Enter': onExecute,
      'Cmd-Enter': onExecute
    }
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <span>SQL Query Editor</span>
        <EditorControls>
          <small>Press Ctrl+Enter to run</small>
        </EditorControls>
      </EditorHeader>
      <CodeMirror
        value={code}
        options={editorOptions}
        onBeforeChange={(editor, data, value) => {
          onChange(value);
        }}
        onKeyDown={handleKeyDown}
      />
    </EditorContainer>
  );
};

export default QueryEditor; 