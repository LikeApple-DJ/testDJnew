# Code Review Report

> **Change** 问题修复（三个接口 HelloWorld/哈希/冒泡排序） · **分支** `AI/task-DEV-966dcd0a-7905-11f1-9649-3b4281182f10-83e5e3ce-efb7-4858-a42e-c258b8ac9e22` · **日期** 2026-08-25 · **审查者** AI

---

## §1 审查范围

| # | 文件 | 类型 | 状态 |
|---|------|------|------|
| 1 | `src/main/java/com/example/tool/common/config/CorsConfig.java` | 配置 | ✅ 已审 |
| 2 | `src/main/java/com/example/tool/common/exception/GlobalExceptionHandler.java` | 异常处理 | ⚠️ 已审有问题 |
| 3 | `src/main/java/com/example/tool/constant/HashAlgorithmEnum.java` | 枚举 | ✅ 已审 |
| 4 | `src/main/java/com/example/tool/controller/ToolController.java` | 控制器 | ✅ 已审 |
| 5 | `src/main/java/com/example/tool/service/SortService.java` | 接口 | ✅ 已审 |
| 6 | `src/main/java/com/example/tool/service/impl/HashServiceImpl.java` | 服务实现 | ⚠️ 已审有问题 |
| 7 | `src/main/java/com/example/tool/service/impl/SortServiceImpl.java` | 服务实现 | ✅ 已审 |
| 8 | `src/test/java/com/example/tool/controller/ToolControllerTest.java` | 测试 | ✅ 已审 |
| 9 | `src/test/java/com/example/tool/service/impl/HashServiceImplTest.java` | 测试 | ✅ 已审 |
| 10 | `src/test/java/com/example/tool/service/impl/SortServiceImplTest.java` | 测试 | ✅ 已审 |

**变更概要**：本阶段为问题修复（review 阶段），主要改动包括：
- CORS 配置从通配符 `*` 收紧为具体域名（安全加固）
- 全局异常处理器新增 `MethodArgumentNotValidException` 和 `IllegalArgumentException` 处理
- `HashAlgorithmEnum.fromName()` 对 null/blank 输入默认返回 SHA256（防御性编程）
- `SortService` 接口返回类型从内部类 `SortServiceImpl.SortResult` 提升为独立 VO `SortResultVO`（解耦）
- `ToolController.sort()` 简化，直接返回 VO 而非手动转换
- 测试用例同步更新，空字符串校验行为从"正常计算"修正为"抛出异常"

---

## §2 功能性检查（Step 2）

### 需求对照

| REQ | 来源 | 描述 | 关联文件 | 结果 |
|-----|------|------|----------|------|
| F01 | design.md L40 | HelloWorld 接口返回问候语 | ToolController.java | ✅ |
| F02 | design.md L41 | 哈希算法接口，输入校验 + 算法选择 | HashServiceImpl.java, HashAlgorithmEnum.java, GlobalExceptionHandler.java | ✅ |
| F03 | design.md L42 | 冒泡排序接口，输入校验 + 长度限制 | SortServiceImpl.java, SortService.java, GlobalExceptionHandler.java | ❌ P0 |
| F04 | design.md L43 | 前端三Tab页面 | ykstest（非 Java，跳过） | N/A |
| F05 | design.md L44 | 前端调用后端接口 | ykstest（非 Java，跳过） | N/A |

### 功能点详细核对

#### F01 — HelloWorld 接口 ✅
- 设计文档 §5.1.3.1：GET /api/tool/helloworld，返回 `{"code":"OK","msg":"SUCCESS","data":{"message":"Hello, World!"}}`
- 代码证据：`ToolController.java:46-50` — `@GetMapping("/helloworld")` 返回 `ApiResponse.success(Map.of("message", "Hello, World!"))`
- 测试证据：`ToolControllerTest.java:42-48` — 验证 `$.data.message` = `"Hello, World!"`
- 结论：**满足设计**

#### F02 — 哈希算法接口 ✅
- 设计文档 §5.1.3.2：POST /api/tool/hash，input 非空校验（R01），algorithm 白名单校验（R02）
- 代码证据：
  - `HashRequest.java:12` — `@NotBlank` 校验 input
  - `HashAlgorithmEnum.java:32-35` — null/blank 默认 SHA256，不支持的算法抛 `IllegalArgumentException`
  - `GlobalExceptionHandler.java:71-75` — `IllegalArgumentException` → TOOL_002
  - `GlobalExceptionHandler.java:55-63` — `MethodArgumentNotValidException` → TOOL_001（input 字段）
  - `HashServiceImpl.java:24-27` — 服务层双重校验 input 非空
- 测试证据：`HashServiceImplTest.java:28-92` — 覆盖 SHA256/MD5/SHA1、空输入、null 输入
- 结论：**满足设计**

