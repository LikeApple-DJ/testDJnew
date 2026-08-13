import { useState } from 'react';
import { Input, Button, Card, Table, Space, Typography } from 'antd';
import { callHello } from '../../services/api';
import type { HelloResponse } from '../../types';

const { Title } = Typography;

interface HistoryRecord {
  key: number;
  input: string;
  output: string;
  time: string;
}

export default function HelloTab() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<HelloResponse | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await callHello({ name });
      setResult(res);
      setHistory((prev) => [
        { key: Date.now(), input: name, output: res.message, time: res.timestamp },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '输入', dataIndex: 'input', key: 'input' },
    { title: '输出', dataIndex: 'output', key: 'output' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="输入">
        <Space>
          <Input
            placeholder="请输入名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={handleExecute} loading={loading}>
            执行
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="执行结果">
          <Title level={4}>{result.message}</Title>
          <p>时间戳: {result.timestamp}</p>
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
