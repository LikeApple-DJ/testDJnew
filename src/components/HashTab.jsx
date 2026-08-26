import React, { useState } from 'react';
import { computeHash } from '../services/api';
import ExportButton from './ExportButton';

const ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256'];

export default function HashTab() {
    const [input, setInput] = useState('Hello World');
    const [algorithm, setAlgorithm] = useState('SHA-256');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCompute = async () => {
        setLoading(true);
        try {
            const data = await computeHash(input, algorithm);
            setResult(data);
        } catch (e) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>输入文本</label>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                       style={inputStyle} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>算法</label>
                <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}
                        style={inputStyle}>
                    {ALGORITHMS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>
            <button onClick={handleCompute} disabled={loading} style={btnStyle}>
                {loading ? '计算中...' : '计算哈希'}
            </button>
            <ExportButton tab="hash" />
            {result && (
                <pre style={preStyle}>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    );
}

const btnStyle = {
    padding: '8px 16px', marginRight: 12, cursor: 'pointer',
    background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6,
};
const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9',
    borderRadius: 6, fontSize: 14,
};
const preStyle = {
    marginTop: 16, padding: 16, background: '#f5f5f5',
    borderRadius: 8, overflow: 'auto',
};