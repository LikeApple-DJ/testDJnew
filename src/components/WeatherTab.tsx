import { useEffect, useState } from 'react';
import { Spin, Alert, Card, Table, Tag, Typography, Descriptions } from 'antd';
import { CloudOutlined, ThunderboltOutlined, SunOutlined } from '@ant-design/icons';
import { fetchWeather } from '../api/client';
import type { WeatherResponse, WeatherDay } from '../types';

const { Title, Paragraph } = Typography;

interface Props {
  onResult: (data: WeatherResponse) => void;
}

const ratingColor: Record<string, string> = {
  '适宜': 'green',
  '可出行': 'blue',
  '谨慎': 'orange',
};

const weatherIcon: Record<string, React.ReactNode> = {
  '阴': <CloudOutlined style={{ color: '#999' }} />,
  '阴转多云': <CloudOutlined style={{ color: '#aaa' }} />,
  '中雨转小雨': <ThunderboltOutlined style={{ color: '#1677ff' }} />,
  '小雨转多云': <CloudOutlined style={{ color: '#69b1ff' }} />,
  '中雨转多云': <ThunderboltOutlined style={{ color: '#1677ff' }} />,
  '小雨': <CloudOutlined style={{ color: '#69b1ff' }} />,
  '小雨转阴': <CloudOutlined style={{ color: '#69b1ff' }} />,
};

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    width: 110,
  },
  {
    title: '星期',
    dataIndex: 'weekDay',
    key: 'weekDay',
    width: 60,
  },
  {
    title: '天气',
    key: 'weather',
    width: 130,
    render: (_: unknown, r: WeatherDay) => (
      <span>{weatherIcon[r.weather] || <SunOutlined />} {r.weather}</span>
    ),
  },
  {
    title: '高温',
    dataIndex: 'highTemp',
    key: 'highTemp',
    width: 70,
    render: (v: number) => <span style={{ color: '#ff4d4f' }}>{v}°C</span>,
  },
  {
    title: '低温',
    dataIndex: 'lowTemp',
    key: 'lowTemp',
    width: 70,
    render: (v: number) => <span style={{ color: '#1677ff' }}>{v}°C</span>,
  },
  {
    title: '出行评级',
    dataIndex: 'rating',
    key: 'rating',
    width: 100,
    render: (v: string) => <Tag color={ratingColor[v] || 'default'}>{v}</Tag>,
  },
  {
    title: '推荐活动',
    dataIndex: 'suggestion',
    key: 'suggestion',
  },
];

export default function WeatherTab({ onResult }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather()
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

  if (loading) return <Spin tip="加载天气数据..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return (
    <div style={{ padding: '0 0 16px 0' }}>
      <Card
        title={
          <span>
            🌤️ {data.city} · 近一周天气预报
            <span style={{ fontSize: 12, color: '#999', marginLeft: 12 }}>
              更新于 {new Date(data.updateTime).toLocaleString()}
            </span>
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        <Table
          dataSource={data.days}
          columns={columns}
          rowKey="date"
          pagination={false}
          size="small"
          bordered
        />
      </Card>

      <Card title="👕 穿衣指南" style={{ marginBottom: 16 }}>
        <Paragraph>{data.dressAdvice}</Paragraph>
      </Card>

      <Card title="💡 出行策略">
        <Paragraph>{data.outdoorStrategy}</Paragraph>
      </Card>
    </div>
  );
}