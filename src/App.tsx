import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <DashboardPage />
    </ConfigProvider>
  );
}

export default App;