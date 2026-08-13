import ReactECharts from 'echarts-for-react';
import type { StatisticsResponse } from '../../types';

interface Props {
  data: StatisticsResponse | null;
  title: string;
}

export default function LineChart({ data, title }: Props) {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data?.data.map((item) => item.label) ?? [],
    },
    yAxis: { type: 'value', name: '调用次数' },
    series: [
      {
        name: '调用次数',
        type: 'line',
        data: data?.data.map((item) => item.count) ?? [],
        smooth: true,
        areaStyle: { opacity: 0.3 },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 350 }} />;
}
