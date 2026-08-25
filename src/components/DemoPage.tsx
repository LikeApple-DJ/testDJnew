import { useState } from 'react';
import HelloTab from './HelloTab';
import HashTab from './HashTab';
import BubbleTab from './BubbleTab';
import ReportPanel from './ReportPanel';
import { exportData, type ExportPayload } from '../api/client';
import type { TabKey } from '../types';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'hello', label: 'HelloWorld' },
  { key: 'hash', label: '哈希算法' },
  { key: 'bubble', label: '冒泡排序' }
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('hello');
  const [hashContent, setHashContent] = useState('hello');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-256');
  const [bubbleInput, setBubbleInput] = useState('3,1,4,1,5,9');

  const buildExportPayload = (format: string): ExportPayload => {
    const base = { tab: activeTab, format };
    switch (activeTab) {
      case 'hash':
        return { ...base, content: hashContent, algorithm: hashAlgorithm };
      case 'bubble':
        return { ...base, numbers: bubbleInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) };
      default:
        return base;
    }
  };

  const handleExport = async (format: string) => {
    const blob = await exportData(buildExportPayload(format));
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
        {activeTab === 'hash' && (
          <HashTab
            content={hashContent}
            algorithm={hashAlgorithm}
            onContentChange={setHashContent}
            onAlgorithmChange={setHashAlgorithm}
          />
        )}
        {activeTab === 'bubble' && (
          <BubbleTab input={bubbleInput} onInputChange={setBubbleInput} />
        )}
      </div>
      <ReportPanel />
    </div>
  );
}
