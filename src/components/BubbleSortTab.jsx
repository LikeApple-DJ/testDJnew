import React, { useState } from 'react';
import api from '../api';

function BubbleSortTab() {
    const [input, setInput] = useState('5,3,8,1,2');
    const [result, setResult] = useState(null);

    const handleExecute = async () => {
        const arr = input.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        try {
            const res = await api.post('/api/bubblesort', { array: arr });
            setResult(res.data);
        } catch (err) {
            setResult({ error: '请求失败: ' + (err.response?.data?.message || err.message) });
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <h3>冒泡排序接口</h3>
            <input
                placeholder="输入数组（逗号分隔），如 5,3,8,1,2"
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
                    <div><strong>原始数组：</strong>[{Array.isArray(result.original) ? result.original.join(', ') : ''}]</div>
                    <div><strong>排序结果：</strong>[{Array.isArray(result.sorted) ? result.sorted.join(', ') : ''}]</div>
                </div>
            )}
        </div>
    );
}

export default BubbleSortTab;