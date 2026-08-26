import React, { useState } from 'react';
import { exportTab } from '../services/api';

export default function ExportButton({ tab }) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportTab(tab);
        } catch (e) {
            alert('导出失败: ' + e.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <button onClick={handleExport} disabled={exporting}
                style={{
                    padding: '8px 16px', cursor: 'pointer',
                    background: '#52c41a', color: '#fff', border: 'none', borderRadius: 6,
                }}>
            {exporting ? '导出中...' : '📥 导出 Excel'}
        </button>
    );
}