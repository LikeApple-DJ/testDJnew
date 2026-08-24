import React, { useState } from 'react';
import { callHelloworld } from '../services/api';

const TabHelloworld: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const handleCall = async () => {
    try {
      const data = await callHelloworld();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Helloworld 接口</h2>
      <p>调用后端接口，返回问候语。</p>
      <button onClick={handleCall}>调用 Helloworld</button>
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