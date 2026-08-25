import React, { useState } from 'react';
import TabHelloworld from './TabHelloworld';
import TabHash from './TabHash';
import TabBubbleSort from './TabBubbleSort';
import ReportPage from './ReportPage';
import { callExport } from '../services/api';

const TABS = ['helloworld', 'hash', 'bubblesort', '报表'] as const;
type TabKey = (typeof TABS)[number];

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('helloworld');

  const handleExport = async () => {
    if (activeTab === '报表') {
      alert('报表页暂不支持导出');
      return;
    }
    try {
      await callExport(activeTab);
    } catch (err: any) {
      alert(`导出失败: ${err.message}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'helloworld': return <TabHelloworld />;
      case 'hash': return <TabHash />;
      case 'bubblesort': return <TabBubbleSort />;
      case '报表': return <ReportPage />;
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-buttons">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'helloworld' ? 'Helloworld' :
             tab === 'hash' ? '哈希算法' :
             tab === 'bubblesort' ? '冒泡排序' : '📊 报表'}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button onClick={handleExport}>📥 导出当前页数据</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HomePage;