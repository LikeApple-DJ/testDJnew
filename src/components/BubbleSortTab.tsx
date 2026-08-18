import { useState } from 'react';
import { Input, Select, Button, Spin, Alert, Table, Space } from 'antd';
import { fetchBubbleSort } from '../api/client';
import type { BubbleSortData } from '../types';

interface Props {
  onResult: (data: BubbleSortData) => void;
}

export default function BubbleSortTab({ onResult }: Props) {
  const [arrayStr, setArrayStr] = useState('5,3,8,1,2');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BubbleSortData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    const array = arrayStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);
    if (array.some(isNaN)) {
      setError('请输入有效的数字数组，以逗号分隔');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchBubbleSort(array, order);
      if (res.code === 0) {
        setData(res.data);
        onResult(res.data);
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const stepColumns = [
    { title: '轮次', dataIndex: 'round', key: 'round' },
    {
      title: '数组状态',
      dataIndex: 'array',
      key: 'array',
      render: (arr: number[]) => `[${arr.join(', ')}]`,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="数组 (逗号分隔)"
          value={arrayStr}
          onChange={(e) => setArrayStr(e.target.value)}
          style={{ width: 260 }}
        />
        <Select
          value={order}
          onChange={setOrder}
          options={[
            { label: '升序 asc', value: 'asc' },
            { label: '降序 desc', value: 'desc' },
          ]}
          style={{ width: 140 }}
        />
        <Button type="primary" onClick={handleExecute} loading={loading}>
          执行
        </Button>
      </Space>

      {loading && <Spin />}
      {error && <Alert type="error" message={error} />}
      {data && (
        <div>
          <p>
            <strong>原始数组:</strong> [{data.original.join(', ')}]
          </p>
          <p>
            <strong>排序结果:</strong> [{data.sorted.join(', ')}]
          </p>
          <p>
            <strong>比较次数:</strong> {data.comparisons}
          </p>
          <Table
            dataSource={data.steps}
            columns={stepColumns}
            rowKey="round"
            pagination={false}
            size="small"
            style={{ maxWidth: 500 }}
          />
        </div>
      )}
    </div>
  );
}