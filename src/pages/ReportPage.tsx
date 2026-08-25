import React, { useEffect, useState, useCallback } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import { callStats } from '../services/api';

interface StatsData {
  dimension: string;
  series: { name: string; value: number }[];
  timeSeries: { time: string; count: number }[];
}

const ReportPage: React.FC = () => {
  const [dimension, setDimension] = useState('userType');
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await callStats(dimension);
      if (res.code === 0) {
        setStatsData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, [dimension]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 饼图配置（按选中维度展示）
  const pieOption = statsData ? {
    title: { text: `${dimension === 'userType' ? '人员类型' : dimension === 'userLevel' ? '人员层级' : '人员部门'}分布`, left: 'center' },
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: statsData.series.map((s) => ({ name: s.name, value: s.value })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
    }],
  } : {};

  // 柱状图配置（按选中维度展示）
  const barOption = statsData ? {
    title: { text: `${dimension === 'userType' ? '人员类型' : dimension === 'userLevel' ? '人员层级' : '人员部门'}调用次数`, left: 'center' },
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: statsData.series.map((s) => s.name) },
    yAxis: { type: 'value' as const },
    series: [{
      type: 'bar',
      data: statsData.series.map((s) => s.value),
      itemStyle: { color: '#1890ff' },
    }],
  } : {};

  // 折线图配置（时间趋势）
  const lineOption = statsData ? {
    title: { text: '调用时间趋势', left: 'center' },
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: statsData.timeSeries.map((t) => t.time) },
    yAxis: { type: 'value' as const },
    series: [{
      type: 'line',
      data: statsData.timeSeries.map((t) => t.count),
      smooth: true,
      lineStyle: { color: '#52c41a' },
      areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
    }],
  } : {};

  return (
    <div>
      <h2>调用统计报表</h2>
      <div style={{ marginBottom: 20 }}>
        <label>统计维度：</label>
        <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
          <option value="userType">人员类型</option>
          <option value="userLevel">人员层级</option>
          <option value="userDept">人员部门</option>
        </select>
        <button onClick={fetchStats} style={{ marginLeft: 10 }}>刷新数据</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', padding: 10, borderRadius: 4 }}>
          {statsData ? <ReactEChartsCore option={lineOption} style={{ height: 300 }} /> : <p>加载中...</p>}
        </div>
        <div style={{ background: 'white', padding: 10, borderRadius: 4 }}>
          {statsData ? <ReactEChartsCore option={pieOption} style={{ height: 300 }} /> : <p>加载中...</p>}
        </div>
        <div style={{ background: 'white', padding: 10, borderRadius: 4, gridColumn: '1 / 3' }}>
          {statsData ? <ReactEChartsCore option={barOption} style={{ height: 300 }} /> : <p>加载中...</p>}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;