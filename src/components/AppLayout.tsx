import { Layout, Menu } from 'antd';
import { DashboardOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './AppLayout.css';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/cost-report', icon: <BarChartOutlined />, label: '成本报表' },
];

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="app-layout">
      <Sider width={220}>
        <div className="app-logo">成本统计系统</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;