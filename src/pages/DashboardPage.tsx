import { useState, useCallback } from 'react';
import { Typography } from 'antd';
import AlgorithmTabs from '../components/AlgorithmTabs';
import ExportButton from '../components/ExportButton';
import MetricsPanel from '../components/MetricsPanel';
import type { TabKey, HelloWorldData, HashData, BubbleSortData, WeatherResponse } from '../types';
import '../styles/dashboard.css';

const { Title } = Typography;

type TabResult = HelloWorldData | HashData | BubbleSortData | WeatherResponse | null;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('helloworld');
  const [tabResults, setTabResults] = useState<Record<TabKey, TabResult>>({
    helloworld: null,
    hash: null,
    bubblesort: null,
    weather: null,
  });

  const handleResult = useCallback((tab: TabKey, data: TabResult) => {
    setTabResults((prev) => ({ ...prev, [tab]: data }));
  }, []);

  const currentResult = tabResults[activeTab];

  return (
    <div className="dashboard-container">
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        算法演示平台
      </Title>

      <AlgorithmTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResult={handleResult}
      />

      {currentResult && (
        <div className="export-area">
          <ExportButton type={activeTab} data={currentResult} />
        </div>
      )}

      <MetricsPanel />
    </div>
  );
}