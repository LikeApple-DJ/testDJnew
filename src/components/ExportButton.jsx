import React from 'react';
import api from '../api';

function ExportButton({ type }) {
    const handleExport = async () => {
        try {
            const res = await api.get('/api/export', {
                params: { type },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            const disposition = res.headers['content-disposition'];
            const filename = disposition
                ? disposition.split('filename=')[1]?.replace(/"/g, '')
                : `${type || 'all'}_export.xlsx`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('导出失败: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <button onClick={handleExport}
            style={{
                padding: '8px 16px', cursor: 'pointer',
                backgroundColor: '#4caf50', color: 'white',
                border: 'none', borderRadius: '4px', marginLeft: '8px',
            }}>
            导出Excel
        </button>
    );
}

export default ExportButton;