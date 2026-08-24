import React, { useState } from 'react';
import { callBubbleSort } from '../services/api';

const TabBubbleSort: React.FC = () => {
  const [inputArr, setInputArr] = useState('5,3,8,1,2');
  const [result, setResult] = useState('');

  const handleCall = async () => {
    try {
      const arr = inputArr.split(',').map((s) => parseInt(s.trim(), 10));
      const data = await callBubbleSort(arr);
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
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
        <button onClick={handleCall}>排序</button>
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