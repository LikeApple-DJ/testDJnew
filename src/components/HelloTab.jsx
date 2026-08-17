import { useState } from 'react';
import { callHello } from '../services/api';

export default function HelloTab({ onResult }) {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await callHello(name);
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
      <h2>Hello World</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>
      {result && (
        <div className="result-box">
          {result.error ? (
            <p className="error">Error: {result.error}</p>
          ) : (
            <>
              <p><strong>Input:</strong> {result.input}</p>
              <p><strong>Message:</strong> {result.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}