#### F03 — 冒泡排序接口 ❌ P0
- 设计文档 §5.1.3.3：R03 → TOOL_003（数组不能为空），R04 → TOOL_004（数组元素过多）
- 代码证据：
  - `SortRequest.java:13-14` — `@NotEmpty` + `@Size(max=1000)` 校验
  - `GlobalExceptionHandler.java:31-34` — `VALIDATION_ERROR_CODE_MAP` 仅映射 `"array" → "TOOL_003"`
  - **问题**：`@NotEmpty` 和 `@Size` 均以字段名 `"array"` 报错，当前映射无法区分二者，导致 `@Size(max=1000)` 校验失败时返回 **TOOL_003** 而非设计要求的 **TOOL_004**
- **Spec 证据**：design.md L343-344 — 错误码 TOOL_004 说明"数组元素过多（超过 1000）"
- **代码证据**：`GlobalExceptionHandler.java:31-34` — `Map.of("input", "TOOL_001", "array", "TOOL_003")`，缺少 `@Size` 超限场景到 TOOL_004 的映射
- 结论：**P0 阻塞** — 超长数组校验返回错误码 TOOL_003 而非 TOOL_004，与设计文档不符

---

## §3 可读性检查（Step 3）

| ID | 规则 | 文件:行号 | 结果 |
|----|------|-----------|------|
| A1.1 | 文件名 = 顶层类名 | 全部 | ✅ |
| A1.2 | 编码 UTF-8 | 全部 | ✅ |
| A2.2 | 禁止 `import *` | 全部 | ✅ |
| A2.2 | 未使用的 import | `GlobalExceptionHandler.java:12` — `import java.util.stream.Collectors` 未使用 | ⚠️ P2 |
| A3.1 | K&R 大括号 | 全部 | ✅ |
| A3.3 | 缩进 4 空格 | 全部 | ✅ |
| A3.4 | 行宽 ≤ 120 | 全部 | ✅ |
| A4.1 | 包名全小写 | 全部 | ✅ |
| A4.2 | 类名 UpperCamelCase | 全部 | ✅ |
| A4.3 | 方法名 lowerCamelCase | 全部 | ✅ |
| A4.4 | 常量 UPPER_SNAKE | `GlobalExceptionHandler.java:31` VALIDATION_ERROR_CODE_MAP, `SortServiceImpl.java:19` MAX_ARRAY_LENGTH | ✅ |
| A5.1 | `@Override` 注解 | `HashServiceImpl.java:23`, `SortServiceImpl.java:21` | ✅ |
| A5.2 | catch 非空 | `HashServiceImpl.java:46-49` — catch 有 log + rethrow | ✅ |
| A6.1 | 数组方括号类型侧 | `SortService.java:18` — `int[] array` | ✅ |
| A7.1 | public 类/方法 Javadoc | 全部 public 类和方法均有 Javadoc | ✅ |
| — | 使用完全限定名代替 import | `HashServiceImpl.java:31` — `java.nio.charset.StandardCharsets.UTF_8` 应 import | ⚠️ P2 |

---

## §4 可靠性检查（Step 4）

### 脚本预扫结果

| 规则 | 文件:行号 | 结果 |
|------|-----------|------|
| G16.2 CatchWithoutLogging | `HashServiceImpl.java:46` | ⚠️ **误报（False Positive）** — catch 块内 `logger.error("不支持的哈希算法: {}", algorithm.getAlgorithm(), e)` 已记录日志并 rethrow BusinessException，符合 G16.2 要求 |

### LLM 核销

| ID | 扫描信号 | 适用性 | 结果 |
|----|----------|--------|------|
| G1 (并发) | 无共享状态，纯计算 | N/A | — |
| G2 (幂等) | 读接口，无写操作 | N/A | — |
| G3 (事务) | 无数据库操作 | N/A | — |
| G4 (SQL) | 无 SQL | N/A | — |
| G5 (MQ) | 无消息队列 | N/A | — |
| G6 (缓存) | 无缓存 | N/A | — |
| G7 (调度) | 无定时任务 | N/A | — |
| G8.1 (防御编程) | `HashServiceImpl.java:46-49` catch 后 log + rethrow | ✅ | 正确 |
| G8.3 (资源释放) | 无外部资源 | N/A | — |
| G9 (网络调用) | 无外部调用 | N/A | — |
| G10 (接口契约) | `SortService` 返回类型从内部类改为 VO | ✅ | 向后兼容改进 |
| G11.1 (单测断言) | 所有测试含断言 | ✅ | — |
| G11.2 (边界覆盖) | 空值、单元素、超长、负数、重复 | ✅ | 覆盖充分 |
| G11.3 (入参校验) | `HashServiceImpl.java:25`, `SortServiceImpl.java:23-28` | ✅ | 双保险校验 |
| G13.1 (日志级别) | INFO/WARN/ERROR 使用正确 | ✅ | — |
| G16.2 (异常日志) | `HashServiceImpl.java:46-49` catch 已 log | ✅ | 见上方误报说明 |
| G16.3 (日志级别) | 业务异常 WARN，系统异常 ERROR | ✅ | — |

