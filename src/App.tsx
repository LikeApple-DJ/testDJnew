import React from 'react';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1 className="app-title">API 接口演示平台</h1>
      <ErrorBoundary>
        <HomePage />
      </ErrorBoundary>
    </div>
  );
};

export default App;