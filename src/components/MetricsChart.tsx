import ReactECharts from 'echarts-for-react';
import type { MetricsItem, ChartType } from '../types';

interface Props {
  chartType: ChartType;
  items: MetricsItem[];
  totalCalls: number;
}

export default function MetricsChart({ chartType, items, totalCalls }: Props) {
  const labels = items.map((i) => i.label);
  const values = items.map((i) => i.count);

  const getOption = () => {
    const base: Record<string, unknown> = {
      title: {
        text: `总调用次数: ${totalCalls}`,
        left: 'center',
        textStyle: { fontSize: 14 },
      },
      tooltip: { trigger: chartType === 'pie' ? 'item' : 'axis' },
      legend: {
        data: labels,
        bottom: 0,
      },
    };

    switch (chartType) {
      case 'bar':
        return {
          ...base,
          xAxis: { type: 'category', data: labels },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: values, name: '调用次数' }],
        };
      case 'line':
        return {
          ...base,
          xAxis: { type: 'category', data: labels, boundaryGap: false },
          yAxis: { type: 'value' },
          series: [
            {
              type: 'line',
              data: values,
              name: '调用次数',
              smooth: true,
              areaStyle: { opacity: 0.15 },
            },
          ],
        };
      case 'pie':
        return {
          ...base,
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              data: items.map((i) => ({ name: i.label, value: i.count })),
              label: { formatter: '{b}: {c} ({d}%)' },
            },
          ],
        };
      default:
        return base;
    }
  };

  return (
    <ReactECharts
      option={getOption()}
      style={{ height: 400, width: '100%' }}
      notMerge
    />
  );
}