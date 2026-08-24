import React, { useState } from 'react';
import { callHash } from '../services/api';

const TabHash: React.FC = () => {
  const [input, setInput] = useState('hello');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    if (loading) return;
    setLoading(true);
    setResult('');
    try {
      const data = await callHash(input);
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      if (err.response) {
        setResult(`服务器错误 (${err.response.status}): ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        setResult(`网络错误: 无法连接到服务器，请检查后端是否启动`);
      } else {
        setResult(`错误: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>哈希算法接口</h2>
      <p>输入字符串，返回 SHA-256 哈希值。</p>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要哈希的字符串"
        />
        <button onClick={handleCall} disabled={loading}>
          {loading ? '计算中...' : '计算哈希'}
        </button>
      </div>
      {result && (
        <div className="result-box">
          <strong>结果：</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TabHash;