import { useState } from 'react';
import HelloTab from '../components/HelloTab';
import HashTab from '../components/HashTab';
import SortTab from '../components/SortTab';
import ExportButton from '../components/ExportButton';

const TABS = [
  { key: 'hello', label: 'Hello World', component: HelloTab },
  { key: 'hash', label: 'SHA-256 Hash', component: HashTab },
  { key: 'sort', label: 'Bubble Sort', component: SortTab },
];

export default function Dashboard() {
  const [activeKey, setActiveKey] = useState('hello');

  const ActiveComponent = TABS.find((t) => t.key === activeKey).component;

  return (
    <div className="dashboard">
      <h1>testDJ Dashboard</h1>
      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeKey === tab.key ? 'active' : ''}`}
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <div className="export-wrapper">
          <ExportButton activeTab={activeKey} />
        </div>
      </div>
      <div className="tab-panel">
        <ActiveComponent />
      </div>
    </div>
  );
}