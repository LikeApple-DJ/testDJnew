import { useState } from 'react';
import * as client from '../api/client';

export default function HashTab() {
  const [content, setContent] = useState('hello');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [result, setResult] = useState<string>('');

  const handleClick = async () => {
    const data = await client.hash(content, algorithm);
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <input value={content} onChange={e => setContent(e.target.value)} placeholder="待哈希内容" />
      <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
        <option value="MD5">MD5</option>
        <option value="SHA-256">SHA-256</option>
      </select>
      <button onClick={handleClick}>计算哈希</button>
      <pre>{result}</pre>
    </div>
  );
}