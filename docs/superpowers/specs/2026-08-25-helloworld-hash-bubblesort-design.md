# 跨仓接口设计文档：HelloWorld / 哈希算法 / 冒泡排序

> 日期：2026-08-25  
> 状态：需求澄清完成，待执行  
> 仓库：`[testDJnew]` 后端 + `[ykstest]` 前端

---

## 1. 仓库分工

| 仓库 | 角色 | 技术栈 |
|------|------|--------|
| `testDJnew` | 后端服务 | Java Spring Boot |
| `ykstest` | 前端页面 | React |

---

## 2. 接口契约

### 2.1 HelloWorld

- **方法**: `GET`
- **路径**: `/api/hello`
- **入参**: 无
- **响应** (JSON):

```json
{
  "message": "Hello, World!",
  "timestamp": "2026-08-25T10:00:00Z",
  "version": "1.0.0"
}
```

### 2.2 哈希算法

- **方法**: `POST`
- **路径**: `/api/hash`
- **Content-Type**: `application/json`
- **请求体**:

```json
{
  "algorithm": "SHA-256",
  "input": "hello"
}
```

- `algorithm` 可选值: `MD5` | `SHA-1` | `SHA-256`（大小写不敏感）
- **响应** (JSON):

```json
{
  "algorithm": "SHA-256",
  "input": "hello",
  "hash": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```

- **错误处理**: 不支持的算法返回 400 + `{ "error": "Unsupported algorithm: xxx" }`

### 2.3 冒泡排序

- **方法**: `POST`
- **路径**: `/api/sort`
- **Content-Type**: `application/json`
- **请求体**:

```json
{
  "numbers": [5, 3, 8, 1, 2]
}
```

- **响应** (JSON):

```json
{
  "sorted": [1, 2, 3, 5, 8],
  "steps": [
    {"pass": 1, "array": [3, 5, 1, 2, 8], "swapped": true},
    {"pass": 2, "array": [3, 1, 2, 5, 8], "swapped": true},
    {"pass": 3, "array": [1, 2, 3, 5, 8], "swapped": true},
    {"pass": 4, "array": [1, 2, 3, 5, 8], "swapped": false}
  ]
}
```

- `steps` 为每轮冒泡结束后的数组状态，`swapped` 标识本轮是否发生交换。
- **错误处理**: 空数组返回 400 + `{ "error": "numbers array must not be empty" }`

---

## 3. 前端页面设计

### 3.1 整体布局

单页面，顶部三个 Tab 切换：

```
┌─────────────────────────────────────────┐
│  [HelloWorld]  [哈希算法]  [冒泡排序]    │
├─────────────────────────────────────────┤
│                                         │
│   输入区 (按 Tab 不同)                    │
│                                         │
│   [执行] 按钮                            │
│                                         │
│   结果展示区                              │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Tab 详情

| Tab | 输入区 | 结果展示 |
|-----|--------|----------|
| HelloWorld | 无输入（或显示说明文字） | 展示 `message`、`timestamp`、`version` |
| 哈希算法 | 文本输入框 + 算法下拉选择 (MD5/SHA-1/SHA-256) | 展示哈希结果十六进制字符串 |
| 冒泡排序 | 数字输入（逗号分隔，如 `5,3,8,1`） | 展示最终排序结果 + 每步中间状态列表 |

---

## 4. 跨仓对齐点

| 对齐项 | 说明 |
|--------|------|
| API Base URL | 前端需配置后端地址（开发环境默认 `http://localhost:8080`） |
| CORS | 后端需开启 CORS 允许前端跨域请求 |
| Content-Type | 前后端统一使用 `application/json` |
| 错误格式 | 统一 `{ "error": "message" }` 格式 |

---

## 5. 待定 / 默认假设

| 项目 | 默认值 |
|------|--------|
| 后端端口 | `8080` |
| 前端端口 | `3000` |
| 冒泡排序方向 | 升序（默认） |
| 版本号 | `1.0.0`（硬编码） |