# Code Review Checklist

> **Change** `bubble-sort` · **分支/Commit** `AI/task-DEV-b420bb03-b4cb-11f1-a23d-6d212eeaa3dd-ecd059a1-4aa2-4ff1-8280-c177eb5b09b7` · **日期** `2026-10-21`
>
> **AI**：唯一进度源；状态仅用 `⬜` `✅` `❌` `⚠️` `N/A`。
> **完成标准**：所有核销项必须从 `⬜` 变为其他状态；`N/A` 需写原因。
>
> **执行顺序（强制）**：写入本清单并进入逐文件审查前，先在目标仓库对变更路径运行 `references/script/scan-all-rules.sh`，将输出贴入 Step 3 和 Step 4 备注；再用 LLM 完成 Step 2–5 中脚本未覆盖项及复核。
>
> **预扫结果**：`scan-all-rules.sh` 对 `src/main/java/com/dt/samples/sort/BubbleSortUtil.java src/test/java/com/dt/samples/sort/BubbleSortUtilTest.java` 执行完成 — **无命中（52/222 rules scanned）**。

---

## Step 1 — 执行队列（产物 A）

| # | 文件（仓库相对路径） | 归属原因 | Step2 | Step3 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | G11 | G12 | G13 | G14 | G15 | G16 | G17 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | 总状态 |
|---|----------------------|----------|-------|-------|----|----|----|----|----|----|----|----|----|-----|----|----|----|----|----|----|----|----|----|-----|-----|-----|-----|-----|-----|-----|-----|--------|
| 1 | `src/main/java/com/dt/samples/sort/BubbleSortUtil.java` | REQ-1~4 / design | ✅ | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ |
| 2 | `src/test/java/com/dt/samples/sort/BubbleSortUtilTest.java` | REQ-5 / design | ✅ | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ |

**G1-G17 / S1-S10 均为 N/A 原因**：本次变更为纯 Java SE 冒泡排序工具类，无并发/锁（G1）、无幂等键（G2）、无事务/DB（G3）、无 SQL（G4/S1）、无 MQ（G5）、无缓存（G6）、无调度任务（G7）、无外部 I/O/线程池（G8-G9）、无接口契约变更（G10）、无资损（G12）、无国际化/多租户（G14）、无可灰度（G15）、无可监控/应急（G16-G17）、无 XSS/SSRF/命令执行/XXE/反序列化/文件操作/访问控制/CSRF（S2-S10）。

---

## Step 2 — 功能（产物 B）

> 仅从 spec/tasks 提 **REQ**，勿臆造。不符 spec 标 **P0**。

| REQ | Scenario | Spec证据（原文/章节） | 关联文件 | 状态 | 代码证据（文件/测试/接口） |
|-----|----------|----------------------|----------|------|----------------------------|
| REQ-1 | Given 未排序整数数组，When 调用 sortAscending，Then 返回升序新数组 | `docs/modules/sort/README.md:5` "提供冒泡排序算法实现，对整数数组进行升序排序"；`docs/modules/sort/README.md:22` 接口定义 | `BubbleSortUtil.java` | ✅ | `BubbleSortUtil.java:31-59` 实现冒泡排序；`BubbleSortUtilTest.java:22-31` 测试验证 |
| REQ-2 | Given null 数组，When 调用 sortAscending，Then 抛出 IllegalArgumentException | `docs/modules/sort/README.md:27` "- 异常：IllegalArgumentException - 输入为 null 时抛出" | `BubbleSortUtil.java` | ✅ | `BubbleSortUtil.java:32-33` null 检查；`BubbleSortUtilTest.java:97-101` 异常测试 |
| REQ-3 | Given 任意输入，When 调用 sortAscending，Then 原始数组不被修改（防御性拷贝） | `docs/modules/sort/README.md:26` "- 返回：升序排序后的新数组（防御性拷贝）" | `BubbleSortUtil.java` | ✅ | `BubbleSortUtil.java:36-37` `array.clone()`；`BubbleSortUtilTest.java:138-148` 防御性拷贝验证 |
| REQ-4 | 工具类设计：final class + private 构造 + 不可实例化 | `docs/ARCHITECTURE.md:29` "工具类必须 final + private 构造" | `BubbleSortUtil.java` | ✅ | `BubbleSortUtil.java:15` `public final class`；`BubbleSortUtil.java:17-18` private 构造抛异常 |
| REQ-5 | 测试覆盖：正常路径、边界值、异常、防御性拷贝，共 9 个测试方法 | `docs/modules/sort/README.md:35` "BubbleSortUtilTest \| 9 \| 正常路径、边界值、异常、防御性拷贝" | `BubbleSortUtilTest.java` | ✅ | 测试方法：L22 should_returnAscendingArray, L37 should_returnSameArray(sorted), L52 should_returnAscendingArray(desc), L67 should_returnSameArray(single), L82 should_returnEmptyArray, L97 should_throwException(null), L108 should_sortCorrectly(duplicates), L123 should_sortCorrectly(negative), L138 should_notModifyOriginalArray = 共计 9 个 |

