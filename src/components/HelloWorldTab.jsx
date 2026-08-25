import React, { useState } from 'react';
import api from '../api';

function HelloWorldTab() {
    const [name, setName] = useState('');
    const [result, setResult] = useState('');

    const handleExecute = async () => {
        try {
            const res = await api.get('/api/helloworld', { params: { name: name || 'World' } });
            setResult(res.data.result);
        } catch (err) {
            setResult('请求失败: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <h3>HelloWorld 接口</h3>
            <input
                placeholder="输入名称（默认 World）"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ padding: '8px', width: '300px', marginRight: '8px' }}
            />
            <button onClick={handleExecute}
                style={{ padding: '8px 16px', cursor: 'pointer' }}>
                执行
            </button>
            {result && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>结果：</strong>{result}
                </div>
            )}
        </div>
    );
}

export default HelloWorldTab;