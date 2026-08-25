# Code Review Report

> **Change**: 三个接口（HelloWorld、哈希算法、冒泡排序）+ 前端三Tab页面
> **分支/Commit**: `AI/task-DEV-966dcd0a-7905-11f1-9649-3b4281182f10-83e5e3ce-efb7-4858-a42e-c258b8ac9e22` (base: `main`)
> **日期**: 2026-08-25
> **审查者**: AI (DTCoder)
> **审查范围**: testDJnew 后端 Java 代码（15 个 .java 文件）

---

## §1 审查概要

| 维度 | 结果 |
|------|------|
| 审查文件数 | 15 |
| P0 (阻塞) | **2** |
| P1 (推荐) | 3 |
| P2 (参考) | 1 |
| 总体结论 | ❌ 不建议合并 — 存在 2 个 P0 阻塞项必须修复 |

**核心问题**：错误码映射链路断裂——`@Valid` 校验失败和 `HashAlgorithmEnum.fromName()` 抛出的 `IllegalArgumentException` 均被全局兜底异常处理器捕获，统一返回 `TOOL_999`，与设计文档约定的 `TOOL_001/002/003/004` 不一致。

---

## §2 审查范围 — 执行队列

| 序号 | 文件 | 状态 |
|------|------|------|
| 1 | `src/main/java/com/example/tool/ToolApplication.java` | ✅ 已审 |
| 2 | `src/main/java/com/example/tool/common/ApiResponse.java` | ✅ 已审 |
| 3 | `src/main/java/com/example/tool/common/config/CorsConfig.java` | ✅ 已审 |
| 4 | `src/main/java/com/example/tool/common/exception/BusinessException.java` | ✅ 已审 |
| 5 | `src/main/java/com/example/tool/common/exception/GlobalExceptionHandler.java` | ⚠️ 已审有问题 |
| 6 | `src/main/java/com/example/tool/constant/HashAlgorithmEnum.java` | ⚠️ 已审有问题 |
| 7 | `src/main/java/com/example/tool/controller/ToolController.java` | ⚠️ 已审有问题 |
| 8 | `src/main/java/com/example/tool/model/dto/HashRequest.java` | ✅ 已审 |
| 9 | `src/main/java/com/example/tool/model/dto/SortRequest.java` | ✅ 已审 |
| 10 | `src/main/java/com/example/tool/model/vo/HashResultVO.java` | ✅ 已审 |
| 11 | `src/main/java/com/example/tool/model/vo/SortResultVO.java` | ✅ 已审 |
| 12 | `src/main/java/com/example/tool/service/HashService.java` | ✅ 已审 |
| 13 | `src/main/java/com/example/tool/service/SortService.java` | ⚠️ 已审有问题 |
| 14 | `src/main/java/com/example/tool/service/impl/HashServiceImpl.java` | ✅ 已审 |
| 15 | `src/main/java/com/example/tool/service/impl/SortServiceImpl.java` | ✅ 已审 |

---

## §3 功能性检查（Step 2）

### REQ 对照表

| REQ | 来源 | 关联文件 | 状态 | 说明 |
|-----|------|----------|------|------|
| F01 — HelloWorld GET /api/tool/helloworld 返回问候语 | design.md §5.1.2 W01 | ToolController.java:48-51 | ✅ 满足 | 返回 `{"code":"OK","msg":"SUCCESS","data":{"message":"Hello, World!"}}`，与 spec 一致 |
| F02 — 哈希 POST /api/tool/hash 计算哈希值 | design.md §5.1.2 W02 | ToolController.java:59-66, HashServiceImpl.java:24-53, HashAlgorithmEnum.java:31-41 | ❌ P0 | 错误码映射断裂（详见 §3.1） |
| F03 — 冒泡排序 POST /api/tool/sort | design.md §5.1.2 W03 | ToolController.java:74-83, SortServiceImpl.java:21-59 | ❌ P0 | 错误码映射断裂（详见 §3.1） |
| R01 — input 不能为 null 或空字符串 → TOOL_001 | design.md §5.1.3.2 R01 | HashRequest.java:12, GlobalExceptionHandler.java:37-41 | ❌ P0 | `@NotBlank` 校验失败后走兜底异常 → 返回 TOOL_999 |
| R02 — algorithm 不支持 → TOOL_002 | design.md §5.1.3.2 R02 | HashAlgorithmEnum.java:40, GlobalExceptionHandler.java:37-41 | ❌ P0 | `IllegalArgumentException` → 返回 TOOL_999 |
| R03 — array 不能为 null 或空数组 → TOOL_003 | design.md §5.1.3.3 R03 | SortRequest.java:13, GlobalExceptionHandler.java:37-41 | ❌ P0 | `@NotEmpty` 校验失败后走兜底异常 → 返回 TOOL_999 |
| R04 — array 长度 ≤ 1000 → TOOL_004 | design.md §5.1.3.3 R04 | SortRequest.java:14, GlobalExceptionHandler.java:37-41 | ❌ P0 | `@Size` 校验失败后走兜底异常 → 返回 TOOL_999 |

