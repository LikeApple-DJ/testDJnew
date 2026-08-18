import { useEffect, useState, useCallback } from 'react';
import {
  Card, Select, DatePicker, Space, Button, Table, Spin, message, Typography, Row, Col, Statistic, Tag,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getDimensions, queryLaborStats, queryProjectStats, exportReport } from '../api/cost';
import type { DimensionVO, LaborCostVO, ProjectCostVO } from '../types/cost';
import './CostReport.css';

const { Title } = Typography;
const { Option } = Select;

const ROLE_LABELS: Record<string, string> = {
  dev: '开发', test: '测试', product: '产品', ops: '运维',
};

function CostReport() {
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState<DimensionVO | null>(null);
  const [laborData, setLaborData] = useState<LaborCostVO | null>(null);
  const [projectData, setProjectData] = useState<ProjectCostVO | null>(null);

  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'year'>('month');
  const [periodValue, setPeriodValue] = useState(dayjs().format('YYYY-MM'));
  const [department, setDepartment] = useState<string | undefined>();
  const [project, setProject] = useState<string | undefined>();
  const [businessLine, setBusinessLine] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();

  const fetchDimensions = async () => {
    try {
      const res = await getDimensions();
      setDimensions(res.data);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchDimensions(); }, []);

  const query = useCallback(async () => {
    setLoading(true);
    try {
      const [laborRes, projectRes] = await Promise.all([
        queryLaborStats({ periodType, periodValue, department, project, businessLine, role }),
        queryProjectStats({ periodType, periodValue, department, project, businessLine }),
      ]);
      setLaborData(laborRes.data);
      setProjectData(projectRes.data);
    } finally {
      setLoading(false);
    }
  }, [periodType, periodValue, department, project, businessLine, role]);

  useEffect(() => { query(); }, [query]);

  const handleExport = async () => {
    try {
      const blob = await exportReport({
        exportType: 'full',
        periodType,
        periodValue,
        department,
        project,
        businessLine,
        role,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `成本统计报表_${periodValue}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch {
      message.error('导出失败');
    }
  };

  const laborColumns = [
    { title: '角色', dataIndex: 'role', key: 'role', render: (v: string) => ROLE_LABELS[v] || v },
    {
      title: '成本金额', dataIndex: 'cost', key: 'cost',
      render: (v: number) => `¥${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    { title: '人数', dataIndex: 'headcount', key: 'headcount' },
    {
      title: '占比', dataIndex: 'ratio', key: 'ratio',
      render: (v: number) => `${(v * 100).toFixed(1)}%`,
    },
  ];

  const projectColumns = [
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    {
      title: '预算', dataIndex: 'budget', key: 'budget',
      render: (v: number) => `¥${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      title: '实际消耗', dataIndex: 'actual', key: 'actual',
      render: (v: number) => `¥${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      title: '预算占比', dataIndex: 'ratio', key: 'ratio',
      render: (v: number) => {
        const pct = (v * 100).toFixed(1);
        return <Tag color={v > 1 ? 'red' : v > 0.8 ? 'orange' : 'green'}>{pct}%</Tag>;
      },
    },
    {
      title: '预计超支', dataIndex: 'overspend', key: 'overspend',
      render: (v: number) => (
        <span style={{ color: v > 0 ? '#ff4d4f' : '#52c41a' }}>
          ¥{v.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div className="cost-report-container">
      <div className="cost-report-header">
        <Title level={3} style={{ margin: 0 }}>成本统计报表</Title>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>导出报表</Button>
      </div>

      <Card className="cost-report-filters">
        <Space wrap>
          <Select value={periodType} onChange={setPeriodType} style={{ width: 100 }}>
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
          <Select
            allowClear placeholder="选择部门" style={{ width: 150 }}
            value={department} onChange={setDepartment}
          >
            {dimensions?.departments.map((d) => <Option key={d} value={d}>{d}</Option>)}
          </Select>
          <Select
            allowClear placeholder="选择项目" style={{ width: 180 }}
            value={project} onChange={setProject}
          >
            {dimensions?.projects.map((p) => <Option key={p} value={p}>{p}</Option>)}
          </Select>
          <Select
            allowClear placeholder="选择业务线" style={{ width: 150 }}
            value={businessLine} onChange={setBusinessLine}
          >
            {dimensions?.businessLines.map((b) => <Option key={b} value={b}>{b}</Option>)}
          </Select>
          <Select
            allowClear placeholder="选择角色" style={{ width: 120 }}
            value={role} onChange={setRole}
          >
            <Option value="dev">开发</Option>
            <Option value="test">测试</Option>
            <Option value="product">产品</Option>
            <Option value="ops">运维</Option>
          </Select>
        </Space>
      </Card>

      <Spin spinning={loading}>
        <div className="cost-report-tables">
          <Card
            title="人力成本统计"
            className="cost-report-table-card"
            extra={
              laborData && (
                <Space>
                  <span>总成本: ¥{laborData.summary.totalLaborCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>人均: ¥{laborData.summary.avgCostPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>总人数: {laborData.summary.headcount}</span>
                </Space>
              )
            }
          >
            <Table
              dataSource={laborData?.breakdown ?? []}
              columns={laborColumns}
              rowKey="role"
              pagination={false}
              size="small"
            />
          </Card>

          <Card
            title="项目成本统计"
            className="cost-report-table-card"
            extra={
              projectData && (
                <Space>
                  <span>总预算: ¥{projectData.summary.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>总消耗: ¥{projectData.summary.totalActual.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>占比: {(projectData.summary.totalRatio * 100).toFixed(1)}%</span>
                </Space>
              )
            }
          >
            <Table
              dataSource={projectData?.items ?? []}
              columns={projectColumns}
              rowKey="projectName"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </div>
      </Spin>
    </div>
  );
}

export default CostReport;