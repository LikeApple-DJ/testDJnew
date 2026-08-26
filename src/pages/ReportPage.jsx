import React, { useState, useEffect, useCallback } from 'react';
import { getStats } from '../services/api';
import DimensionSelector from '../components/DimensionSelector';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

export default function ReportPage() {
    const [dimension, setDimension] = useState('type');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getStats(dimension);
            setData(result.data || []);
        } catch (e) {
            console.error('Failed to fetch stats:', e);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [dimension]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>调用情况报表</h2>
            <DimensionSelector value={dimension} onChange={setDimension} />
            {loading ? (
                <p>加载中...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ background: '#fafafa', borderRadius: 8, padding: 16 }}>
                        <LineChart data={data} />
                    </div>
                    <div style={{ background: '#fafafa', borderRadius: 8, padding: 16 }}>
                        <PieChart data={data} />
                    </div>
                    <div style={{ background: '#fafafa', borderRadius: 8, padding: 16 }}>
                        <BarChart data={data} />
                    </div>
                </div>
            )}
        </div>
    );
}