# Code Review Report

> **Change** 三个接口 helloworld/哈希/冒泡排序 + 导出 · **分支/Commit** `AI/task-DEV-9d10e310-7901-11f1-8a9f-59ecae612580-68222c1d-64d9-4304-ab42-224eeb6b9f49` / `vs origin/main` · **日期** 2026-08-18 · **审查者** AI
>
> **AI**：等级 **P0 / P1 / P2**；G/S 以 checklist 行内定义为准；Bug 模式以 `bug-pattern-checklist.md` 表头为准（Blocker→P0、Major→P1、Info→P2）。**已先**运行 `scan-all-rules.sh` 并将要点并入 §5，**再**写 LLM 结论。问题须含 `path:line` 或清单 ID。

---

## 1. 审查范围

| 项 | 值 |
|----|-----|
| `.java` 文件数 | 12 |
| 变更行数 | `+847 / -0` |

| 类/接口 | 路径 | 角色 |
|---------|------|------|
| `DemoApplication` | `src/main/java/com/example/demo/DemoApplication.java` | Spring Boot 入口 |
| `ApiResponse` | `src/main/java/com/example/demo/common/ApiResponse.java` | 统一响应包装 |
| `DemoException` | `src/main/java/com/example/demo/common/exception/DemoException.java` | 业务异常 |
| `DemoController` | `src/main/java/com/example/demo/controller/DemoController.java` | REST 控制器 |
| `ExportRequest` | `src/main/java/com/example/demo/model/request/ExportRequest.java` | 导出请求 DTO |
| `HashRequest` | `src/main/java/com/example/demo/model/request/HashRequest.java` | 哈希请求 DTO |
| `SortRequest` | `src/main/java/com/example/demo/model/request/SortRequest.java` | 排序请求 DTO |
| `DemoService` | `src/main/java/com/example/demo/service/DemoService.java` | 服务接口 |
| `DemoServiceImpl` | `src/main/java/com/example/demo/service/impl/DemoServiceImpl.java` | 服务实现 |
| `DemoServiceTest` | `src/test/java/com/example/demo/service/DemoServiceTest.java` | 单元测试 |
| `pom.xml` | `pom.xml` | Maven 构建 |
| `application.properties` | `src/main/resources/application.properties` | 应用配置 |

---

## 2. 问题计数

| P0 | P1 | P2 |
|----|----|-----|
| 0 | 2 | 4 |

---

## 3. Step 2 — 功能（REQ）

> REQ 来源：`design.md` §1 需求功能清单 + §5.1.2 接口详细设计

### F01: HelloWorld 接口

| Scenario | 结果 | Spec 证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| GET /api/demo/hello 返回问候语 | ✅ | design.md L243-L280: "URI: GET /api/demo/hello, 返回问候语" | `DemoController.java:43-51` | 返回 `{"code":"200","data":{"message":"Hello, World!"}}`，与 spec 一致 |
| 无入参 | ✅ | design.md L247: "入参: 无" | `DemoController.java:43-44` | `@GetMapping("/hello")` 无参 |
| 错误码 DEMO_005 | ✅ | design.md L262: "DEMO_005 系统内部错误" | `DemoController.java:55-57` | 通用异常捕获返回 DEMO_005 |

### F02: 哈希算法接口

| Scenario | 结果 | Spec 证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| POST /api/demo/hash 计算哈希 | ✅ | design.md L286-L337: "URI: POST /api/demo/hash" | `DemoController.java:67-68` | 路径与方法一致 |
| 入参 input(必填)、algorithm(可选) | ✅ | design.md L290-L293 | `HashRequest.java:9,12` | 字段匹配 |
| R02: input 不能为空 | ✅ | design.md L517: "返回 DEMO_001" | `DemoServiceImpl.java:37-39` | 空值校验抛 DEMO_001 |
| R03: algorithm 仅支持 SHA-256/MD5 | ✅ | design.md L518: "返回 DEMO_002" | `DemoServiceImpl.java:47-49` | 不支持的算法抛 DEMO_002 |
| R04: 输入长度 ≤ 10000 | ✅ | design.md L519: "返回 DEMO_001" | `DemoServiceImpl.java:40-42` | 长度校验抛 DEMO_001 |
| 默认算法 SHA-256 | ✅ | design.md L292: "默认 SHA-256" | `DemoServiceImpl.java:44-45` | algorithm 为空时默认 SHA-256 |
| 出参含 input/algorithm/hash | ✅ | design.md L302-L304 | `DemoController.java:77-80` | 三个字段均返回 |

