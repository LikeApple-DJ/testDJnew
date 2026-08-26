import React from 'react';

const DIMENSIONS = [
    { value: 'type', label: '人员类型' },
    { value: 'level', label: '人员层级' },
    { value: 'department', label: '人员部门' },
    { value: 'api', label: '接口' },
];

export default function DimensionSelector({ value, onChange }) {
    return (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 'bold' }}>分析维度：</span>
            <select value={value} onChange={e => onChange(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }}>
                {DIMENSIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
        </div>
    );
}