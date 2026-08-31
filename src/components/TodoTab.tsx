import { useState } from 'react';
import { Form, Input, Button, Spin, Alert, Descriptions, Card, message } from 'antd';
import { createTodo } from '../api/client';
import type { TodoItem } from '../types';

interface Props {
  onResult: (data: TodoItem) => void;
}

interface FormValues {
  name: string;
  description: string;
}

export default function TodoTab({ onResult }: Props) {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TodoItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createTodo(values.name, values.description);
      if (res.code === 0) {
        setData(res.data);
        onResult(res.data);
        message.success('待办事项创建成功');
        form.resetFields();
      } else {
        setError(res.message);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="📝 新增待办事项" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="事项名称"
            name="name"
            rules={[{ required: true, message: '请输入事项名称' }]}
          >
            <Input placeholder="请输入事项名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入事项描述' }]}
          >
            <Input.TextArea
              placeholder="请输入事项描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              创建
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loading && <Spin />}
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {data && (
        <Card title="✅ 最近创建">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label="事项名称">{data.name}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createdAt}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}
