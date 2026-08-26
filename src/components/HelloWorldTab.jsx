import React, { useState, useEffect } from 'react';
import { helloWorld } from '../services/api';
import ExportButton from './ExportButton';

export default function HelloWorldTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await helloWorld();
            setData(result);
        } catch (e) {
            setData({ message: 'Error', timestamp: e.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div style={{ padding: 16 }}>
            <button onClick={fetchData} disabled={loading}
                    style={btnStyle}>
                {loading ? '请求中...' : '调用 HelloWorld'}
            </button>
            <ExportButton tab="helloworld" />
            {data && (
                <pre style={preStyle}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}

const btnStyle = {
    padding: '8px 16px', marginRight: 12, cursor: 'pointer',
    background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6,
};
const preStyle = {
    marginTop: 16, padding: 16, background: '#f5f5f5',
    borderRadius: 8, overflow: 'auto',
};