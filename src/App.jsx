import React from 'react';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';

function App() {
    const [page, setPage] = React.useState('dashboard');

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
            <nav style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
                <button onClick={() => setPage('dashboard')}
                        style={navBtnStyle(page === 'dashboard')}>
                    算法服务
                </button>
                <button onClick={() => setPage('report')}
                        style={navBtnStyle(page === 'report')}>
                    调用报表
                </button>
            </nav>

            {page === 'dashboard' ? <DashboardPage /> : <ReportPage />}
        </div>
    );
}

function navBtnStyle(active) {
    return {
        padding: '8px 20px',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 'bold',
        background: active ? '#1677ff' : '#e8e8e8',
        color: active ? '#fff' : '#333',
    };
}

export default App;