### F03: 冒泡排序接口

| Scenario | 结果 | Spec 证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| POST /api/demo/bubble-sort | ✅ | design.md L343-L391: "URI: POST /api/demo/bubble-sort" | `DemoController.java:99-100` | 路径与方法一致 |
| 入参 array(int[] 必填) | ✅ | design.md L349 | `SortRequest.java:9` | 字段匹配 |
| R05: array 不能为空 | ✅ | design.md L561: "返回 DEMO_001" | `DemoServiceImpl.java:71-73` | 空数组校验抛 DEMO_001 |
| R06: array 长度 ≤ 1000 | ✅ | design.md L562: "返回 DEMO_001" | `DemoServiceImpl.java:74-76` | 长度校验抛 DEMO_001 |
| R07: 元素必须为整数 | ✅ | design.md L563 | `SortRequest.java:9` (`int[]`) | Jackson 反序列化自动校验类型 |
| 出参含 original/sorted/steps | ✅ | design.md L358-L360 | `DemoController.java:109-112` | 三个字段均返回 |

### F04/F05: 前端展示与导出按钮

> 前端代码在 testDJnew 仓库（`demo-tools.html`），不在本次 Java 审查范围内。**N/A**。

### F06: 导出接口

| Scenario | 结果 | Spec 证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| POST /api/demo/export | ✅ | design.md L397-L449: "URI: POST /api/demo/export" | `DemoController.java:131-132` | 路径与方法一致 |
| 入参 type(必填)/format(可选)/data(必填) | ✅ | design.md L401-L405 | `ExportRequest.java:11,14,17` | 字段匹配 |
| R08: type 必须为 hello/hash/sort | ✅ | design.md L604: "返回 DEMO_001" | `DemoServiceImpl.java:99-101` | 类型校验抛 DEMO_001 |
| R09: format 仅 json/csv | ✅ | design.md L605: "返回 DEMO_004" | `DemoServiceImpl.java:107-109` | 格式校验抛 DEMO_004 |
| R10: data 不能为空 | ✅ | design.md L606: "返回 DEMO_001" | `DemoServiceImpl.java:102-104` | 空值校验抛 DEMO_001 |
| Content-Type 根据 format 设置 | ✅ | design.md L425-L426 | `DemoController.java:138-140` | JSON→application/json, CSV→text/csv |
| Content-Disposition 附件下载 | ✅ | design.md L411: "文件下载流" | `DemoController.java:146-147` | 设置 attachment header |

### 功能核对结论

所有 6 个需求功能点（F01–F06，其中 F04/F05 前端侧不适用）均与 spec 一致，**无功能偏差**。✅

---

## 4. Step 3 — 可读性检查

> 参考 `references/readability-checklist.md` A1–A7

| 域 | 结果 | 说明 |
|----|------|------|
| A1 源文件格式 | ✅ | 文件名与类名一致，UTF-8 编码，无 Tab 字符 |
| A2 源文件结构 | ✅ | package→import→class 顺序正确，无 `import *`，import 分组合理 |
| A3 代码样式 | ✅ | K&R 大括号，4 空格缩进，行宽 ≤ 120，运算符空格正确 |
| A4 命名规范 | ✅ | 类名 UpperCamelCase，方法 lowerCamelCase，常量 UPPER_SNAKE_CASE（`LOGGER`、`MAX_INPUT_LENGTH`），测试类 `DemoServiceTest` |
| A5 编码实践 | ✅ | `@Override` 正确标注，无空 catch 块，无 `finalize()` 重写 |
| A6 特定元素样式 | ✅ | `int[]` 风格，long 无涉及，修饰符顺序正确 |
| A7 Javadoc 规范 | ✅ | public 类/接口/方法均有 Javadoc，getter 按规范省略 |

