import { useState } from 'react';
import { exportTab } from '../services/api';

export default function ExportButton({ activeTab, resultData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    if (!activeTab) {
      setMessage('No active tab to export');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await exportTab(activeTab, resultData);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeTab}_result.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setMessage('Export successful!');
    } catch (err) {
      setMessage('Export failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-area">
      <button onClick={handleExport} disabled={loading} className="export-btn">
        {loading ? 'Exporting...' : 'Export PDF'}
      </button>
      {message && <span className="export-msg">{message}</span>}
    </div>
  );
}