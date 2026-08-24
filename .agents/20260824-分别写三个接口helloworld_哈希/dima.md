# 需求澄清 & 跨仓设计方案 — Brainstorming

## 1. 需求全景

```
[前端 - testDJnew]
┌───────────────────────────────────────────────┐
│  Tab1: helloworld 结果   │ Tab2: 哈希结果 │ Tab3: 冒泡排序结果 │
├───────────────────────────────────────────────┤
│  [导出按钮]                                    │
├───────────────────────────────────────────────┤
│  可视化报表区域                                 │
│  ┌───────────┐ ┌──────────┐ ┌───────────┐     │
│  │ 折线图     │ │ 饼图     │ │ 柱状图    │     │
│  │ (时间趋势)  │ │ (人员类型)│ │ (人员部门) │     │
│  └───────────┘ └──────────┘ └───────────┘     │
└───────────────────────────────────────────────┘
         ▲ 调用 REST API         ▲ 读取统计
         │                        │
[后端 - ranxitest]
┌───────────────────────────────────────────────┐
│  /api/helloworld      → 埋点 + 返回问候语      │
│  /api/hash?input=xxx  → 埋点 + 返回哈希值      │
│  /api/bubblesort?arr= → 埋点 + 返回排序结果    │
│  /api/export          → 导出各页数据            │
│  /api/stats           → 返回调用统计            │
│  ┌─────────────────────────────────────────┐   │
│  │ 埋点数据库 (调用次数/调用人/时间/维度)    │   │
│  └─────────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
```

## 2. 跨仓依赖与现状摘要

| 仓库 | 路径 | 当前状态 | 角色 |
|------|------|---------|------|
| testDJnew-main | .../testDJnew-main | 空仓，仅 README.md | 前端项目 |
| ranxitest-main | .../ranxitest-main | 空仓，仅 README.md | 后端项目 |

- **依赖关系**: 前端(testDJnew) → HTTP 调用 → 后端(ranxitest)
- **数据流**: 用户操作 → 前端调用 API → 后端执行业务+埋点 → 返回结果 → 前端渲染

## 3. 功能模块拆分

### 3.1 后端接口（ranxitest-main）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| helloworld | GET | /api/helloworld | 返回问候语 |
| 哈希算法 | GET | /api/hash?input=xxx | 对输入做哈希并返回 |
| 冒泡排序 | POST | /api/bubblesort | 对数组排序并返回 |
| 导出接口 | GET | /api/export?tab=xxx | 导出指定 tab 数据 |
| 统计接口 | GET | /api/stats | 返回埋点统计数据 |

### 3.2 前端页面（testDJnew-main）

| 模块 | 说明 |
|------|------|
| 三 Tab 页 | helloworld / 哈希 / 冒泡排序，各自展示结果 |
| 导出按钮 | 调用后端导出接口下载文件 |
| 可视化报表 | 折线图(时间维度)、饼图(人员类型)、柱状图(人员部门/层级) |

### 3.3 埋点系统

| 字段 | 说明 |
|------|------|
| 调用次数 | 每次接口调用 +1 |
| 调用人 | 从请求头/认证信息获取 |
| 调用时间 | 时间戳 |
| 人员维度 | 类型、层级、部门 |

## 4. 已确认技术决策

以下为需求澄清阶段经用户确认的决策：

| 决策项 | 选定方案 | 说明 |
|--------|---------|------|
| **技术栈** | Java + React | 后端 Java/Spring Boot，前端 React |
| **哈希算法** | SHA-256（默认） | 使用标准 SHA-256 哈希 |
| **导出格式** | CSV（默认） | 导出为 CSV 文件格式 |
| **埋点存储** | 内存存储（默认） | 应用启动后内存记录，重启重置 |
| **调用人识别** | HTTP Header 模拟（默认） | 请求头 `X-User-Id` / `X-User-Type` 等传递调用人信息 |
| **仓库分配** | testDJnew = 前端，ranxitest = 后端 | 已完成分配 |

## 5. 接口契约草案

### 5.1 helloworld
```
GET /api/helloworld
Response: { "code": 0, "data": { "message": "Hello, World!" } }
```

### 5.2 哈希算法
```
GET /api/hash?input=hello
Response: { "code": 0, "data": { "algorithm": "sha256", "input": "hello", "output": "2cf24dba5fb0a30e..." } }
```

### 5.3 冒泡排序
```
POST /api/bubblesort
Body: { "array": [5, 3, 8, 1, 2] }
Response: { "code": 0, "data": { "original": [5,3,8,1,2], "sorted": [1,2,3,5,8], "steps": 10 } }
```

### 5.4 导出接口
```
GET /api/export?tab=helloworld|hash|bubblesort
Response: Content-Disposition attachment (CSV/Excel file)
```

### 5.5 统计接口
```
GET /api/stats?dimension=userType|userLevel|userDept
Response: { "code": 0, "data": { "dimension": "userType", "series": [...] } }
```

## 6. 开发计划建议

1. **Phase 1**: 后端基础骨架 + 三个业务接口 + 埋点
2. **Phase 2**: 前端页面 + 三 Tab + 调用后端
3. **Phase 3**: 导出接口 + 导出按钮
4. **Phase 4**: 统计接口 + 可视化图表

## 7. 风险评估

- 两个仓库均为空仓，需从头搭建项目骨架
- 埋点维度设计与前端展示对齐需提前确认
- 导出格式影响前端下载交互方式