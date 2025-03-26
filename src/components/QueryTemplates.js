import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBook, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { showSuccess, showInfo } from '../utils/toast';

const TemplatesContainer = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const TemplatesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TemplatesTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  
  .search-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: var(--text-light);
  }
  
  input {
    width: 100%;
    padding: 0.5rem 0.5rem 0.5rem 2rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--bg-secondary);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const TemplatesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TemplateCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  background-color: var(--bg-secondary);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
    border-color: var(--primary-color);
  }
`;

const TemplateTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-weight: 500;
`;

const TemplateDescription = styled.p`
  margin: 0 0 0.75rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const TemplatePreview = styled.pre`
  background-color: var(--bg-color);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-family: monospace;
  font-size: 0.8rem;
  overflow-x: auto;
  color: var(--text-color);
  max-height: 100px;
  white-space: pre-wrap;
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CategoryTab = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--border-color)'};
  }
`;

// Sample template data
const TEMPLATES = [
  {
    id: 1,
    category: "basic",
    name: "Simple Select",
    description: "Basic SELECT query to retrieve all columns from a table",
    query: "SELECT * FROM table_name;"
  },
  {
    id: 2,
    category: "basic",
    name: "Select with WHERE",
    description: "SELECT query with a basic WHERE clause",
    query: "SELECT column1, column2\nFROM table_name\nWHERE condition;"
  },
  {
    id: 3,
    category: "basic",
    name: "Select with ORDER BY",
    description: "Query to retrieve sorted data",
    query: "SELECT column1, column2\nFROM table_name\nORDER BY column1 [ASC|DESC];"
  },
  {
    id: 4,
    category: "basic",
    name: "Select with LIMIT",
    description: "Query to retrieve a limited number of rows",
    query: "SELECT column1, column2\nFROM table_name\nLIMIT 10;"
  },
  {
    id: 5,
    category: "joins",
    name: "INNER JOIN",
    description: "Join two tables based on a common field",
    query: "SELECT t1.column1, t2.column2\nFROM table1 t1\nINNER JOIN table2 t2 ON t1.id = t2.id;"
  },
  {
    id: 6,
    category: "joins",
    name: "LEFT JOIN",
    description: "Return all rows from the left table and matching rows from the right table",
    query: "SELECT t1.column1, t2.column2\nFROM table1 t1\nLEFT JOIN table2 t2 ON t1.id = t2.id;"
  },
  {
    id: 7,
    category: "aggregation",
    name: "Simple Aggregation",
    description: "Basic aggregation functions with GROUP BY",
    query: "SELECT column1, COUNT(*), AVG(column2), SUM(column3)\nFROM table_name\nGROUP BY column1;"
  },
  {
    id: 8,
    category: "aggregation",
    name: "Having Clause",
    description: "Filtered aggregation using HAVING",
    query: "SELECT column1, COUNT(*)\nFROM table_name\nGROUP BY column1\nHAVING COUNT(*) > 1;"
  },
  {
    id: 9,
    category: "subqueries",
    name: "Subquery in WHERE",
    description: "Using a subquery in a WHERE clause",
    query: "SELECT column1, column2\nFROM table1\nWHERE column1 IN (SELECT column1 FROM table2 WHERE condition);"
  },
  {
    id: 10,
    category: "subqueries",
    name: "Subquery with EXISTS",
    description: "Using EXISTS with a subquery",
    query: "SELECT column1\nFROM table1 t1\nWHERE EXISTS (SELECT 1 FROM table2 t2 WHERE t2.id = t1.id);"
  }
];

const CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "basic", name: "Basic Queries" },
  { id: "joins", name: "Joins" },
  { id: "aggregation", name: "Aggregation" },
  { id: "subqueries", name: "Subqueries" }
];

const QueryTemplates = ({ onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  const handleSelectTemplate = (template) => {
    onSelectTemplate(template.query);
    showInfo(`Template "${template.name}" loaded`);
  };
  
  // Filter templates based on search term and active category
  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.query.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <TemplatesContainer>
      <TemplatesHeader>
        <TemplatesTitle>
          <FaBook /> Query Templates
        </TemplatesTitle>
        
        <SearchInput>
          <FaSearch className="search-icon" size={14} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchInput>
      </TemplatesHeader>
      
      <CategoryTabs>
        {CATEGORIES.map(category => (
          <CategoryTab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </CategoryTab>
        ))}
      </CategoryTabs>
      
      <TemplatesList>
        {filteredTemplates.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0', color: 'var(--text-light)' }}>
            No templates found matching your criteria
          </div>
        ) : (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
            >
              <TemplateTitle>{template.name}</TemplateTitle>
              <TemplateDescription>{template.description}</TemplateDescription>
              <TemplatePreview>{template.query}</TemplatePreview>
            </TemplateCard>
          ))
        )}
      </TemplatesList>
    </TemplatesContainer>
  );
};

export default QueryTemplates; 