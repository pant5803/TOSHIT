import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = (email, password, username) => {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this should be hashed
      username,
      savedQueries: []
    };
    
    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  };

  // Login user
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Save query for current user
  const saveQuery = (query) => {
    if (!currentUser) {
      throw new Error('You must be logged in to save queries');
    }
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find current user
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Add query to user's savedQueries
    const updatedUser = {
      ...users[userIndex],
      savedQueries: [...users[userIndex].savedQueries, query]
    };
    
    // Update users array
    users[userIndex] = updatedUser;
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  // Delete saved query
  const deleteSavedQuery = (queryId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete queries');
    }
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find current user
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Filter out the query to delete
    const updatedUser = {
      ...users[userIndex],
      savedQueries: users[userIndex].savedQueries.filter(q => q.id !== queryId)
    };
    
    // Update users array
    users[userIndex] = updatedUser;
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  const authValues = {
    currentUser,
    register,
    login,
    logout,
    saveQuery,
    deleteSavedQuery,
    loading
  };

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
}; 