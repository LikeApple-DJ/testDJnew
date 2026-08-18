import { useState } from 'react';
import { Input, Select, Button, Spin, Alert, Descriptions, Space } from 'antd';
import { fetchHash } from '../api/client';
import type { HashData } from '../types';

interface Props {
  onResult: (data: HashData) => void;
}

export default function HashTab({ onResult }: Props) {
  const [input, setInput] = useState('hello');
  const [algorithm, setAlgorithm] = useState('MD5');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HashData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHash(input, algorithm);
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

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="输入文本"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: 260 }}
        />
        <Select
          value={algorithm}
          onChange={setAlgorithm}
          options={[
            { label: 'MD5', value: 'MD5' },
            { label: 'SHA256', value: 'SHA256' },
          ]}
          style={{ width: 120 }}
        />
        <Button type="primary" onClick={handleExecute} loading={loading}>
          执行
        </Button>
      </Space>

      {loading && <Spin />}
      {error && <Alert type="error" message={error} />}
      {data && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="输入">{data.input}</Descriptions.Item>
          <Descriptions.Item label="算法">{data.algorithm}</Descriptions.Item>
          <Descriptions.Item label="哈希值">
            <code style={{ wordBreak: 'break-all' }}>{data.hash}</code>
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
}