import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #2563eb;
    --primary-light: #3b82f6;
    --primary-dark: #1d4ed8;
    --secondary-color: #16a34a;
    --accent-color: #f59e0b;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --background-primary: #ffffff;
    --background-secondary: #f1f5f9;
    --border-color: #e2e8f0;
    --error-color: #dc2626;
    --success-color: #16a34a;
    --warning-color: #f59e0b;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'Menlo', monospace;
    --border-radius: 4px;
    --header-height: 60px;
    --sidebar-width: 250px;
    --transition: all 0.2s ease-in-out;
  }

  [data-theme='dark'] {
    --primary-color: #3b82f6;
    --primary-light: #60a5fa;
    --primary-dark: #2563eb;
    --secondary-color: #22c55e;
    --accent-color: #fbbf24;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --background-primary: #111827;
    --background-secondary: #1e293b;
    --border-color: #334155;
    --error-color: #ef4444;
    --success-color: #22c55e;
    --warning-color: #fbbf24;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    font-family: var(--font-primary);
    background-color: var(--background-primary);
    color: var(--text-primary);
    transition: var(--transition);
  }

  #root {
    height: 100%;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary);
    line-height: 1.2;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--text-secondary);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-light);
  }

  /* Code editor styling override */
  .CodeMirror {
    font-family: var(--font-mono) !important;
    height: auto !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
    border-radius: var(--border-radius) !important;
  }
  
  .CodeMirror-gutters {
    background-color: var(--background-secondary) !important;
    border-right: 1px solid var(--border-color) !important;
  }
  
  [data-theme='dark'] .CodeMirror {
    background-color: #1a2233 !important;
    color: #e2e8f0 !important;
  }
  
  [data-theme='dark'] .CodeMirror-gutters {
    background-color: #111827 !important;
  }

  .cm-s-material.CodeMirror { background-color: var(--background-secondary); color: var(--text-primary); }
  .cm-s-material .CodeMirror-linenumber { color: var(--text-secondary); }
  .cm-s-material .CodeMirror-cursor { border-left: 1px solid var(--text-primary); }
`; 