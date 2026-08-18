import { useState, useEffect, useCallback } from 'react';
import { Typography, Spin, Alert, Space } from 'antd';
import DimensionSelector from './DimensionSelector';
import ChartTypeSelector from './ChartTypeSelector';
import MetricsChart from './MetricsChart';
import { fetchMetrics } from '../api/client';
import type { Dimension, ChartType, MetricsResponse } from '../types';

const { Title } = Typography;

export default function MetricsPanel() {
  const [dimension, setDimension] = useState<Dimension>('personType');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMetrics(dimension);
      if (res.code === 0) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dimension]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="metrics-panel">
      <Title level={3}>调用统计报表</Title>

      <Space style={{ marginBottom: 16 }}>
        <span>维度:</span>
        <DimensionSelector value={dimension} onChange={setDimension} />
        <span style={{ marginLeft: 16 }}>图表:</span>
        <ChartTypeSelector value={chartType} onChange={setChartType} />
      </Space>

      {loading && <Spin />}
      {error && <Alert type="error" message={error} />}
      {data && (
        <MetricsChart
          chartType={chartType}
          items={data.items}
          totalCalls={data.totalCalls}
        />
      )}
    </div>
  );
}