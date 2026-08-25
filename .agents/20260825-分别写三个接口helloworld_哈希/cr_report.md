# Code Review Report

> **Change**: 三个接口（HelloWorld、哈希算法、冒泡排序）+ 前端三Tab页面
> **分支/Commit**: `AI/task-DEV-966dcd0a-7905-11f1-9649-3b4281182f10-83e5e3ce-efb7-4858-a42e-c258b8ac9e22` (testDJnew) / 同分支 (ykstest)
> **日期**: 2026-08-25
> **审查者**: AI (DTCoder)
> **审查范围**: testDJnew (20 Java files) + ykstest (12 TS/TSX files)

---

## §1 审查概要

| 指标 | 数量 |
|------|------|
| 审查文件总数 | 32 (20 Java + 12 前端) |
| P0 阻塞问题 | 2 |
| P1 推荐修复 | 3 |
| P2 参考建议 | 2 |
| 自动化扫描命中 | 1 (误报) |

---

## §2 功能符合性检查 (REQ)

对照设计文档 `.agents/20260825-分别写三个接口helloworld_哈希/design.md`：

| 编号 | 功能点 | 状态 | 证据 |
|------|--------|------|------|
| F01 | HelloWorld 接口 — GET /api/tool/helloworld | ✅ 符合 | `ToolController.java:47-51` — 返回 `ApiResponse<Map<String,String>>`，含 `{message:"Hello, World!"}` |
| F02 | 哈希算法接口 — POST /api/tool/hash | ✅ 符合 | `ToolController.java:59-66` — 接收 `HashRequest`，调用 `HashService.computeHash()`，返回 `HashResultVO` |
| F03 | 冒泡排序接口 — POST /api/tool/sort | ✅ 符合 | `ToolController.java:74-83` — 接收 `SortRequest`，调用 `SortService.bubbleSort()`，返回 `SortResultVO` |
| F04 | 前端三Tab页面 — /tool 路由 | ✅ 符合 | `ToolPage.tsx:15-19` — 三个 Tab: hello/hash/sort；`App.tsx:5` — 默认渲染 ToolPage |
| F05 | 前端调用后端接口 | ✅ 符合 | `api.ts` — 三个 fetch 函数分别调用 `/helloworld`、`/hash`、`/sort`；`vite.config.ts:8-12` — proxy `/api` → `localhost:8080` |

---

## §3 P0 阻塞问题 (Blocker)

### P0-01: SortService 接口暴露实现细节，违反依赖倒置原则

- **等级**: P0 (阻塞)
- **文件**: `[testDJnew] src/main/java/com/example/tool/service/SortService.java:18`
- **关联**: `[testDJnew] src/main/java/com/example/tool/controller/ToolController.java:11,77`
- **问题描述**: `SortService` 接口声明的返回类型为 `SortServiceImpl.SortResult`（实现类的内部类），导致接口与实现强耦合。Controller 层也直接 import `SortServiceImpl`，破坏了分层隔离。
- **设计证据**: design.md §5.1.2 定义 S02 签名 `int[] bubbleSort(int[] array)`，返回应为独立数据结构。
- **修复建议**: 将 `SortResult` 提取为独立的公共类（如 `model/vo/SortResultVO` 已存在），或定义为 `SortService` 接口的内部静态类。同时修改 `ToolController` 移除对 `SortServiceImpl` 的直接依赖。

### P0-02: HashAlgorithmEnum.fromName() 抛出 IllegalArgumentException 未被正确映射为 TOOL_002

- **等级**: P0 (阻塞)
- **文件**: `[testDJnew] src/main/java/com/example/tool/controller/ToolController.java:62`
- **关联**: `[testDJnew] src/main/java/com/example/tool/constant/HashAlgorithmEnum.java:40`, `[testDJnew] src/main/java/com/example/tool/common/exception/GlobalExceptionHandler.java:37-41`
- **问题描述**: 当用户传入不支持的算法（如 "SHA-512"），`HashAlgorithmEnum.fromName()` 抛出 `IllegalArgumentException`。该异常被 `GlobalExceptionHandler.handleException()` 捕获并返回 `TOOL_999`（"系统内部错误"），而非设计文档指定的 `TOOL_002`（"不支持的哈希算法"）。
- **设计证据**: design.md §5.1.2 W02 错误码表：`TOOL_002` — "不支持的哈希算法"。
- **修复建议**: 方案一：`HashAlgorithmEnum.fromName()` 改为抛出 `BusinessException("TOOL_002", ...)`。方案二：在 `GlobalExceptionHandler` 中增加 `@ExceptionHandler(IllegalArgumentException.class)` 映射到 `TOOL_002`。方案三：在 `ToolController.hash()` 中 try-catch 并转换异常。

---

## §4 P1 推荐修复

### P1-01: CORS 配置 allowCredentials(true) 与通配 Origin 冲突

- **等级**: P1 (推荐)
- **文件**: `[testDJnew] src/main/java/com/example/tool/common/config/CorsConfig.java:22-25`
- **问题描述**: `setAllowCredentials(true)` 与 `setAllowedOriginPatterns(List.of("*"))` 同时使用违反 CORS 规范。当 `credentials` 为 true 时，浏览器不允许 `Access-Control-Allow-Origin: *`，请求将被浏览器拦截。
- **修复建议**: 开发环境可改为 `setAllowedOriginPatterns(List.of("http://localhost:3000"))` 或 `setAllowedOrigins(List.of("http://localhost:3000"))`。