---

## Step 3 — 可读性检查（产物 C）

对照 `references/readability-checklist.md` A1–A7 逐节核销：

| ID | 检查项 | 状态 | 备注（命中写 `path:line`） |
|----|--------|------|----------------------------|
| A1 | 源文件格式 | ✅ | A1.1 文件名=类名+`.java` ✅；A1.2 UTF-8 ✅；A1.3 使用空格缩进无 Tab ✅（scan-all-rules.sh 无命中） |
| A2 | 源文件结构/import 顺序 | ✅ | A2.1 package→import→class 空行分隔 ✅；A2.2 无 `import *` ✅；A2.3 静态/非静态 import 分组（BubbleSortUtil 无 import，BubbleSortUtilTest L3-6 静态+普通分组空行）✅；A2.4 import 字典序 ✅；A2.5 无重载方法 N/A |
| A3 | 代码样式 | ✅ | A3.1 K&R 大括号 ✅；A3.2 无空 catch/finally ✅；A3.3 4空格缩进 ✅；A3.4 行宽 ≤120 ✅；A3.5 无长方法调用链换行需要 ✅；A3.6 类成员间空行 ✅；A3.7 `if (` 空格、`} else` 空格 ✅；A3.8 运算符空格正确 ✅ |
| A4 | 命名规范 | ✅ | A4.1 包名 `com.dt.samples.sort` 全小写 ✅；A4.2 `BubbleSortUtil`/`BubbleSortUtilTest` UpperCamelCase ✅；A4.3 `sortAscending`/`swap` lowerCamelCase ✅；A4.4 无常量 ✅；A4.5 局部变量 `result`/`n`/`i`/`j`/`swapped`/`temp`/`input` lowerCamelCase ✅；A4.6 无泛型 ✅；A4.7 测试类名 `BubbleSortUtilTest` = 被测类+Test ✅ |
| A5 | 编码实践 | ✅ | A5.1 无重写方法（工具类+纯 POJO测试）✅；A5.2 无 catch 块 ✅；A5.3 静态方法通过类名调用（测试中 `BubbleSortUtil.sortAscending(...)`）✅；A5.4 无 `finalize()` ✅ |
| A6 | 特定元素样式 | ✅ | A6.1 数组 `int[] array` Java 风格 ✅；A6.2 无 switch ✅；A6.3 修饰符顺序 `public final class`/`public static int[]`/`private static void` 符合规范 ✅；A6.4 注解 `@Test` 每行一个 ✅；A6.5 无 long 字面量 ✅ |
| A7 | Javadoc 规范 | ✅ | A7.1 public 类 + public 方法均有 Javadoc（L3-14, L21-30, L61-66）✅；A7.2 `@param`→`@return`→`@throws` 顺序正确 ✅；A7.3 无简单 getter ✅；A7.4 `<p>` 分隔多段落（L6,L10,L24）✅ |

---

## Step 4 — 可靠性检查（产物 D）

> **预扫结果**：`scan-all-rules.sh` 无命中（52/222 rules scanned）。以下由 LLM 逐条核对脚本未覆盖项。

### 4.1 Bug 模式（`bug-pattern-checklist.md`）

**Blocker (B001-B081)**：

