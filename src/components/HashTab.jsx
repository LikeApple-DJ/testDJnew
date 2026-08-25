import React, { useState } from 'react';
import api from '../api';

function HashTab() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const handleExecute = async () => {
        try {
            const res = await api.post('/api/hash', { input });
            setResult(res.data);
        } catch (err) {
            setResult({ error: '请求失败: ' + (err.response?.data?.message || err.message) });
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <h3>SHA-256 哈希接口</h3>
            <input
                placeholder="输入要哈希的字符串"
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ padding: '8px', width: '300px', marginRight: '8px' }}
            />
            <button onClick={handleExecute}
                style={{ padding: '8px 16px', cursor: 'pointer' }}>
                执行
            </button>
            {result && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <div><strong>算法：</strong>{result.algorithm}</div>
                    <div><strong>输入：</strong>{result.input}</div>
                    <div style={{ wordBreak: 'break-all' }}><strong>哈希值：</strong>{result.hash}</div>
                </div>
            )}
        </div>
    );
}

export default HashTab;