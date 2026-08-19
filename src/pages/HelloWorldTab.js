import React, { useState } from 'react';
import { Input, Button, Card, Descriptions, Space, message } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { demoApi, exportApi } from '../services/api';

/**
 * HelloWorld Tab - 输入名称，展示问候语结果
 */
function HelloWorldTab() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    try {
      const response = await demoApi.helloWorld(name || 'World');
      if (response.data.code === 'OK') {
        setResult(response.data.data);
      } else {
        message.error(response.data.msg || '执行失败');
      }
    } catch (error) {
      message.error('请求失败：' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportApi.helloWorld();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'helloworld_result.csv';
      link.click();
      URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败：请先执行接口');
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="请输入名称（默认 World）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 300 }}
          onPressEnter={handleExecute}
        />
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          loading={loading}
          onClick={handleExecute}
        >
          执行
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出 CSV
        </Button>
      </Space>
      {result && (
        <Card title="执行结果" size="small">
          <Descriptions column={1}>
            <Descriptions.Item label="问候语">{result.result}</Descriptions.Item>
            <Descriptions.Item label="执行时间">{result.timestamp}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}

export default HelloWorldTab;
