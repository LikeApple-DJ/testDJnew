import React, { useState } from 'react';
import { callHelloworld } from '../services/api';

const TabHelloworld: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    if (loading) return;
    setLoading(true);
    setResult('');
    try {
      const data = await callHelloworld();
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
      <h2>Helloworld 接口</h2>
      <p>调用后端接口，返回问候语。</p>
      <button onClick={handleCall} disabled={loading}>
        {loading ? '请求中...' : '调用 Helloworld'}
      </button>
      {result && (
        <div className="result-box">
          <strong>结果：</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TabHelloworld;