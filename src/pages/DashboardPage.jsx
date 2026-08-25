import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HelloWorldTab from '../components/HelloWorldTab';
import HashTab from '../components/HashTab';
import BubbleSortTab from '../components/BubbleSortTab';
import ExportButton from '../components/ExportButton';
import TrackingDashboard from '../components/TrackingDashboard';

const TABS = [
    { key: 'helloworld', label: 'HelloWorld', component: HelloWorldTab },
    { key: 'hash', label: '哈希', component: HashTab },
    { key: 'bubblesort', label: '排序', component: BubbleSortTab },
];

function DashboardPage() {
    const [activeTab, setActiveTab] = useState('helloworld');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const ActiveComponent = TABS.find(t => t.key === activeTab)?.component;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 24px', borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#fafafa',
            }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>三接口工具 + 埋点报表</span>
                <div>
                    <span style={{ marginRight: '16px' }}>
                        {user?.username} ({user?.personType || '未设置'} / {user?.personDept || '未设置'})
                    </span>
                    <button onClick={handleLogout}
                        style={{ padding: '6px 16px', cursor: 'pointer' }}>
                        退出
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', padding: '0 24px' }}>
                {TABS.map(tab => (
                    <div key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '12px 24px', cursor: 'pointer',
                            borderBottom: activeTab === tab.key ? '2px solid #1976d2' : '2px solid transparent',
                            color: activeTab === tab.key ? '#1976d2' : '#666',
                            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                            marginBottom: '-2px',
                        }}>
                        {tab.label}
                    </div>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <ExportButton type={activeTab} />
                </div>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '0 24px' }}>
                {ActiveComponent && <ActiveComponent />}
            </div>

            {/* Tracking Dashboard */}
            <div style={{ borderTop: '2px solid #e0e0e0', marginTop: '24px' }}>
                <TrackingDashboard />
            </div>
        </div>
    );
}

export default DashboardPage;