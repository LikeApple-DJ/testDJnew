import { useState } from 'react';
import { callBubbleSort } from '../services/api';

export default function SortTab() {
  const [arrayInput, setArrayInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const arr = arrayInput
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      const res = await callBubbleSort(arr);
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <h2>Bubble Sort</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter numbers, e.g. 3,1,4,1,5"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Sort'}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {result.error ? (
            <p className="error">Error: {result.error}</p>
          ) : (
            <>
              <p><strong>Original:</strong> [{result.original?.join(', ')}]</p>
              <p><strong>Sorted:</strong> [{result.sorted?.join(', ')}]</p>
              <p><strong>Length:</strong> {result.length}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}