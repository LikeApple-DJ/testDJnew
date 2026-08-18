import { Tabs } from 'antd';
import HelloWorldTab from './HelloWorldTab';
import HashTab from './HashTab';
import BubbleSortTab from './BubbleSortTab';
import type { TabKey, HelloWorldData, HashData, BubbleSortData } from '../types';

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onResult: (tab: TabKey, data: HelloWorldData | HashData | BubbleSortData) => void;
}

export default function AlgorithmTabs({ activeTab, onTabChange, onResult }: Props) {
  const items = [
    {
      key: 'helloworld',
      label: 'HelloWorld',
      children: <HelloWorldTab onResult={(d) => onResult('helloworld', d)} />,
    },
    {
      key: 'hash',
      label: '哈希算法',
      children: <HashTab onResult={(d) => onResult('hash', d)} />,
    },
    {
      key: 'bubblesort',
      label: '冒泡排序',
      children: <BubbleSortTab onResult={(d) => onResult('bubblesort', d)} />,
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={(k) => onTabChange(k as TabKey)}
      items={items}
      size="large"
    />
  );
}