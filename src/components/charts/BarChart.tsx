import ReactECharts from 'echarts-for-react';
import type { StatisticsResponse } from '../../types';

interface Props {
  data: StatisticsResponse | null;
  title: string;
}

export default function BarChart({ data, title }: Props) {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data?.data.map((item) => item.label) ?? [],
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: 'value', name: '调用次数' },
    series: [
      {
        name: '调用次数',
        type: 'bar',
        data: data?.data.map((item) => item.count) ?? [],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#69c0ff' },
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 350 }} />;
}