**可读性结论：全部通过，无违规。** ✅

---

## 5. Step 4 — 可靠性检查

| 域 | 参考 | 结果 | 等级 | 说明 |
|----|------|------|------|------|
| G1 并发控制 | `reliability-checklist.md` | N/A | — | 无共享可变状态，无并发场景 |
| G2 幂等拦截 | `reliability-checklist.md` | N/A | — | 纯读/计算接口，无写操作 |
| G3 事务控制 | `reliability-checklist.md` | N/A | — | 无数据库操作 |
| G4 SQL 与索引 | `reliability-checklist.md` | N/A | — | 无 SQL |
| G5 消息 (MQ) | `reliability-checklist.md` | N/A | — | 无消息队列 |
| G6 缓存 | `reliability-checklist.md` | N/A | — | 无缓存 |
| G7 调度任务 | `reliability-checklist.md` | N/A | — | 无定时任务 |
| G8 防御编程 | `reliability-checklist.md` | ✅ | — | 无 I/O 流/连接/锁，无 ThreadLocal，无自定义线程池 |
| G9 网络调用 | `reliability-checklist.md` | N/A | — | 无外部 RPC/HTTP 调用 |
| G10 接口契约 | `reliability-checklist.md` | ✅ | — | 字段语义清晰，`null` 仅表示"无数据" |
| G11 开发自测 | `reliability-checklist.md` | ✅ | — | 有单测覆盖正常/边界/异常场景，空值校验到位 |
| G12 资损防控 | `reliability-checklist.md` | N/A | — | 无资金场景 |
| G13 监控核对 | `reliability-checklist.md` | ✅ | — | 日志级别正确：info 成功 / error 异常 |
| G14 国际化/多租户/时区 | `reliability-checklist.md` | N/A | — | 演示项目不涉及 |
| G15 可灰度 | `reliability-checklist.md` | ⚠️ | P2 | G15.3 — 设计文档（§7.3）要求 `@ConditionalOnProperty` 开关，但代码未实现；`application.properties` 有 `demo.enabled=true` 但无代码消费 |
| G16 可监控 | `reliability-checklist.md` | ⚠️ | P1 | **G16.2** — `DemoServiceImpl.java:64` catch `NoSuchAlgorithmException` 未记录日志直接抛异常；`DemoServiceImpl.java:126` catch `Exception` 未记录日志直接抛异常。Controller 层所有 catch 块均有日志，无问题 |
| G17 可应急 | `reliability-checklist.md` | ⚠️ | P2 | G17.1 — 开关未实现（同 G15.3） |

| 域 | 参考 | 结果 | 等级 | 说明 |
|----|------|------|------|------|
| S1 SQL 注入 | `security-checklist.md` | N/A | — | 无 SQL |
| S2 XSS | `security-checklist.md` | N/A | — | 后端无 HTML 渲染 |
| S3 SSRF | `security-checklist.md` | N/A | — | 无外部 URL 请求 |
| S4 命令执行 | `security-checklist.md` | N/A | — | 无命令执行 |
| S5 XXE | `security-checklist.md` | N/A | — | 无 XML 解析 |
| S6 反序列化 | `security-checklist.md` | ✅ | — | 使用 Spring 默认 Jackson，无自定义反序列化 |
| S7 文件上传/下载 | `security-checklist.md` | ✅ | — | S7.2 — 导出文件名由 `type` 参数拼接，但 `type` 已做白名单校验（hello/hash/sort），无目录穿越风险 |
| S8 访问控制 | `security-checklist.md` | N/A | — | 演示项目无鉴权（design.md §6.4 明确排除） |
| S9 数据安全 | `security-checklist.md` | ✅ | — | 无密钥硬编码，日志不记录敏感信息 |
| S10 CSRF/CORS | `security-checklist.md` | ⚠️ | P2 | S10.1 — POST 接口无 CSRF Token 防护（演示项目可接受） |

