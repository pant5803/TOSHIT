# SQL Query Runner

A modern, SQL query runner application with real-time collaboration, performance monitoring, and advanced query management capabilities.

## Features

- **Query Management**
  - Multi-tab interface
  - Query templates
  - SQL snippets
  - Query versioning
  - SQL-formatting

- **Results Management**
  - Result caching
  - Export capabilities

- **Performance & Optimization**
  - Query execution time tracking
  - Resource usage monitoring
  - Query explain plan visualization
  - Performance optimization tips
  - Query scheduling

- **Collaboration**
  - Real-time collaboration
  - Share queries
  - Active collaborator indicators
  - Query permissions

- **User Experience**
  - Dark/Light theme
  - Responsive design
  - Toast notifications
  - Keyboard shortcuts
  - Accessibility features

## Tech Stack

- React
- Styled Components
- React Icons
- React Toastify
- Local Storage for data persistence

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/pant5803/TOSHIT.git
```

2. Install dependencies:
```bash
cd sql-query-runner
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

This project is deployed on Vercel.

## Project Overview

The SQL Query Runner is a modern, feature-rich web application designed to facilitate efficient SQL query management. It offers real-time collaboration, performance monitoring, and advanced query management capabilities, making it an ideal tool for developers and database administrators.

## JavaScript Framework and Major Plugins

This project is built using the React JavaScript framework, which provides a robust and flexible foundation for building interactive user interfaces. Major plugins and packages used in this project include:

- **Styled Components**: For CSS-in-JS styling, allowing for dynamic styling based on component props.
- **React Icons**: To provide a wide range of icons for enhancing the user interface.
- **React Toastify**: For displaying toast notifications, improving user feedback and interaction.
- **Local Storage**: Used for data persistence, ensuring that user data and settings are retained across sessions.

## Page Load Time

The page load time of the application is approximately 1.5 seconds. This was measured using the Google Chrome DevTools, which provides detailed insights into the loading performance of web applications. The load time may vary based on network conditions and device performance.

## Performance Optimizations

Several optimizations were implemented to decrease load time and increase performance:


- **Efficient State Management**: Utilized React Hooks and Context API to manage state efficiently, minimizing unnecessary re-renders.
- **Optimized Rendering**: Used React.memo to prevent re-rendering of components when props have not changed.
- **Debounced Input Handling**: Implemented debouncing for input fields to reduce the frequency of state updates and improve performance.
- **Resource Monitoring**: Integrated a resource monitor to track CPU and memory usage, helping identify and address performance bottlenecks.

These optimizations ensure that the application runs smoothly and efficiently, providing a seamless user experience.


