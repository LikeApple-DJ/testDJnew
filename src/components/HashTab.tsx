import { useState } from 'react';
import * as client from '../api/client';

export interface HashTabProps {
  content: string;
  algorithm: string;
  onContentChange: (value: string) => void;
  onAlgorithmChange: (value: string) => void;
}

export default function HashTab({
  content,
  algorithm,
  onContentChange,
  onAlgorithmChange,
}: HashTabProps) {
  const [result, setResult] = useState<string>('');

  const handleClick = async () => {
    const data = await client.hash(content, algorithm);
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <input value={content} onChange={e => onContentChange(e.target.value)} placeholder="待哈希内容" />
      <select value={algorithm} onChange={e => onAlgorithmChange(e.target.value)}>
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-384">SHA-384</option>
        <option value="SHA-512">SHA-512</option>
      </select>
      <button onClick={handleClick}>计算哈希</button>
      <pre>{result}</pre>
    </div>
  );
}
