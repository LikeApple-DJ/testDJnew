import React, { useState } from 'react';
import { callHash } from '../services/api';

const TabHash: React.FC = () => {
  const [input, setInput] = useState('hello');
  const [result, setResult] = useState('');

  const handleCall = async () => {
    try {
      const data = await callHash(input);
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
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
        <button onClick={handleCall}>计算哈希</button>
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