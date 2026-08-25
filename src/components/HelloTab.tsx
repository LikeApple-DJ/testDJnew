import { useState } from 'react';
import * as client from '../api/client';

export default function HelloTab() {
  const [result, setResult] = useState<string>('');

  const handleClick = async () => {
    const data = await client.hello();
    setResult(data);
  };

  return (
    <div>
      <button onClick={handleClick}>调用 HelloWorld</button>
      <pre>{result}</pre>
    </div>
  );
}