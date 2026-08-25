import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useMetrics } from '../hooks/useMetrics';
import type { ChartType, Dimension } from '../types';

const dimensionLabels: Record<Dimension, string> = {
  userType: '人员类型',
  userLevel: '人员层级',
  userDept: '人员部门'
};

export default function ReportPanel() {
  const [dimension, setDimension] = useState<Dimension>('userType');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('bar');
  const data = useMetrics(dimension);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      title: { text: `按${dimensionLabels[dimension]}统计` },
      tooltip: {},
      xAxis: chartType === 'pie' ? undefined : { type: 'category', data: data.map(d => d.dimension) },
      yAxis: chartType === 'pie' ? undefined : { type: 'value' },
      series: [
        {
          type: chartType,
          data: chartType === 'pie' ? data.map(d => ({ name: d.dimension, value: d.count })) : data.map(d => d.count)
        }
      ]
    };
    chart.setOption(option as any);
    return () => chart.dispose();
  }, [data, chartType, dimension]);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>调用报表</h2>
      <div>
        <label>维度：</label>
        <select value={dimension} onChange={e => setDimension(e.target.value as Dimension)}>
          <option value="userType">人员类型</option>
          <option value="userLevel">人员层级</option>
          <option value="userDept">人员部门</option>
        </select>
        <label style={{ marginLeft: 16 }}>图表：</label>
        <select value={chartType} onChange={e => setChartType(e.target.value as ChartType)}>
          <option value="line">折线图</option>
          <option value="bar">柱状图</option>
          <option value="pie">饼图</option>
        </select>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 400 }} />
    </div>
  );
}