| ID | 状态 | 备注 |
|----|------|------|
| B001-B005 | N/A | 无 parse/of 字面量、无数组 equals/fill/toString/Arrays.asList |
| B006 | N/A | 测试使用 AssertJ `assertThat().containsExactly()`，无 `assertEquals` |
| B007 | N/A | 无 catch Throwable |
| B008 | N/A | 无线程池 |
| B009 | N/A | 无移位运算 |
| B010 | N/A | 无 BigDecimal |
| B011 | N/A | 无包装类型 == 比较 |
| B012 | N/A | 无 Calendar |
| B013 | N/A | 无 Calendar |
| B014 | N/A | 无集合泛型查询 |
| B015 | N/A | 无 Collection.toArray |
| B016 | N/A | 无 Comparable |
| B017 | N/A | 无 this==null |
| B018-B020 | N/A | 无三目数值/ConfusableMoneyApi/常量溢出 |
| B021 | N/A | 无 Jedis |
| B022-B023 | N/A | 无 SimpleDateFormat / 无 DeadException |
| B024 | N/A | 无 DeadThread |
| B025 | N/A | 无双括号初始化 |
| B026-B027 | N/A | 无 equals(null) / EqualsWrongThing |
| B028-B029 | N/A | 无 DateUtil / 无 setter |
| B030 | N/A | 无浮点 == 比较 |
| B031 | N/A | 无 String.format |
| B032-B034 | N/A | 无 getClass 注解 / Unsafe / Hashtable |
| B035 | N/A | 无 IdenticalBinaryExpression（swap 中 `array[i]` `array[j]` 是不同位置） |
| B036-B037 | N/A | 无 IdentityHashMap / 无可变参数 |
| B038 | N/A | 无递归 |
| B039-B041 | N/A | 无 indexOf / isInstance / JDBC |
| B042-B044 | N/A | JUnit 5，无 JUnit3/JUnit4 混用 |
| B045 | N/A | 无包装类型加锁 |
| B046 | N/A | 循环条件 `i < n-1` 正常递增 `i++` ✅ |
| B047-B050 | N/A | 无数值比较/ MathRound / 日期格式 |
| B051 | N/A | 无 Boolean.getBoolean |
| B052 | N/A | 无 YYYY 格式 |
| B053 | N/A | 异常测试用 `assertThatThrownBy()` 无需 `fail()` ✅ |
| B054-B055 | N/A | 无 EqualsTester / Mockito |
| B056 | N/A | 无 Arrays.asList |
| B057 | N/A | 无增强for修改集合 |
| B058-B060 | N/A | 无集合自操作 / nCopies / NullTernary |
| B061-B063 | N/A | JDK 21，无废弃 API |
| B064-B065 | N/A | 无 Optional / 无 setter 自赋值 |
| B066-B067 | N/A | 无 Random |
| B068 | N/A | 无自赋值（swap 中 `array[i] = array[j]` 是不同位置） |
| B069-B070 | N/A | 无 compareTo / equals 自比较 |
| B071 | N/A | 无 collection.size() >= 0 |
| B072-B074 | N/A | 无 Stream.toString / StringBuilder / substring(0) |
| B075 | N/A | for 循环 `i=0; i<n-1; i++` / `j=0; j<n-1-i; j++` 方向正确 ✅ |
| B076 | N/A | 无 @Transactional |
| B077 | N/A | 无 catch Throwable |
| B078 | N/A | 无 Truth assertThat(x).isEqualTo(x) |
| B079 | N/A | 无 @Mock |
| B080 | N/A | 所有测试方法均有断言（assertThat/assertThatThrownBy）✅ |
| B081 | N/A | 无集合原地修改 |

**Major (M001-M027)**：

| ID | 状态 | 备注 |
|----|------|------|
| M001 | N/A | 无重复 if-else |
| M002 | N/A | 无 instanceof |
| M003 | N/A | 无包装类构造器 |
| M004 | N/A | 无 printStackTrace |
| M005 | ✅ | 无内部类 |
| M006 | N/A | 无编译期常量布尔 |
| M007 | N/A | 无空 catch |
| M008-M010 | N/A | 无 equals/hashCode / EqualsIncompatibleType / 位运算 |
| M011 | N/A | 无 switch |
| M012-M014 | N/A | 无 finally / FloatCast / getClassOnEnum |
| M015 | N/A | 无子类继承 |
| M016 | N/A | 无时间API |
| M017 | N/A | 测试方法均有 @Test 注解 ✅ |
| M018 | N/A | 无 Lock |
| M019 | N/A | 无 switch 枚举 |
| M020 | N/A | `BubbleSortUtil` 是工具类无继承；测试类无重写方法 ✅ |
| M021 | N/A | 无 equals |
| M022 | N/A | 无 Optional |
| M023 | N/A | 无 Object.toString |
| M024 | N/A | 无 Optional |
| M025 | N/A | 无 final 类 protected 成员 |
| M026 | N/A | 无 @Mock |
| M027 | N/A | 无 ThreadLocal |

**Info (I001-I010)**：

