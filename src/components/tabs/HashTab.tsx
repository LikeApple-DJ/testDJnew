import { useState } from 'react';
import { Input, Select, Button, Card, Table, Space, Typography } from 'antd';
import { callHash } from '../../services/api';
import type { HashResponse } from '../../types';

const { Title } = Typography;

interface HistoryRecord {
  key: number;
  input: string;
  algorithm: string;
  hash: string;
  time: string;
}

export default function HashTab() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'MD5' | 'SHA-1' | 'SHA-256'>('SHA-256');
  const [result, setResult] = useState<HashResponse | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await callHash({ input, algorithm });
      setResult(res);
      setHistory((prev) => [
        { key: Date.now(), input, algorithm, hash: res.hash, time: new Date().toISOString() },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '输入', dataIndex: 'input', key: 'input' },
    { title: '算法', dataIndex: 'algorithm', key: 'algorithm' },
    { title: '哈希值', dataIndex: 'hash', key: 'hash', ellipsis: true },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="输入">
        <Space>
          <Input
            placeholder="请输入待哈希文本"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: 300 }}
          />
          <Select value={algorithm} onChange={setAlgorithm} style={{ width: 120 }}>
            <Select.Option value="MD5">MD5</Select.Option>
            <Select.Option value="SHA-1">SHA-1</Select.Option>
            <Select.Option value="SHA-256">SHA-256</Select.Option>
          </Select>
          <Button type="primary" onClick={handleExecute} loading={loading}>
            执行
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="执行结果">
          <p>输入: {result.input}</p>
          <p>算法: {result.algorithm}</p>
          <Title level={5} copyable>{result.hash}</Title>
        </Card>
      )}

      {history.length > 0 && (
        <Card title="历史记录">
          <Table columns={columns} dataSource={history} pagination={{ pageSize: 5 }} />
        </Card>
      )}
    </Space>
  );
}
