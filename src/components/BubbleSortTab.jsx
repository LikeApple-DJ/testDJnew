import React, { useState } from 'react';
import { bubbleSort } from '../services/api';
import ExportButton from './ExportButton';

export default function BubbleSortTab() {
    const [input, setInput] = useState('[3,1,4,1,5]');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSort = async () => {
        setError('');
        let array;
        try {
            array = JSON.parse(input);
            if (!Array.isArray(array) || !array.every(n => typeof n === 'number')) {
                setError('请输入合法的 JSON 整数数组，如 [3,1,4,1,5]');
                return;
            }
        } catch {
            setError('JSON 格式错误，请检查输入');
            return;
        }
        setLoading(true);
        try {
            const data = await bubbleSort(array);
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
                    输入整数数组（JSON 格式）
                </label>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                       style={inputStyle} />
            </div>
            <button onClick={handleSort} disabled={loading} style={btnStyle}>
                {loading ? '排序中...' : '执行冒泡排序'}
            </button>
            <ExportButton tab="bubblesort" />
            {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
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
    borderRadius: 8, overflow: 'auto', maxHeight: 400,
};