### §3.1 P0 详细分析：错误码映射链路断裂

**问题描述**：设计文档明确要求四种错误码返回（TOOL_001/002/003/004），但实际有两条校验路径的异常未被正确映射：

**路径 1 — Jakarta Validation 失败**：
```
请求 → Controller @Valid → MethodArgumentNotValidException →
GlobalExceptionHandler.handleException() → ApiResponse.error("TOOL_999", "系统内部错误")
```
- `HashRequest.@NotBlank` 失败 → 应返回 TOOL_001，实际返回 TOOL_999
- `SortRequest.@NotEmpty` 失败 → 应返回 TOOL_003，实际返回 TOOL_999
- `SortRequest.@Size` 失败 → 应返回 TOOL_004，实际返回 TOOL_999

**路径 2 — 非法算法名**：
```
请求 algorithm="INVALID" → HashAlgorithmEnum.fromName("INVALID") →
IllegalArgumentException → GlobalExceptionHandler.handleException() → TOOL_999
```
- 应返回 TOOL_002，实际返回 TOOL_999

**Spec 证据**：
- design.md:290-293: "TOOL_001 输入不能为空", "TOOL_002 不支持的哈希算法"
- design.md:340-343: "TOOL_003 数组不能为空", "TOOL_004 数组元素过多（超过 1000）"

**代码证据**：
- `GlobalExceptionHandler.java:37-41`: `handleException()` 硬编码返回 `"TOOL_999"`
- 无 `MethodArgumentNotValidException` 的 `@ExceptionHandler`
- 无 `IllegalArgumentException` 的 `@ExceptionHandler`

---

## §4 可读性检查（Step 3）

| ID | 规则 | 状态 | 说明 |
|----|------|------|------|
| A1.1 | 文件名 = 顶层类名 | ✅ | 全部满足 |
| A1.2 | 编码 UTF-8 | ✅ | pom.xml 配置 UTF-8 |
| A2.1 | 文件结构顺序 | ✅ | package → import → 类，结构正确 |
| A2.2 | 禁止 `import *` | ✅ | 无通配符导入 |
| A2.3 | import 分组 | ✅ | 静态/非静态分组正确 |
| A2.4 | import 字典序 | ✅ | 排序正确 |
| A3.1 | K&R 大括号 | ✅ | 全部满足 |
| A3.3 | 缩进 4 空格 | ✅ | 全部满足 |
| A3.4 | 行宽 ≤ 120 | ✅ | 全部满足 |
| A3.7 | 关键字与 `(` 空格 | ✅ | `if (`, `for (`, `catch (` 均有空格 |
| A3.8 | 运算符空格 | ✅ | 正确 |
| A4.1 | 包名全小写 | ✅ | `com.example.tool.*` |
| A4.2 | 类名 UpperCamelCase | ✅ | 全部满足 |
| A4.3 | 方法名 lowerCamelCase | ✅ | 全部满足 |
| A4.4 | 常量 UPPER_SNAKE_CASE | ✅ | `MAX_ARRAY_LENGTH` |
| A5.1 | 重写方法 `@Override` | ✅ | `HashServiceImpl.computeHash`, `SortServiceImpl.bubbleSort` |
| A5.2 | catch 块非空 | ✅ | catch 有日志和异常抛出 |
| A6.1 | 数组方括号属类型 | ✅ | `int[] array` |
| A7.1 | public 类/方法 Javadoc | ✅ | 全部 public 类和方法均有 Javadoc |
| A7.2 | Javadoc 标记顺序 | ✅ | `@param` → `@return` |

