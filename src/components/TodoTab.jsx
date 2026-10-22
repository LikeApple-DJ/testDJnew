import { useState } from 'react';
import { createTodo } from '../services/api';

export default function TodoTab({ onResult }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('事项名称不能为空');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await createTodo(trimmedName, description.trim());
      onResult(res.data);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || '创建失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="todo-name">事项名称</label>
        <input
          id="todo-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入待办事项名称"
          disabled={saving}
        />
      </div>
      <div className="form-field">
        <label htmlFor="todo-desc">描述</label>
        <textarea
          id="todo-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="请输入描述（可选）"
          rows={3}
          disabled={saving}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? '保存中...' : '新增待办事项'}
      </button>
    </form>
  );
}