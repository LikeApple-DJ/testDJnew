import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportExcel } from '../api/client';

interface Props {
  type: string;
  data: unknown;
}

export default function ExportButton({ type, data }: Props) {
  const handleExport = async () => {
    try {
      const blob = await exportExcel(type, data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${type}-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (e: any) {
      message.error('导出失败: ' + e.message);
    }
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleExport}
    >
      导出 Excel
    </Button>
  );
}