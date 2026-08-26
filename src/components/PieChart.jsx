import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function PieChart({ data = [] }) {
    const option = {
        title: { text: '调用占比（饼图）', left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: data.map(d => ({ name: d.key, value: d.count })),
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' },
            },
            label: { formatter: '{b}: {d}%' },
        }],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}