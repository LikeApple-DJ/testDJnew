import { useEffect, useState } from 'react';
import {
  Card, Col, Row, Statistic, Select, DatePicker, Space, Spin, Table, Typography,
} from 'antd';
import {
  DollarOutlined, TeamOutlined, FundOutlined, WarningOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { getDashboard } from '../api/cost';
import type { DashboardVO } from '../types/cost';
import './Dashboard.css';

const { Title } = Typography;
const { Option } = Select;

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardVO | null>(null);
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'year'>('month');
  const [periodValue, setPeriodValue] = useState(dayjs().format('YYYY-MM'));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDashboard(periodType, periodValue);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [periodType, periodValue]);

  const rolePieOption = data ? {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: data.laborCost.byRole.map((r) => ({
        name: r.role === 'dev' ? '开发' : r.role === 'test' ? '测试' : r.role === 'product' ? '产品' : '运维',
        value: r.cost,
      })),
    }],
  } : {};

  const budgetBarOption = data ? {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['项目成本'] },
    yAxis: { type: 'value' },
    series: [
      { name: '预算', type: 'bar', data: [data.projectCost.totalBudget], itemStyle: { color: '#5470c6' } },
      { name: '实际', type: 'bar', data: [data.projectCost.totalActual], itemStyle: { color: '#91cc75' } },
    ],
  } : {};

  const trendLineOption = data ? {
    tooltip: { trigger: 'axis' },
    legend: { data: ['人力成本', '项目成本'] },
    xAxis: { type: 'category', data: data.trend.map((t) => t.label) },
    yAxis: { type: 'value' },
    series: [
      { name: '人力成本', type: 'line', data: data.trend.map((t) => t.laborCost), smooth: true },
      { name: '项目成本', type: 'line', data: data.trend.map((t) => t.projectCost), smooth: true },
    ],
  } : {};

  const topColumns = [
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    {
      title: '超支金额',
      dataIndex: 'overspend',
      key: 'overspend',
      render: (v: number) => (
        <span style={{ color: v > 0 ? '#ff4d4f' : '#52c41a' }}>
          ¥{v.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={3}>成本统计 Dashboard</Title>
        <Space>
          <Select value={periodType} onChange={setPeriodType} style={{ width: 120 }}>
            <Option value="month">按月</Option>
            <Option value="quarter">按季度</Option>
            <Option value="year">按年</Option>
          </Select>
          {periodType === 'month' && (
            <DatePicker picker="month" value={dayjs(periodValue)} onChange={(d) => d && setPeriodValue(d.format('YYYY-MM'))} />
          )}
          {periodType === 'quarter' && (
            <DatePicker picker="quarter" value={dayjs(periodValue)} onChange={(d) => d && setPeriodValue(d.format('YYYY-[Q]Q'))} />
          )}
          {periodType === 'year' && (
            <DatePicker picker="year" value={dayjs(periodValue)} onChange={(d) => d && setPeriodValue(d.format('YYYY'))} />
          )}
        </Space>
      </div>

      <Spin spinning={loading}>
        {data && (
          <>
            <Row gutter={[16, 16]} className="dashboard-cards">
              <Col xs={24} sm={12} lg={6}>
                <Card><Statistic title="人力总成本" value={data.laborCost.total} prefix={<DollarOutlined />} precision={2} suffix="元" /></Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card><Statistic title="项目总预算" value={data.projectCost.totalBudget} prefix={<FundOutlined />} precision={2} suffix="元" /></Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card><Statistic title="实际消耗" value={data.projectCost.totalActual} prefix={<DollarOutlined />} precision={2} suffix="元" /></Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="预算占比"
                    value={data.projectCost.totalRatio * 100}
                    prefix={<WarningOutlined />}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: data.projectCost.totalRatio > 1 ? '#ff4d4f' : '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <div className="dashboard-charts">
              <Card title="人力成本角色分布" className="dashboard-chart-card">
                <ReactECharts option={rolePieOption} style={{ height: 350 }} />
              </Card>
              <Card title="项目预算 vs 实际" className="dashboard-chart-card">
                <ReactECharts option={budgetBarOption} style={{ height: 350 }} />
              </Card>
              {data.trend.length > 0 && (
                <Card title="成本趋势" className="dashboard-chart-card" style={{ gridColumn: '1 / -1' }}>
                  <ReactECharts option={trendLineOption} style={{ height: 350 }} />
                </Card>
              )}
              <Card title="超支项目 Top 5" className="dashboard-chart-card">
                <Table
                  dataSource={data.topOverspendProjects}
                  columns={topColumns}
                  rowKey="projectName"
                  pagination={false}
                  size="small"
                />
              </Card>
            </div>
          </>
        )}
      </Spin>
    </div>
  );
}

export default Dashboard;