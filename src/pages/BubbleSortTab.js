import React, { useState } from 'react';
import { Input, Button, Card, Descriptions, Space, message } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { demoApi, exportApi } from '../services/api';

/**
 * 冒泡排序 Tab - 输入整数数组，展示排序结果
 */
function BubbleSortTab() {
  const [inputStr, setInputStr] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!inputStr.trim()) {
      message.warning('请输入整数数组，如：5,3,8,1,9,2');
      return;
    }
    const numbers = inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (numbers.length === 0) {
      message.warning('请输入有效的整数，用逗号分隔');
      return;
    }
    setLoading(true);
    try {
      const response = await demoApi.bubbleSort(numbers);
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
      const response = await exportApi.bubbleSort();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bubble_sort_result.csv';
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
          placeholder="请输入整数，逗号分隔，如：5,3,8,1,9,2"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          style={{ width: 350 }}
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
            <Descriptions.Item label="原始数组">
              [{result.original.join(', ')}]
            </Descriptions.Item>
            <Descriptions.Item label="排序结果">
              <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                [{result.sorted.join(', ')}]
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="执行时间">{result.timestamp}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}

export default BubbleSortTab;