### P1-02: HelloWorldPanel 缺少错误展示，不符合 R07 规范

- **等级**: P1 (推荐)
- **文件**: `[ykstest] src/components/HelloWorldPanel.tsx:3-7`, `[ykstest] src/pages/Tool/ToolPage.tsx:114-119`
- **问题描述**: `HelloWorldPanel` 组件未定义 `error` prop，且 `ToolPage` 未将 `tabStates.hello.error` 传入。若 HelloWorld 接口调用失败，用户无法看到错误提示。
- **设计证据**: design.md §5.2.3.1 R07 — "接口错误需展示友好提示"。
- **修复建议**: 为 `HelloWorldPanel` 添加 `error: string | null` prop，并在组件内渲染错误信息（参考 `HashPanel` 的错误展示方式）；同时 `ToolPage` 中传入 `error={tabStates.hello.error}`。

### P1-03: ToolController 直接依赖 SortServiceImpl 实现类

- **等级**: P1 (推荐)
- **文件**: `[testDJnew] src/main/java/com/example/tool/controller/ToolController.java:11,77`
- **问题描述**: Controller 层直接 import `SortServiceImpl` 并使用 `SortServiceImpl.SortResult`，违反分层架构原则。Controller 应仅依赖 `SortService` 接口。
- **修复建议**: 使用独立的 `SortResult` 类或 `SortResultVO` 替代 `SortServiceImpl.SortResult`（与 P0-01 关联修复）。

---

## §5 P2 参考建议

### P2-01: HashServiceImpl 使用完全限定类名而非 import

- **等级**: P2 (参考)
- **文件**: `[testDJnew] src/main/java/com/example/tool/service/impl/HashServiceImpl.java:34`
- **问题描述**: `java.nio.charset.StandardCharsets.UTF_8` 使用完全限定名，缺少 `import java.nio.charset.StandardCharsets`。影响可读性（A1 源文件格式）。
- **修复建议**: 添加 `import java.nio.charset.StandardCharsets;`，将 `java.nio.charset.StandardCharsets.UTF_8` 改为 `StandardCharsets.UTF_8`。

### P2-02: 自动化扫描 G16.2 误报确认

- **等级**: P2 (参考 — 误报)
- **文件**: `[testDJnew] src/main/java/com/example/tool/service/impl/HashServiceImpl.java:49`
- **问题描述**: `scan-all-rules.sh` 报告 `G16.2 — CatchWithoutLogging`，但 catch 块第 50 行已包含 `logger.error("不支持的哈希算法: {}", algorithm.getAlgorithm(), e)`，属于误报。
- **处理**: 无需修复，已人工确认误报。

---

## §6 跨仓对齐检查

| 检查项 | 后端 (testDJnew) | 前端 (ykstest) | 对齐 |
|--------|------------------|----------------|------|
| 统一响应格式 | `ApiResponse {code, msg, data}` | `ApiResponse<T> {code, msg, data}` | ✅ |
| HelloWorld data | `{message: String}` | `{message: string}` | ✅ |
| Hash data | `{input, algorithm, hash}` | `HashResult {input, algorithm, hash}` | ✅ |
| Sort data | `{original: int[], sorted: int[], steps: int}` | `SortResult {original: number[], sorted: number[], steps: number}` | ✅ |
| API 路径 | `/api/tool/helloworld`, `/api/tool/hash`, `/api/tool/sort` | `/helloworld`, `/hash`, `/sort` (BASE_URL=`/api/tool`) | ✅ |
| HTTP 方法 | GET(hello), POST(hash), POST(sort) | GET(hello), POST(hash), POST(sort) | ✅ |
| Vite Proxy | — | `/api` → `http://localhost:8080` | ✅ |
| 端口 | 8080 | 3000 (dev server) | ✅ |

---

## §7 自动化扫描结果

```
=== scan-all-rules.sh 输出 ===
[P0] G16.2 — CatchWithoutLogging: src/main/java/com/example/tool/service/impl/HashServiceImpl.java:49
=== Summary: 1 findings (P0=1, P1=0, P2=0) | 52/222 rules scanned ===
```

- **G16.2 误报**: 已确认 catch 块包含 `logger.error(...)`，详见 §5 P2-02。

---

## §8 修复任务列表

- [ ] **P0-01**: 将 `SortResult` 从 `SortServiceImpl` 内部类提取为独立类，修改 `SortService` 接口返回类型，移除 `ToolController` 对 `SortServiceImpl` 的直接依赖
- [ ] **P0-02**: 修复 `HashAlgorithmEnum.fromName()` 抛出的 `IllegalArgumentException` 映射为 `TOOL_002` 错误码
- [ ] **P1-01**: 修改 CORS 配置，将通配 Origin 改为具体开发域名 `http://localhost:3000`
- [ ] **P1-02**: 为 `HelloWorldPanel` 添加 `error` prop 及错误展示 UI，`ToolPage` 传入错误状态
- [ ] **P1-03**: 消除 `ToolController` 对 `SortServiceImpl` 的直接 import（与 P0-01 联动）
- [ ] **P2-01**: `HashServiceImpl` 添加 `import java.nio.charset.StandardCharsets`，使用短名称

---

> **审查结论**: 核心功能实现完整，跨仓接口契约对齐良好。存在 2 个 P0 阻塞问题（接口设计缺陷 + 异常映射错误）需在合并前修复。3 个 P1 建议在合并前处理。