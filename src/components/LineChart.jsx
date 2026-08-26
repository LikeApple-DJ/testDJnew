import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function LineChart({ data = [] }) {
    const option = {
        title: { text: '调用次数趋势（折线图）', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: data.map(d => d.key),
            axisLabel: { rotate: 30 },
        },
        yAxis: { type: 'value', name: '调用次数' },
        series: [{
            type: 'line',
            data: data.map(d => d.count),
            smooth: true,
            itemStyle: { color: '#1677ff' },
            areaStyle: { color: 'rgba(22,119,255,0.1)' },
        }],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}