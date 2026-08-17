import { useState } from 'react';
import { callHash } from '../services/api';

export default function HashTab({ onResult }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await callHash(input);
      setResult(res.data);
      if (onResult) onResult(res.data);
    } catch (err) {
      const errData = { error: err.message || 'Request failed' };
      setResult(errData);
      if (onResult) onResult(errData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <h2>SHA-256 Hash</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter text to hash"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Hash'}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {result.error ? (
            <p className="error">Error: {result.error}</p>
          ) : (
            <>
              <p><strong>Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Input:</strong> {result.input}</p>
              <p><strong>Hash:</strong> <span className="hash-value">{result.hash}</span></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}