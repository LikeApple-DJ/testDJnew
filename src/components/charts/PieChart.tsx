import ReactECharts from 'echarts-for-react';
import type { StatisticsResponse } from '../../types';

interface Props {
  data: StatisticsResponse | null;
  title: string;
}

export default function PieChart({ data, title }: Props) {
  const option = {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        data: data?.data.map((item) => ({ name: item.label, value: item.count })) ?? [],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 350 }} />;
}
