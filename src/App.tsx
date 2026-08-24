import React from 'react';
import HomePage from './pages/HomePage';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1 className="app-title">API 接口演示平台</h1>
      <HomePage />
    </div>
  );
};

export default App;