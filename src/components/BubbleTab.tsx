import { useState } from 'react';
import * as client from '../api/client';

export default function BubbleTab() {
  const [input, setInput] = useState('3,1,4,1,5,9');
  const [result, setResult] = useState<string>('');

  const handleClick = async () => {
    const numbers = input.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    const data = await client.bubbleSort(numbers, true, false);
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="逗号分隔数字" />
      <button onClick={handleClick}>冒泡排序</button>
      <pre>{result}</pre>
    </div>
  );
}