### Bug Pattern 核销（关键项）

| ID | 规则 | 检查结果 |
|----|------|----------|
| B007 | 禁止捕获 Throwable 吞断言 | ✅ 未发现 |
| B008 | 禁止 Executors 创建线程池 | ✅ 未使用 |
| B053 | 期望异常测试需 fail() | ✅ 使用 assertThatThrownBy |
| B076 | @Transactional 仅 public | N/A |
| B080 | 单测须含断言 | ✅ |
| M004 | 禁止 printStackTrace | ✅ 使用 logger |
| M007 | catch 非空 | ✅ |
| M020 | @Override 注解 | ✅ |

---

## §5 安全与自定义检查（Step 5）

### 安全检查

| ID | 检查项 | 结果 |
|----|--------|------|
| S1 (SQL注入) | 无 SQL | N/A |
| S2 (XSS) | 后端不渲染 HTML | N/A |
| S3 (SSRF) | 无外部请求 | N/A |
| S8 (访问控制) | 无认证需求（设计排除） | N/A |
| S9.1 (密钥硬编码) | 无密钥 | N/A |
| S10.2 (CORS 白名单) | `CorsConfig.java:22` — 从 `*` 改为具体域名 `localhost:3000` / `127.0.0.1:3000` | ✅ 安全加固 |

### 自定义扩展检查

| ID | 检查项 | 结果 |
|----|--------|------|
| U1.1 | Controller 入参使用 `@Valid` | `ToolController.java:59,74` — ✅ |

---

## §6 变更亮点

1. **CORS 安全加固**：从通配符 `*` 收紧为 `localhost:3000` / `127.0.0.1:3000` 白名单，符合 S10.2 安全最佳实践。
2. **接口解耦**：`SortService` 返回类型从 `SortServiceImpl.SortResult`（内部类）提升为独立 `SortResultVO`，消除了 Controller 对 Service 实现类的隐式依赖。
3. **防御性编程**：`HashAlgorithmEnum.fromName()` 对 null/blank 输入默认返回 SHA256，避免 NPE 并提升 API 易用性。
4. **测试覆盖充分**：空输入、null 输入、超长数组、负数、重复元素等边界场景均有测试覆盖。

---

## §7 问题汇总

| # | 等级 | 文件:行号 | 描述 |
|---|------|-----------|------|
| 1 | **P0** | `GlobalExceptionHandler.java:31-34` | `VALIDATION_ERROR_CODE_MAP` 仅映射 `"array" → "TOOL_003"`，`@Size(max=1000)` 校验失败时也返回 TOOL_003，设计文档要求 TOOL_004（数组元素过多）。需区分 `@NotEmpty` 和 `@Size` 两种校验失败场景。 |
| 2 | P2 | `GlobalExceptionHandler.java:12` | 未使用的 import `java.util.stream.Collectors` |
| 3 | P2 | `HashServiceImpl.java:31` | 使用完全限定名 `java.nio.charset.StandardCharsets.UTF_8`，建议 import 后直接使用 `StandardCharsets.UTF_8` |

---

## §8 修复任务列表

- [ ] **P0** — `GlobalExceptionHandler.java:31-34`：增加 `@Size` 超限场景到 TOOL_004 的映射。建议方案：在 `MethodArgumentNotValidException` 处理中，检查校验注解类型（`@NotEmpty` vs `@Size`）或校验消息内容来区分，将 `@Size` 失败映射为 TOOL_004。
- [ ] **P2** — `GlobalExceptionHandler.java:12`：删除未使用的 `import java.util.stream.Collectors`
- [ ] **P2** — `HashServiceImpl.java:31`：将 `java.nio.charset.StandardCharsets.UTF_8` 替换为 import + `StandardCharsets.UTF_8`

---

## §9 脚本预扫误报说明

| 规则 | 文件:行号 | 说明 |
|------|-----------|------|
| G16.2 | `HashServiceImpl.java:46` | 脚本标记为 "CatchWithoutLogging"，实际 catch 块内 `logger.error("不支持的哈希算法: {}", algorithm.getAlgorithm(), e)` 已记录异常日志并 rethrow 为 BusinessException。人工复核确认为**误报**。 |

---

*审查完成时间：2026-08-25 · 审查工具：dtazziboot-java-code-review v1.1.0*