**可读性结论**：✅ 全部通过，代码风格符合阿里巴巴 Java 规范。

---

## §5 可靠性检查（Step 4）

### G — 蚂蚁编码军规

| ID | 检查项 | 状态 | 说明 |
|----|--------|------|------|
| G1.x | 并发控制 | N/A | 无状态计算，无共享状态 |
| G2.x | 幂等拦截 | N/A | 均为读/计算接口，不涉及写操作 |
| G3.x | 事务控制 | N/A | 无数据库操作 |
| G4.x | SQL与索引 | N/A | 无数据库操作 |
| G5.x | 消息(MQ) | N/A | 无消息队列 |
| G6.x | 缓存 | N/A | 无缓存 |
| G7.x | 调度任务 | N/A | 无定时任务 |
| G8.x | 防御编程 | ✅ | 无资源泄漏风险；`SortServiceImpl` 对输入数组做 clone 保护原始数据 |
| G9.x | 网络调用 | N/A | 无外部 RPC/HTTP 调用 |
| G10.x | 接口契约 | ⚠️ P1 | `SortService` 接口返回 `SortServiceImpl.SortResult`（接口依赖实现类） |
| G11.3 | 入参空值校验 | ✅ | `HashServiceImpl` 有 null 检查；`SortServiceImpl` 有 null/空检查 |
| G11.4 | 数值运算 | ✅ | 无浮点运算，冒泡排序仅整数比较 |
| G12.x | 资损防控 | N/A | 不涉及资金 |
| G13.1 | 日志级别 | ✅ | `logger.info` 正常流程；`logger.warn` 业务异常；`logger.error` 系统异常 |
| G14.x | 国际化/多租户 | N/A | 演示工具 |
| G15.x | 可灰度 | N/A | 演示工具 |
| G16.2 | 异常路径日志 | ✅ | 脚本扫描误报 — `HashServiceImpl:49` catch 块内 `logger.error()` 有日志输出 |
| G16.3 | 日志级别正确 | ✅ | 级别使用正确 |
| G16.4 | 空 catch | ✅ | 无空 catch |
| G17.x | 可应急 | N/A | 演示工具 |

### S — 安全

| ID | 检查项 | 状态 | 说明 |
|----|--------|------|------|
| S1.x | SQL注入 | N/A | 无数据库 |
| S2.x | XSS | N/A | 后端不渲染 HTML |
| S3.x | SSRF | N/A | 无外部请求 |
| S4.x | 命令执行 | N/A | 无命令执行 |
| S5.x | XXE | N/A | 无 XML 解析 |
| S6.x | 反序列化 | N/A | 仅 Jackson 标准 JSON 反序列化到 DTO |
| S7.x | 文件上传 | N/A | 无文件操作 |
| S8.x | 访问控制 | N/A | 设计文档明确排除认证 |
| S9.x | 数据安全 | N/A | 无敏感数据 |
| **S10.2** | **CORS Origin 白名单** | **⚠️ P1** | `CorsConfig.java:22` — `setAllowedOriginPatterns(List.of("*"))` + `setAllowCredentials(true)` 组合宽松，开发阶段可接受但需注意生产风险 |

### 自动化预扫脚本结果

| 结果 | 说明 |
|------|------|
| [P0] G16.2 CatchWithoutLogging — `HashServiceImpl.java:49` | **误报** — catch 块内 `logger.error()` 有日志输出（line 50），脚本未识别到 |

---

## §6 自定义扩展检查（Step 5）

**N/A**（未启用自定义规则）

---

## §7 跨仓对齐点检查

