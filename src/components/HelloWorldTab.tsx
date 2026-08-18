import { useEffect, useState } from 'react';
import { Spin, Alert, Descriptions } from 'antd';
import { fetchHelloWorld } from '../api/client';
import type { HelloWorldData } from '../types';

interface Props {
  onResult: (data: HelloWorldData) => void;
}

export default function HelloWorldTab({ onResult }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HelloWorldData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHelloWorld()
      .then((res) => {
        if (res.code === 0) {
          setData(res.data);
          onResult(res.data);
        } else {
          setError(res.message);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [onResult]);

  if (loading) return <Spin tip="加载中..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="消息">{data?.message}</Descriptions.Item>
      <Descriptions.Item label="时间戳">{data?.timestamp}</Descriptions.Item>
    </Descriptions>
  );
}