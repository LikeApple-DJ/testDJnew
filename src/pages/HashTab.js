import React, { useState } from 'react';
import { Input, Button, Card, Descriptions, Space, message } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { demoApi, exportApi } from '../services/api';

/**
 * 哈希算法 Tab - 输入字符串，展示 SHA-256 哈希值
 */
function HashTab() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!input.trim()) {
      message.warning('请输入待哈希的字符串');
      return;
    }
    setLoading(true);
    try {
      const response = await demoApi.hash(input);
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
      const response = await exportApi.hash();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hash_result.csv';
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
          placeholder="请输入待哈希的字符串"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
            <Descriptions.Item label="原始输入">{result.input}</Descriptions.Item>
            <Descriptions.Item label="算法">{result.algorithm}</Descriptions.Item>
            <Descriptions.Item label="哈希值">
              <code style={{ wordBreak: 'break-all' }}>{result.hashValue}</code>
            </Descriptions.Item>
            <Descriptions.Item label="执行时间">{result.timestamp}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}

export default HashTab;
