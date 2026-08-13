import { Button, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportData } from '../services/api';

const menuItems = [
  { key: 'hello', label: '导出 HelloWorld 结果' },
  { key: 'hash', label: '导出哈希算法结果' },
  { key: 'bubble-sort', label: '导出冒泡排序结果' },
];

export default function ExportButton() {
  const handleExport = async ({ key }: { key: string }) => {
    await exportData(key);
  };

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleExport }}>
      <Button icon={<DownloadOutlined />}>导出 ▼</Button>
    </Dropdown>
  );
}
