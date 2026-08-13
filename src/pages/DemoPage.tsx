import { Tabs, Layout, Space, Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HelloTab from '../components/tabs/HelloTab';
import HashTab from '../components/tabs/HashTab';
import BubbleSortTab from '../components/tabs/BubbleSortTab';
import ExportButton from '../components/ExportButton';

const { Header, Content } = Layout;

export default function DemoPage() {
  const navigate = useNavigate();

  const tabItems = [
    { key: 'hello', label: 'HelloWorld', children: <HelloTab /> },
    { key: 'hash', label: '哈希算法', children: <HashTab /> },
    { key: 'bubble-sort', label: '冒泡排序', children: <BubbleSortTab /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          多接口演示系统
        </span>
        <Space>
          <ExportButton />
          <Button
            icon={<BarChartOutlined />}
            onClick={() => navigate('/report')}
            style={{ color: '#fff', borderColor: '#fff' }}
          >
            查看报表
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>
        <Tabs defaultActiveKey="hello" items={tabItems} size="large" />
      </Content>
    </Layout>
  );
}
