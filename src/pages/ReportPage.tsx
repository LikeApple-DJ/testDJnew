import { useState, useEffect } from 'react';
import { Layout, Select, Space, Card, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStatistics } from '../services/api';
import type { StatisticsResponse } from '../types';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';

const { Header, Content } = Layout;

const dimensionOptions = [
  { value: 'userType', label: '人员类型' },
  { value: 'userLevel', label: '人员层级' },
  { value: 'userDept', label: '人员部门' },
];

const periodOptions = [
  { value: '7d', label: '最近7天' },
  { value: '30d', label: '最近30天' },
  { value: 'all', label: '全部' },
];

export default function ReportPage() {
  const navigate = useNavigate();
  const [dimension, setDimension] = useState('userDept');
  const [period, setPeriod] = useState('all');
  const [stats, setStats] = useState<StatisticsResponse | null>(null);

  const fetchStats = async () => {
    const data = await getStatistics(dimension, period);
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, [dimension, period]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ color: '#fff', borderColor: '#fff' }}
        >
          返回主页
        </Button>
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          调用统计报表
        </span>
      </Header>
      <Content style={{ padding: 24 }}>
        <Card style={{ marginBottom: 16 }}>
          <Space size="large">
            <span>维度选择:</span>
            <Select
              value={dimension}
              onChange={setDimension}
              options={dimensionOptions}
              style={{ width: 150 }}
            />
            <span>时间范围:</span>
            <Select
              value={period}
              onChange={setPeriod}
              options={periodOptions}
              style={{ width: 150 }}
            />
            <span>总调用次数: <strong>{stats?.total ?? 0}</strong></span>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card>
              <LineChart data={stats} title="调用趋势（折线图）" />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <PieChart data={stats} title="各维度占比（饼图）" />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card>
              <BarChart data={stats} title="各维度调用次数对比（柱状图）" />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