| 域 | 参考 | 结果 | 等级 | 说明 |
|----|------|------|------|------|
| Bug 模式 | `bug-pattern-checklist.md` B/M/I（120） | ⚠️ | — | **预扫**：`scan-all-rules.sh` 输出 10 条命中，均标记为 G16.2。经人工复核：8 条为误报（Controller catch 块均有日志），2 条真实（`DemoServiceImpl.java:64`、`:126`）。LLM 补扫未发现其他 B/M/I 命中 |

---

## 6. Step 5 — 自定义扩展检查

| 域 | 参考 | 结果 | 等级 | 说明 |
|----|------|------|------|------|
| 自定义扩展 | `customized-checklist.md` U* | N/A | — | 未启用自定义规则 |

---

## 7. 结论

- **合并建议**：修复后合并（无 P0 阻塞项，2 个 P1 建议修复）
- **P0**：无
- **P1**：
  1. `DemoServiceImpl.java:64` — catch `NoSuchAlgorithmException` 未记录日志即抛异常，排障可观测性不足
  2. `DemoServiceImpl.java:126` — catch `Exception` 未记录日志即抛异常，排障可观测性不足
- **P2**：
  1. `DemoController.java:107` — `countBubbleSortSteps` 与 `DemoServiceImpl.bubbleSort` 冒泡排序逻辑重复
  2. `DemoController.java:154` — 手动拼接 JSON 字符串，特殊字符（引号/反斜杠）未转义
  3. `DemoController.java:28` — 设计文档要求的 `@ConditionalOnProperty` 开关未实现
  4. `DemoController.java:99` — POST 接口无 CSRF 防护（演示项目可接受）
- **一句话**：代码功能完整覆盖 spec 全部需求，结构清晰，可读性优秀；存在 2 处日志缺失（P1）和 4 处可改进项（P2），无阻塞性问题，建议修复 P1 后合并。

---

## 7.1 问题片段（必填）

### P1 问题

- **P1** `G16.2` `src/main/java/com/example/demo/service/impl/DemoServiceImpl.java:64` — catch `NoSuchAlgorithmException` 未记录日志，直接抛异常，线上排障时无法确认异常上下文。

  片段范围：`src/main/java/com/example/demo/service/impl/DemoServiceImpl.java:51-66`

```java
L51|        try {
L52|            MessageDigest md = MessageDigest.getInstance(resolvedAlgorithm);
L53|            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
L54|            StringBuilder hexString = new StringBuilder();
L55|            for (byte b : digest) {
L56|                String hex = Integer.toHexString(0xff & b);
L57|                if (hex.length() == 1) {
L58|                    hexString.append('0');
L59|                }
L60|                hexString.append(hex);
L61|            }
L62|            LOGGER.info("DemoService.hash completed, algorithm={}, inputLength={}", resolvedAlgorithm, input.length());
L63|            return hexString.toString();
L64|        } catch (NoSuchAlgorithmException e) {
L65|            throw new DemoException("DEMO_005", "系统内部错误：" + e.getMessage());
L66|        }
```

- **P1** `G16.2` `src/main/java/com/example/demo/service/impl/DemoServiceImpl.java:126` — catch `Exception` 未记录日志，直接抛异常，JSON 序列化失败时无法定位原因。

  片段范围：`src/main/java/com/example/demo/service/impl/DemoServiceImpl.java:118-128`

```java
L118|    private byte[] exportAsJson(String type, Map<String, Object> data) {
L119|        try {
L120|            Map<String, Object> result = new LinkedHashMap<>();
L121|            result.put("type", type);
L122|            result.putAll(data);
L123|            String json = OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(result);
L124|            LOGGER.info("DemoService.export JSON, type={}", type);
L125|            return json.getBytes(StandardCharsets.UTF_8);
L126|        } catch (Exception e) {
L127|            throw new DemoException("DEMO_005", "JSON 序列化失败：" + e.getMessage());
L128|        }
```

