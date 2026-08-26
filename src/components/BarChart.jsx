import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function BarChart({ data = [] }) {
    const option = {
        title: { text: '调用次数分布（柱状图）', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: data.map(d => d.key),
            axisLabel: { rotate: 30 },
        },
        yAxis: { type: 'value', name: '调用次数' },
        series: [{
            type: 'bar',
            data: data.map(d => d.count),
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#1677ff' },
                        { offset: 1, color: '#69b1ff' },
                    ],
                },
                borderRadius: [6, 6, 0, 0],
            },
        }],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}