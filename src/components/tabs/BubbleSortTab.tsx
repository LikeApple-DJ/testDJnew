import { useState } from 'react';
import { Input, Button, Card, Table, Space, Typography, Tag } from 'antd';
import { callBubbleSort } from '../../services/api';
import type { SortResponse } from '../../types';

const { Title } = Typography;

interface HistoryRecord {
  key: number;
  input: string;
  sorted: string;
  steps: number;
  time: string;
}

export default function BubbleSortTab() {
  const [arrayInput, setArrayInput] = useState('');
  const [result, setResult] = useState<SortResponse | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    const arr = arrayInput.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    if (arr.length === 0) return;
    setLoading(true);
    try {
      const res = await callBubbleSort({ array: arr });
      setResult(res);
      setHistory((prev) => [
        {
          key: Date.now(),
          input: arr.join(', '),
          sorted: res.sorted.join(', '),
          steps: res.steps,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '原始数组', dataIndex: 'input', key: 'input' },
    { title: '排序结果', dataIndex: 'sorted', key: 'sorted' },
    { title: '比较次数', dataIndex: 'steps', key: 'steps' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="输入">
        <Space>
          <Input
            placeholder="请输入数组，用逗号分隔，如: 5, 3, 8, 1, 9"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            style={{ width: 400 }}
          />
          <Button type="primary" onClick={handleExecute} loading={loading}>
            执行
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="执行结果">
          <p>原始数组: {result.original.map((n) => <Tag key={n}>{n}</Tag>)}</p>
          <p>排序结果: {result.sorted.map((n) => <Tag key={n} color="green">{n}</Tag>)}</p>
          <Title level={5}>比较次数: {result.steps}</Title>
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