| ID | 状态 | 备注 |
|----|------|------|
| I001 | ✅ | 异常测试使用 `assertThatThrownBy().isInstanceOf().hasMessageContaining()`，有详细断言 ✅（L99-101） |
| I002-I003 | N/A | 无 @DoNotMock / @AutoValue |
| I004 | N/A | 无 java.util.Date |
| I005-I008 | N/A | JUnit 5，无 JUnit3/JUnit4 特性 |
| I009 | N/A | 统计用，不适用 |
| I010 | N/A | 无 Spring/Pandora 容器 |

### 4.2 可靠性（`reliability-checklist.md`）

| ID | 状态 | 备注 |
|----|------|------|
| G1.1-G1.4 | N/A | 无并发/锁场景 |
| G2.1-G2.3 | N/A | 无幂等键场景 |
| G3.1-G3.2 | N/A | 无事务/DB 访问 |
| G4.1-G4.3 | N/A | 无 SQL |
| G5.1 | N/A | 无 MQ |
| G6.1-G6.2 | N/A | 无缓存 |
| G7.1-G7.2 | N/A | 无调度任务 |
| G8.1 | N/A | 无 catch 吞异常（仅 throw 新异常） |
| G8.2 | N/A | 无外部依赖 |
| G8.3 | N/A | 无 I/O 流/连接/锁 |
| G8.4-G8.7 | N/A | 无线程池/ThreadLocal |
| G9.1-G9.3 | N/A | 无 RPC/HTTP/DB/Redis 调用 |
| G10.1-G10.2 | N/A | 无接口契约变更 |
| G11.1 | ✅ | 9 个测试方法均有断言 ✅ |
| G11.2 | ✅ | 覆盖空数组(L82)、单元素(L67)、重复元素(L108)、负数(L123)、已有序(L37)、逆序(L52) ✅ |
| G11.3 | ✅ | null 入参：`BubbleSortUtil.java:32-33` 抛出 `IllegalArgumentException` ✅ |
| G11.4 | N/A | 无金额/数值运算（纯比较+交换） |
| G12.1-G12.2 | N/A | 无资损场景 |
| G13.1 | N/A | 无日志输出 |
| G14.1-G14.4 | N/A | 无金额/多租户/时区 |
| G15.1-G15.3 | N/A | 无可灰度场景 |
| G16.1-G16.4 | N/A | 无日志/监控（纯工具类） |
| G17.1-G17.3 | N/A | 无可应急场景 |
| G18.1-G18.3 | N/A | 安全补强项不适用（纯 Java SE 无外部依赖） |

### 4.3 安全（`security-checklist.md`）

| ID | 状态 | 备注 |
|----|------|------|
| S1.1-S1.3 | N/A | 无 SQL |
| S2.1-S2.3 | N/A | 无 Web 输出 |
| S3.1-S3.3 | N/A | 无外部 URL 请求 |
| S4.1-S4.2 | N/A | 无命令执行 |
| S5.1-S5.2 | N/A | 无 XML 解析 |
| S6.1-S6.3 | N/A | 无序列化 |
| S7.1-S7.3 | N/A | 无文件上传/下载 |
| S8.1-S8.4 | N/A | 无 Web 接口/访问控制 |
| S9.1-S9.4 | N/A | 无密钥/凭证/敏感日志/加密 |
| S10.1-S10.3 | N/A | 无 CSRF/CORS/跳转 |

---

## Step 5 — 自定义扩展检查（产物 E）

按 `customized-checklist.md` 逐条核销；该文件仅含示例项 U1.1，无实际启用的自定义规则。

| ID | 状态 | 备注 |
|----|------|------|
| U1.1 | N/A | 示例项（Controller @Valid），本次无 Controller |
| U1.2 | N/A | 未定义 |
| U1.3 | N/A | 未定义 |
| U2.1 | N/A | 未定义 |
| U2.2 | N/A | 未定义 |
| U2.3 | N/A | 未定义 |

**总体**：N/A(未启用自定义规则)

---

## 终检（防漏检）

- [x] 执行队列中每个文件 `Step2`、`Step3`、**S1–S10 / G1–G17** 各列均非 `⬜`（跳过文件除外）
- [x] Step 2 的每个 REQ/Scenario 均非 `⬜`
- [x] Step 3 的 A1–A7 均非 `⬜`
- [x] Step 4 全部 **G/S** 与 **B001–B081 / M001–M027 / I001–I010** ID 均非 `⬜`（允许 `N/A`，但有原因）
- [x] Step 5 全部 U* ID 均非 `⬜`（允许 `N/A(未启用自定义规则)`）
- [x] 所有 `❌/⚠️` 已写入 report（本次无 ❌/⚠️）