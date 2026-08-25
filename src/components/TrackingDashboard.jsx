import React, { useState, useEffect, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import api from '../api';

const DIMENSIONS = [
    { value: 'personType', label: '人员类型' },
    { value: 'personLevel', label: '人员层级' },
    { value: 'personDept', label: '人员部门' },
];

function TrackingDashboard() {
    const [dimension, setDimension] = useState('personType');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/tracking/report', { params: { dimension } });
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch tracking data:', err);
        } finally {
            setLoading(false);
        }
    }, [dimension]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const labels = data.map(d => d.label);
    const counts = data.map(d => d.callCount);

    const lineOption = {
        title: { text: '调用趋势（折线图）', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: labels },
        yAxis: { type: 'value', name: '调用次数' },
        series: [{ data: counts, type: 'line', smooth: true, areaStyle: {} }],
    };

    const pieOption = {
        title: { text: '调用占比（饼图）', left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [{
            type: 'pie', radius: ['40%', '70%'],
            data: data.map(d => ({ name: d.label, value: d.callCount })),
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0 } },
        }],
    };

    const barOption = {
        title: { text: '调用对比（柱状图）', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: labels },
        yAxis: { type: 'value', name: '调用次数' },
        series: [{
            data: counts, type: 'bar',
            itemStyle: { color: '#5470c6' },
        }],
    };

    return (
        <div style={{ padding: '16px' }}>
            <h3>埋点调用报表</h3>
            <div style={{ marginBottom: '16px' }}>
                <span>维度切换：</span>
                <select value={dimension} onChange={e => setDimension(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '14px' }}>
                    {DIMENSIONS.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                </select>
                {loading && <span style={{ marginLeft: '12px', color: '#999' }}>加载中...</span>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1 1 400px', minWidth: '350px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '8px' }}>
                    <ReactECharts option={lineOption} style={{ height: '300px' }} />
                </div>
                <div style={{ flex: '1 1 400px', minWidth: '350px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '8px' }}>
                    <ReactECharts option={pieOption} style={{ height: '300px' }} />
                </div>
                <div style={{ flex: '1 1 400px', minWidth: '350px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '8px' }}>
                    <ReactECharts option={barOption} style={{ height: '300px' }} />
                </div>
            </div>
        </div>
    );
}

export default TrackingDashboard;