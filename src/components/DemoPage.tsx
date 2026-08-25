import { useState } from 'react';
import HelloTab from './HelloTab';
import HashTab from './HashTab';
import BubbleTab from './BubbleTab';
import ReportPanel from './ReportPanel';
import * as client from '../api/client';
import type { TabKey } from '../types';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'hello', label: 'HelloWorld' },
  { key: 'hash', label: '哈希算法' },
  { key: 'bubble', label: '冒泡排序' }
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('hello');

  const handleExport = async (format: string) => {
    const blob = await client.exportData(activeTab, format);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `demo-export.${format === 'excel' ? 'xlsx' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Demo Tools</h1>
      <div>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
        <button onClick={() => handleExport('csv')}>导出 CSV</button>
        <button onClick={() => handleExport('excel')}>导出 Excel</button>
      </div>
      <div style={{ marginTop: 16 }}>
        {activeTab === 'hello' && <HelloTab />}
        {activeTab === 'hash' && <HashTab />}
        {activeTab === 'bubble' && <BubbleTab />}
      </div>
      <ReportPanel />
    </div>
  );
}