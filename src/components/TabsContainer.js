import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import QueryTab from './QueryTab';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { showSuccess, showInfo } from '../utils/toast';

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
  overflow-x: auto;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: ${props => props.active ? 'var(--bg-color)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  border: 1px solid var(--border-color);
  border-bottom: ${props => props.active ? '1px solid var(--bg-color)' : '1px solid var(--border-color)'};
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: var(--transition);
  margin-right: 0.25rem;
  margin-bottom: -1px;
  white-space: nowrap;
  min-width: 100px;
  max-width: 200px;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--bg-color)' : 'var(--border-color)'};
  }
`;

const TabName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CloseButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem;
  border-radius: 50%;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
    color: var(--danger-color);
  }
`;

const NewTabButton = styled(TabButton)`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  max-width: 40px;
`;

const TabsContent = styled.div`
  flex: 1;
`;

const TabsContainer = ({ tabs, activeTabId, setActiveTabId, onNewTab, onTabClose, setTabs }) => {
  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
  };

  const handleCloseClick = (e, tabId) => {
    e.stopPropagation(); // Prevent tab selection when clicking the close button
    onTabClose(tabId);
  };

  const addNewTab = () => {
    const newTab = {
      id: uuidv4(),
      name: `Query ${tabs.length + 1}`,
      query: '',
      results: null,
      isEditingName: false
    };
    
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    showSuccess('New query tab created');
  };

  const closeTab = (tabId) => {
    // Check if this is the last tab
    if (tabs.length === 1) {
      // If it's the last tab, create a new empty one first
      const newTab = {
        id: uuidv4(),
        name: 'Query 1',
        query: '',
        results: null,
        isEditingName: false
      };
      
      setTabs([newTab]);
      setActiveTabId(newTab.id);
      showInfo('Created new tab as at least one tab must remain open');
      return;
    }
    
    const tabToClose = tabs.find(tab => tab.id === tabId);
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    
    // If the active tab was closed, activate another tab
    if (activeTabId === tabId) {
      setActiveTabId(updatedTabs[updatedTabs.length - 1].id);
    }
    
    showInfo(`Tab "${tabToClose.name}" closed`);
  };

  const saveTabName = (tabId, newName) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === tabId) {
        return { ...tab, name: newName, isEditingName: false };
      }
      return tab;
    });
    
    setTabs(updatedTabs);
    showSuccess(`Tab renamed to "${newName}"`);
  };

  return (
    <TabsWrapper>
      <TabsHeader>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={tab.id === activeTabId}
            onClick={() => handleTabClick(tab.id)}
          >
            <TabName>{tab.name}</TabName>
            <CloseButton 
              active={tab.id === activeTabId}
              onClick={(e) => handleCloseClick(e, tab.id)}
              title="Close tab"
            >
              <FaTimes size={12} />
            </CloseButton>
          </TabButton>
        ))}
        <NewTabButton onClick={onNewTab} title="Create new query tab">
          <FaPlus />
        </NewTabButton>
      </TabsHeader>
      
      <TabsContent>
        {tabs.filter(tab => tab.id === activeTabId)[0]?.content}
      </TabsContent>
    </TabsWrapper>
  );
};

export default TabsContainer; 