import React, { useState } from 'react';
import { Tabs, Layout, Typography } from 'antd';
import HelloWorldTab from './HelloWorldTab';
import HashTab from './HashTab';
import BubbleSortTab from './BubbleSortTab';
import AnalyticsDashboard from './AnalyticsDashboard';

const { Header, Content } = Layout;
const { Title } = Typography;

/**
 * 演示主页面 - 包含三个 Tab 演示区和可视化报表区
 */
function DemoPage() {
  const [activeTab, setActiveTab] = useState('helloworld');

  const tabItems = [
    {
      key: 'helloworld',
      label: 'HelloWorld',
      children: <HelloWorldTab />,
    },
    {
      key: 'hash',
      label: '哈希算法',
      children: <HashTab />,
    },
    {
      key: 'bubble-sort',
      label: '冒泡排序',
      children: <BubbleSortTab />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0' }}>三接口演示与调用分析平台</Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', padding: 24, marginBottom: 24, borderRadius: 8 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </div>
        <AnalyticsDashboard />
      </Content>
    </Layout>
  );
}

export default DemoPage;
