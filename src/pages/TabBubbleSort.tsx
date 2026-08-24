import React, { useState } from 'react';
import { callBubbleSort } from '../services/api';

const TabBubbleSort: React.FC = () => {
  const [inputArr, setInputArr] = useState('5,3,8,1,2');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    if (loading) return;
    setLoading(true);
    setResult('');
    try {
      const arr = inputArr.split(',').map((s) => parseInt(s.trim(), 10));
      const data = await callBubbleSort(arr);
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
      <h2>冒泡排序接口</h2>
      <p>输入数字数组（逗号分隔），返回排序结果。</p>
      <div>
        <input
          type="text"
          value={inputArr}
          onChange={(e) => setInputArr(e.target.value)}
          placeholder="例如: 5,3,8,1,2"
        />
        <button onClick={handleCall} disabled={loading}>
          {loading ? '排序中...' : '排序'}
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

export default TabBubbleSort;