# Todo — 创建待办事项 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现待办事项创建功能的最小闭环：用户输入事项名称与描述，前端通过 API 提交到后端完成持久化。

**Architecture:** 沿用现有 Dashboard Tab 架构，新增 TodoTab 组件作为独立标签页。API 层在 `src/services/api.js` 中扩展 `createTodo` 函数，调用 `POST /api/todos`。Vite 开发服务器已配置 `/api` → `localhost:8080` 代理，无需前端额外处理跨域。

**Tech Stack:** React 18, Vite 5, axios 1.7, ES Modules

## Global Constraints

- 遵循现有项目文件结构和命名约定（PascalCase 组件、camelCase 函数）
- 仅修改本次变更涉及文件，不动无关代码
- API base URL 通过 Vite proxy 代理，前端以 `/api` 为前缀
- 不引入新的 npm 依赖

---

### Task 1: 扩展 API 层 — `createTodo` 函数

**Files:**
- Modify: `src/services/api.js`

**Interfaces:**
- Produces: `createTodo(name, description)` → `Promise<AxiosResponse>` — POST `/api/todos`，请求体 `{ name, description }`

- [ ] **Step 1: 在 api.js 末尾新增 `createTodo` 导出函数**

```js
export function createTodo(name, description) {
  return api.post('/todos', { name, description });
}
```

- [ ] **Step 2: 手动验证 — 检查语法与导出**

Run: `node -e "import('./src/services/api.js').then(m => console.log(typeof m.createTodo))"`
Expected: `"function"`

- [ ] **Step 3: 验证构建不报错**

Run: `npm run build`
Expected: exit code 0，无新增警告或报错

---

### Task 2: 创建 TodoTab 表单组件

**Files:**
- Create: `src/components/TodoTab.jsx`

**Interfaces:**
- Consumes: `createTodo(name, description)` from `../services/api`
- Produces: React 组件 `TodoTab` — 接收 `onResult` prop（回调签名为 `(data) => void`），渲染名称输入框、描述输入框、提交按钮

- [ ] **Step 1: 创建 TodoTab.jsx**

```jsx
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
```

- [ ] **Step 2: 验证构建不报错**

Run: `npm run build`
Expected: exit code 0

---

### Task 3: 注册 Todo Tab 到 Dashboard

**Files:**
- Modify: `src/pages/Dashboard.jsx`

**Interfaces:**
- Consumes: `TodoTab` from `../components/TodoTab`
- Modifies: `TABS` 数组追加 `{ key: 'todo', label: 'Todo', component: TodoTab }`

- [ ] **Step 1: 在 Dashboard.jsx 顶部添加 import**

在第 5 行 `ExportButton` import 之后插入：

```js
import TodoTab from '../components/TodoTab';
```

即文件变为：

```jsx
import { useState } from 'react';
import HelloTab from '../components/HelloTab';
import HashTab from '../components/HashTab';
import SortTab from '../components/SortTab';
import ExportButton from '../components/ExportButton';
import TodoTab from '../components/TodoTab';
```

- [ ] **Step 2: 在 TABS 数组中追加 Todo 条目**

将：

```js
const TABS = [
  { key: 'hello', label: 'Hello World', component: HelloTab },
  { key: 'hash', label: 'SHA-256 Hash', component: HashTab },
  { key: 'sort', label: 'Bubble Sort', component: SortTab },
];
```

改为：

```js
const TABS = [
  { key: 'hello', label: 'Hello World', component: HelloTab },
  { key: 'hash', label: 'SHA-256 Hash', component: HashTab },
  { key: 'sort', label: 'Bubble Sort', component: SortTab },
  { key: 'todo', label: 'Todo', component: TodoTab },
];
```

- [ ] **Step 3: 最终构建验证**

Run: `npm run build`
Expected: exit code 0，构建产物包含 TodoTab 代码

---

## 自审清单 (Self-Review)

1. **Spec 覆盖**：需求仅"创建待办事项 — 名称 + 描述"，Task 1/2/3 完整覆盖 API → 组件 → 集成。
2. **占位符扫描**：无 TBD/TODO/待实现/适当错误处理等模式，所有代码完整给出。
3. **类型一致性**：`createTodo(name, description)` 签名在整个计划中保持一致；`onResult(data)` 回调与 Dashboard 现有模式一致。