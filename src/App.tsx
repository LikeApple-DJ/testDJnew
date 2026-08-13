import { Routes, Route } from 'react-router-dom';
import DemoPage from './pages/DemoPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DemoPage />} />
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  );
}

export default App;