| 对齐项 | 后端 (testDJnew) | 前端 (ykstest) | 状态 |
|--------|-------------------|----------------|------|
| HelloWorld 接口路径 | `GET /api/tool/helloworld` | `api.ts` 调用 `/api/tool/helloworld` | ✅ 一致 |
| 哈希接口路径 | `POST /api/tool/hash` | `api.ts` 调用 `/api/tool/hash` | ✅ 一致 |
| 排序接口路径 | `POST /api/tool/sort` | `api.ts` 调用 `/api/tool/sort` | ✅ 一致 |
| 统一响应格式 | `{code, msg, data}` | 前端解析 `response.data` | ✅ 一致 |
| 哈希算法默认值 | SHA-256 | 前端默认 SHA-256 | ✅ 一致 |
| 排序输入格式 | `int[]` (JSON array) | 前端发送 `number[]` | ✅ 一致 |
| CORS 跨域 | 配置 `CorsFilter` 允许所有源 | 开发服务器 `:3000` | ✅ 满足 |

**跨仓对齐结论**：✅ 前后端接口契约一致，无跨仓兼容性问题。

---

## §8 修复任务列表

### P0 — 阻塞（必须修复）

- [ ] **P0-1** 修复错误码映射链路：
  - `GlobalExceptionHandler` 新增 `@ExceptionHandler(MethodArgumentNotValidException.class)`，从校验失败字段提取对应错误码（input 空 → TOOL_001，array 空 → TOOL_003，array 超长 → TOOL_004）
  - `GlobalExceptionHandler` 新增 `@ExceptionHandler(IllegalArgumentException.class)`，返回 TOOL_002
  - 或：在 `ToolController.hash()` 中 try-catch `fromName()` 的 `IllegalArgumentException`，转为 `BusinessException("TOOL_002", ...)`

- [ ] **P0-2** 修复分层架构违规：
  - `SortService.java:18` 返回类型从 `SortServiceImpl.SortResult` 改为独立的结果类（如 `model/vo/SortResultVO` 或新建 `model/dto/SortResult`）
  - `ToolController.java:11` 移除 `import com.example.tool.service.impl.SortServiceImpl`
  - `ToolController.java:77` 不再直接引用 `SortServiceImpl.SortResult`

### P1 — 推荐（合并前应修复）

- [ ] **P1-1** `CorsConfig.java:22` — `setAllowedOriginPatterns(List.of("*"))` 与 `setAllowCredentials(true)` 组合过于宽松，建议限定为开发域名列表（如 `http://localhost:3000`）

- [ ] **P1-2** `HashServiceImpl.java:28-30` — null 算法抛出 `TOOL_002` 与 spec 不符（算法可选，默认 SHA-256），建议改为直接使用 `SHA256` 默认值或移除该检查（因为 `fromName` 已处理默认值）

- [ ] **P1-3** 建议 `HashServiceImpl.computeHash` 的 null 输入校验改为同时检查空字符串（`input == null || input.isEmpty()`），与 `HashRequest.@NotBlank` 保持一致

### P2 — 参考（可选改进）

- [ ] **P2-1** `HashAlgorithmEnum.fromName()` 对 null/blank 返回 `SHA256` 的默认行为，建议在 Javadoc 中明确标注

---

## §9 自动化预扫详细日志

```
=== Step 4 Rule Scan (B/M/I + A/S/G) ===
Targets: .../src/main/java/com/example/tool/
Engine:  ripgrep

[P0] G16.2 — CatchWithoutLogging: .../HashServiceImpl.java:49
  → 复核：误报。catch 块内 line 50 有 logger.error(...)，已正常记录日志。

=== Summary: 1 findings (P0=1, P1=0, P2=0) | 52/222 rules scanned ===
```

---

> **审查结论**：代码功能实现基本正确，冒泡排序算法、哈希计算逻辑、HelloWorld 接口均符合设计文档。前端接口契约对齐无误。**但存在 2 个 P0 阻塞项**：错误码映射断裂导致所有校验失败统一返回 TOOL_999，以及 SortService 接口依赖实现类的分层违规。修复后方可合并。