### P2 问题

- **P2** `代码重复` `src/main/java/com/example/demo/controller/DemoController.java:163-178` — `countBubbleSortSteps` 方法与 `DemoServiceImpl.bubbleSort:78-88` 冒泡排序核心逻辑完全重复，应统一收口到 Service 层。

  片段范围：`src/main/java/com/example/demo/controller/DemoController.java:163-178`

```java
L163|    private int countBubbleSortSteps(int[] array) {
L164|        int[] copy = java.util.Arrays.copyOf(array, array.length);
L165|        int steps = 0;
L166|        int n = copy.length;
L167|        for (int i = 0; i < n - 1; i++) {
L168|            for (int j = 0; j < n - i - 1; j++) {
L169|                if (copy[j] > copy[j + 1]) {
L170|                    int temp = copy[j];
L171|                    copy[j] = copy[j + 1];
L172|                    copy[j + 1] = temp;
L173|                    steps++;
L174|                }
L175|            }
L176|        }
L177|        return steps;
L178|    }
```

- **P2** `手动拼接 JSON` `src/main/java/com/example/demo/controller/DemoController.java:154` — 导出接口异常时手动拼接 JSON 字符串，若 `e.getMessage()` 含双引号或反斜杠会导致 JSON 格式错误。

  片段范围：`src/main/java/com/example/demo/controller/DemoController.java:150-154`

```java
L150|        } catch (DemoException e) {
L151|            LOGGER.error("POST /api/demo/export error: {}", e.getMessage());
L152|            return ResponseEntity.badRequest()
L153|                    .contentType(MediaType.APPLICATION_JSON)
L154|                    .body(("{\"code\":\"" + e.getErrorCode() + "\",\"msg\":\"" + e.getMessage() + "\"}").getBytes());
```

- **P2** `G15.3` `src/main/java/com/example/demo/controller/DemoController.java:28` — 设计文档 §7.3 要求 `@ConditionalOnProperty` 开关（`demo.enabled`），`application.properties` 已配置 `demo.enabled=true`，但 Controller 未添加注解，开关不生效。

  片段范围：`src/main/java/com/example/demo/controller/DemoController.java:26-28`

```java
L26|@RestController
L27|@RequestMapping("/api/demo")
L28|public class DemoController {
```

---

## 8. 修复任务列表

### P0

- 无待修复项。

### P1

- [ ] **P1** `src/main/java/com/example/demo/service/impl/DemoServiceImpl.java:64` — 在 catch `NoSuchAlgorithmException` 块内 `throw` 前添加 `LOGGER.error("不支持的算法: {}", resolvedAlgorithm, e)`
- [ ] **P1** `src/main/java/com/example/demo/service/impl/DemoServiceImpl.java:126` — 在 catch `Exception` 块内 `throw` 前添加 `LOGGER.error("JSON 序列化失败, type={}", type, e)`

### P2

- [ ] **P2** `src/main/java/com/example/demo/controller/DemoController.java:163-178` — 将 `countBubbleSortSteps` 逻辑合并到 `DemoServiceImpl.bubbleSort`，返回包含 steps 的结果对象，消除代码重复
- [ ] **P2** `src/main/java/com/example/demo/controller/DemoController.java:154` — 使用 `ObjectMapper` 或 `ApiResponse` 序列化替代手动拼接 JSON 字符串
- [ ] **P2** `src/main/java/com/example/demo/controller/DemoController.java:28` — 在类上添加 `@ConditionalOnProperty(name = "demo.enabled", havingValue = "true")` 实现功能开关
- [ ] **P2** `src/main/java/com/example/demo/controller/DemoController.java:99` — 评估是否为演示项目添加 CSRF 防护（按 design.md §6.4 排除范围，可择机处理）