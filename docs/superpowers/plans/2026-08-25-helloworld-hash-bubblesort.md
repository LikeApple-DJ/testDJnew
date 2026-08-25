# HelloWorld / 哈希算法 / 冒泡排序 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 testDJnew 后端实现三个 REST API（HelloWorld、哈希算法、冒泡排序），为 ykstest 前端实现一个三 Tab 单页面展示执行结果。

**Architecture:** testDJnew 为 Spring Boot 3 后端（单 Controller），暴露三个 JSON API；ykstest 为 React 前端，通过三个 Tab 组件调用后端 API 并展示结果。前后端通过 CORS 跨域通信，统一使用 `application/json`。

**Tech Stack:** Java 17+, Spring Boot 3.2+, Maven 3.8+, JUnit 5, React 18+, create-react-app, fetch API

---

## 跨仓依赖与现状摘要

| 仓库 | 角色 | 现状 | 依赖 |
|------|------|------|------|
| `[testDJnew]` | 后端 | 空仓库（仅 docs/） | Spring Boot 3.x, Maven |
| `[ykstest]` | 前端 | 空仓库（仅 README.md） | Node.js 18+, React 18+ |

**仓间对齐点**（来自设计文档第4节）：
- API Base URL: 前端默认 `http://localhost:8080`
- CORS: 后端全局开启
- Content-Type: `application/json`
- 错误格式: `{ "error": "message" }`

---

## Global Constraints

- 后端端口 `8080`，前端端口 `3000`
- 冒泡排序升序，`steps` 包含每轮结束状态和 `swapped` 标志
- HelloWorld 版本号硬编码 `1.0.0`
- 哈希算法支持 `MD5`、`SHA-1`、`SHA-256`（大小写不敏感）
- 空数组排序返回 400，不支持的哈希算法返回 400
- 不允许 TBD、TODO 占位；所有代码步骤提供完整代码

---

## File Structure

### [testDJnew] 后端

| 文件 | 职责 | 操作 |
|------|------|------|
| `pom.xml` | Maven 依赖与构建配置 | 新建 |
| `src/main/java/com/testdjnew/Application.java` | Spring Boot 入口 | 新建 |
| `src/main/java/com/testdjnew/controller/AlgorithmController.java` | 三个 REST 端点 | 新建 |
| `src/main/resources/application.properties` | CORS 与端口配置 | 新建 |
| `src/test/java/com/testdjnew/controller/AlgorithmControllerTest.java` | 集成测试 | 新建 |

### [ykstest] 前端

| 文件 | 职责 | 操作 |
|------|------|------|
| `src/App.js` | Tab 导航 + 路由状态 | 修改 |
| `src/App.css` | 布局样式 | 修改 |
| `src/services/api.js` | API 调用封装 | 新建 |
| `src/components/HelloWorldTab.js` | HelloWorld Tab 内容 | 新建 |
| `src/components/HashTab.js` | 哈希算法 Tab 内容 | 新建 |
| `src/components/BubbleSortTab.js` | 冒泡排序 Tab 内容 | 新建 |

---

## Task 1: 脚手架 — Spring Boot 后端项目

**Files:**
- Create: `[testDJnew] pom.xml`
- Create: `[testDJnew] src/main/java/com/testdjnew/Application.java`
- Create: `[testDJnew] src/main/resources/application.properties`

**Interfaces:**
- Consumes: 无
- Produces: 可运行的 Spring Boot 应用，端口 8080，CORS 全局开放

- [ ] **Step 1: 创建 pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.testdjnew</groupId>
    <artifactId>testdjnew</artifactId>
    <version>1.0.0</version>
    <name>testDJnew</name>
    <description>Backend API for HelloWorld, Hash, and BubbleSort</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: 创建目录结构并保存 Application.java**

```bash
cd /path/to/testDJnew
mkdir -p src/main/java/com/testdjnew/controller
mkdir -p src/main/resources
mkdir -p src/test/java/com/testdjnew/controller
```

```java
package com.testdjnew;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

- [ ] **Step 3: 创建 application.properties**

```properties
server.port=8080
```

- [ ] **Step 4: 创建 CORS 配置类**

File: `src/main/java/com/testdjnew/config/CorsConfig.java`

```java
package com.testdjnew.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST")
                        .allowedHeaders("*");
            }
        };
    }
}
```

- [ ] **Step 5: 验证项目可编译**

```bash
cd /path/to/testDJnew
mvn compile
```

Expected: `BUILD SUCCESS`

- [ ] **Step 6: 验证应用可启动**

```bash
mvn spring-boot:run &
sleep 10
curl http://localhost:8080/actuator 2>/dev/null || echo "App started (no actuator, expected)"
kill %1 2>/dev/null
```

Expected: 无错误退出，应用正常启动。

---

## Task 2: 实现 HelloWorld 端点

**Files:**
- Create: `[testDJnew] src/main/java/com/testdjnew/controller/AlgorithmController.java`
- Create: `[testDJnew] src/test/java/com/testdjnew/controller/AlgorithmControllerTest.java`

**Interfaces:**
- Consumes: Task 1 的 Spring Boot 脚手架
- Produces: `GET /api/hello` → `{"message":"Hello, World!","timestamp":"<ISO8601>","version":"1.0.0"}`

- [ ] **Step 1: 编写 AlgorithmController（含 HelloWorld 端点）**

```java
package com.testdjnew.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AlgorithmController {

    @GetMapping("/hello")
    public Map<String, Object> hello() {
        return Map.of(
            "message", "Hello, World!",
            "timestamp", Instant.now().toString(),
            "version", "1.0.0"
        );
    }
}
```

- [ ] **Step 2: 编写 HelloWorld 测试**

```java
package com.testdjnew.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AlgorithmControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void hello_shouldReturnMessageAndVersion() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Hello, World!"))
            .andExpect(jsonPath("$.version").value("1.0.0"))
            .andExpect(jsonPath("$.timestamp").exists());
    }
}
```

- [ ] **Step 3: 运行测试**

```bash
cd /path/to/testDJnew
mvn test -Dtest=AlgorithmControllerTest#hello_shouldReturnMessageAndVersion
```

Expected: `Tests run: 1, Failures: 0, Errors: 0, Skipped: 0` — PASS

- [ ] **Step 4: 启动应用并手动验证**

```bash
mvn spring-boot:run &
sleep 10
curl -s http://localhost:8080/api/hello | python3 -m json.tool
kill %1 2>/dev/null
```

Expected: JSON 包含 `message`, `timestamp`, `version` 三个字段。

---

## Task 3: 实现哈希端点

**Files:**
- Modify: `[testDJnew] src/main/java/com/testdjnew/controller/AlgorithmController.java` — 追加 hash 方法
- Modify: `[testDJnew] src/test/java/com/testdjnew/controller/AlgorithmControllerTest.java` — 追加 hash 测试

**Interfaces:**
- Consumes: Task 2 的 Controller
- Produces: `POST /api/hash` → `{"algorithm":"SHA-256","input":"hello","hash":"2cf24dba..."}`; 400 on unsupported algorithm

- [ ] **Step 1: 在 AlgorithmController 中追加 hash 方法与 DTO**

在文件开头追加 import：

```java
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
```

在类内部追加 DTO 和端点：

```java
    public record HashRequest(String algorithm, String input) {}
    public record HashResponse(String algorithm, String input, String hash) {}
    public record ErrorResponse(String error) {}

    @PostMapping("/hash")
    public ResponseEntity<?> hash(@RequestBody HashRequest request) {
        String algo = request.algorithm().toUpperCase().replace("-", "");
        if (!algo.equals("MD5") && !algo.equals("SHA1") && !algo.equals("SHA256")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Unsupported algorithm: " + request.algorithm()));
        }

        try {
            String javaAlgo = algo.equals("SHA1") ? "SHA-1" : algo.equals("SHA256") ? "SHA-256" : "MD5";
            MessageDigest md = MessageDigest.getInstance(javaAlgo);
            byte[] digest = md.digest(request.input().getBytes());
            String hex = HexFormat.of().formatHex(digest);

            return ResponseEntity.ok(new HashResponse(
                request.algorithm(), request.input(), hex
            ));
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Hash algorithm not available: " + request.algorithm()));
        }
    }
```

- [ ] **Step 2: 追加哈希测试到 AlgorithmControllerTest**

在测试类中追加 import：

```java
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.hamcrest.Matchers.is;
```

追加测试方法：

```java
    @Test
    void hash_sha256_shouldReturnCorrectHash() throws Exception {
        String requestBody = "{\"algorithm\":\"SHA-256\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.algorithm").value("SHA-256"))
            .andExpect(jsonPath("$.input").value("hello"))
            .andExpect(jsonPath("$.hash").value("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"));
    }

    @Test
    void hash_md5_shouldReturnCorrectHash() throws Exception {
        String requestBody = "{\"algorithm\":\"MD5\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hash").value("5d41402abc4b2a76b9719d911017c592"));
    }

    @Test
    void hash_sha1_shouldReturnCorrectHash() throws Exception {
        String requestBody = "{\"algorithm\":\"SHA-1\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hash").value("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"));
    }

    @Test
    void hash_unsupportedAlgorithm_shouldReturn400() throws Exception {
        String requestBody = "{\"algorithm\":\"RIPEMD-160\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Unsupported algorithm: RIPEMD-160"));
    }

    @Test
    void hash_caseInsensitive_shouldWork() throws Exception {
        String requestBody = "{\"algorithm\":\"sha-256\",\"input\":\"test\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.algorithm").value("sha-256"));
    }
```

- [ ] **Step 3: 运行所有测试**

```bash
cd /path/to/testDJnew
mvn test
```

Expected: `Tests run: 6, Failures: 0, Errors: 0, Skipped: 0` — PASS

- [ ] **Step 4: 手动验证哈希端点**

```bash
mvn spring-boot:run &
sleep 10
curl -s -X POST http://localhost:8080/api/hash \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"SHA-256","input":"hello"}' | python3 -m json.tool
kill %1 2>/dev/null
```

Expected: `hash` 值为 `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`

---

## Task 4: 实现冒泡排序端点

**Files:**
- Modify: `[testDJnew] src/main/java/com/testdjnew/controller/AlgorithmController.java` — 追加 sort 方法
- Modify: `[testDJnew] src/test/java/com/testdjnew/controller/AlgorithmControllerTest.java` — 追加 sort 测试

**Interfaces:**
- Consumes: Task 3 的 Controller
- Produces: `POST /api/sort` → `{"sorted":[...],"steps":[...]}`; 400 on empty array

- [ ] **Step 1: 在 AlgorithmController 中追加 sort 方法与 DTO**

在类内部追加：

```java
    public record SortRequest(int[] numbers) {}
    public record SortStep(int pass, int[] array, boolean swapped) {}
    public record SortResponse(int[] sorted, java.util.List<SortStep> steps) {}

    @PostMapping("/sort")
    public ResponseEntity<?> sort(@RequestBody SortRequest request) {
        if (request.numbers() == null || request.numbers().length == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("numbers array must not be empty"));
        }

        int[] arr = request.numbers().clone();
        int n = arr.length;
        java.util.List<SortStep> steps = new java.util.ArrayList<>();

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            steps.add(new SortStep(i + 1, arr.clone(), swapped));
            if (!swapped) {
                break;
            }
        }

        return ResponseEntity.ok(new SortResponse(arr, steps));
    }
```

- [ ] **Step 2: 追加冒泡排序测试到 AlgorithmControllerTest**

注意：Java 中 `int[]` 在 JSON path 断言中使用 `$.sorted[0]` 等。

```java
    @Test
    void sort_basicArray_shouldReturnSortedWithSteps() throws Exception {
        String requestBody = "{\"numbers\":[5,3,8,1,2]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(1))
            .andExpect(jsonPath("$.sorted[1]").value(2))
            .andExpect(jsonPath("$.sorted[2]").value(3))
            .andExpect(jsonPath("$.sorted[3]").value(5))
            .andExpect(jsonPath("$.sorted[4]").value(8))
            .andExpect(jsonPath("$.steps.length()").value(4))
            .andExpect(jsonPath("$.steps[0].pass").value(1))
            .andExpect(jsonPath("$.steps[0].swapped").value(true))
            .andExpect(jsonPath("$.steps[3].swapped").value(false));
    }

    @Test
    void sort_emptyArray_shouldReturn400() throws Exception {
        String requestBody = "{\"numbers\":[]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("numbers array must not be empty"));
    }

    @Test
    void sort_singleElement_shouldReturnSameArray() throws Exception {
        String requestBody = "{\"numbers\":[42]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(42))
            .andExpect(jsonPath("$.steps.length()").value(0));
    }
```

- [ ] **Step 3: 运行全部测试**

```bash
cd /path/to/testDJnew
mvn test
```

Expected: `Tests run: 9, Failures: 0, Errors: 0, Skipped: 0` — PASS

- [ ] **Step 4: 手动验证排序端点**

```bash
mvn spring-boot:run &
sleep 10
curl -s -X POST http://localhost:8080/api/sort \
  -H "Content-Type: application/json" \
  -d '{"numbers":[5,3,8,1,2]}' | python3 -m json.tool
kill %1 2>/dev/null
```

Expected: `sorted` 为 `[1,2,3,5,8]`，`steps` 包含 4 个步骤。

---

## Task 5: 脚手架 — React 前端项目

**Files:**
- Scaffold via `create-react-app` in `[ykstest]`

**Interfaces:**
- Consumes: 无
- Produces: 可运行的 React 应用，端口 3000

- [ ] **Step 1: 使用 create-react-app 创建项目**

```bash
cd /path/to/ykstest-parent
npx create-react-app ykstest
cd ykstest
```

如果 `ykstest` 工作区本身已是项目根目录，直接在其中初始化：

```bash
cd /path/to/ykstest
npx create-react-app . --force
```

- [ ] **Step 2: 验证项目可启动**

```bash
cd /path/to/ykstest
npm start &
sleep 15
curl -s http://localhost:3000 | head -5
kill %1 2>/dev/null
```

Expected: 返回 React 默认 HTML 页面。

- [ ] **Step 3: 清理默认文件**

删除 `src/App.test.js`、`src/logo.svg`、`src/reportWebVitals.js`、`src/setupTests.js`。保留 `src/index.js`、`src/App.js`、`src/App.css`、`src/index.css`。

```bash
cd /path/to/ykstest
rm -f src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js
```

同时修改 `src/index.js`，移除对 `reportWebVitals` 的引用：

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: 创建目录结构**

```bash
cd /path/to/ykstest
mkdir -p src/components src/services
```

---

## Task 6: 实现 API 服务层

**Files:**
- Create: `[ykstest] src/services/api.js`

**Interfaces:**
- Consumes: Task 5 的 React 脚手架
- Produces: `helloWorld()`, `computeHash(algorithm, input)`, `bubbleSort(numbers)` 三个函数

- [ ] **Step 1: 创建 api.js**

```js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export async function helloWorld() {
  const res = await fetch(`${API_BASE}/api/hello`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function computeHash(algorithm, input) {
  const res = await fetch(`${API_BASE}/api/hash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm, input }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function bubbleSort(numbers) {
  const res = await fetch(`${API_BASE}/api/sort`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numbers }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
```

- [ ] **Step 2: 验证 API 模块语法**

```bash
cd /path/to/ykstest
node -e "require('./src/services/api.js')" 2>&1 || echo "ES module syntax — expected to fail in CJS, OK for browser"
```

Expected: 语法无错误（ES module 在 Node CJS 下报错是正常的，浏览器环境不受影响）。

---

## Task 7: 实现 HelloWorld Tab 组件

**Files:**
- Create: `[ykstest] src/components/HelloWorldTab.js`

**Interfaces:**
- Consumes: Task 6 的 `helloWorld()`
- Produces: 展示 `message`、`timestamp`、`version` 的 React 组件

- [ ] **Step 1: 创建 HelloWorldTab.js**

```jsx
import React, { useEffect, useState } from 'react';
import { helloWorld } from '../services/api';

function HelloWorldTab() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    helloWorld()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!data) return null;

  return (
    <div>
      <h2>HelloWorld 结果</h2>
      <table>
        <tbody>
          <tr><td><strong>Message:</strong></td><td>{data.message}</td></tr>
          <tr><td><strong>Timestamp:</strong></td><td>{data.timestamp}</td></tr>
          <tr><td><strong>Version:</strong></td><td>{data.version}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default HelloWorldTab;
```

---

## Task 8: 实现 Hash Tab 组件

**Files:**
- Create: `[ykstest] src/components/HashTab.js`

**Interfaces:**
- Consumes: Task 6 的 `computeHash()`
- Produces: 输入框 + 算法下拉 + 执行按钮 + 哈希结果展示

- [ ] **Step 1: 创建 HashTab.js**

```jsx
import React, { useState } from 'react';
import { computeHash } from '../services/api';

function HashTab() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await computeHash(algorithm, input);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>哈希算法</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label>输入文本: </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要哈希的文本"
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label>算法: </label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="MD5">MD5</option>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
          </select>
        </div>
        <button type="submit" disabled={loading || !input}>
          {loading ? '计算中...' : '执行'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '12px' }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: '12px' }}>
          <h3>结果</h3>
          <p><strong>算法:</strong> {result.algorithm}</p>
          <p><strong>输入:</strong> {result.input}</p>
          <p><strong>哈希值:</strong> <code>{result.hash}</code></p>
        </div>
      )}
    </div>
  );
}

export default HashTab;
```

---

## Task 9: 实现 BubbleSort Tab 组件

**Files:**
- Create: `[ykstest] src/components/BubbleSortTab.js`

**Interfaces:**
- Consumes: Task 6 的 `bubbleSort()`
- Produces: 数字输入框 + 执行按钮 + 排序结果 + 步骤列表

- [ ] **Step 1: 创建 BubbleSortTab.js**

```jsx
import React, { useState } from 'react';
import { bubbleSort } from '../services/api';

function BubbleSortTab() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const numbers = input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number);

    if (numbers.length === 0) {
      setError('请输入至少一个数字');
      return;
    }
    if (numbers.some(isNaN)) {
      setError('输入包含无效数字，请使用逗号分隔的数字');
      return;
    }

    setLoading(true);
    try {
      const data = await bubbleSort(numbers);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>冒泡排序</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label>输入数字（逗号分隔）: </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如: 5,3,8,1,2"
            style={{ width: '200px' }}
          />
        </div>
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? '排序中...' : '执行'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '12px' }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: '12px' }}>
          <h3>最终结果</h3>
          <p><strong>排序后:</strong> [{result.sorted.join(', ')}]</p>

          <h3>排序步骤</h3>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>轮次 (Pass)</th>
                <th>数组状态</th>
                <th>发生交换</th>
              </tr>
            </thead>
            <tbody>
              {result.steps.map((step) => (
                <tr key={step.pass}>
                  <td>{step.pass}</td>
                  <td>[{step.array.join(', ')}]</td>
                  <td>{step.swapped ? '是' : '否'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BubbleSortTab;
```

---

## Task 10: 实现主 App 与 Tab 导航

**Files:**
- Modify: `[ykstest] src/App.js`
- Modify: `[ykstest] src/App.css`

**Interfaces:**
- Consumes: Task 7/8/9 的三个 Tab 组件
- Produces: 三 Tab 单页面，切换展示不同组件

- [ ] **Step 1: 修改 App.js**

```jsx
import React, { useState } from 'react';
import './App.css';
import HelloWorldTab from './components/HelloWorldTab';
import HashTab from './components/HashTab';
import BubbleSortTab from './components/BubbleSortTab';

const TABS = [
  { key: 'hello', label: 'HelloWorld', component: HelloWorldTab },
  { key: 'hash', label: '哈希算法', component: HashTab },
  { key: 'sort', label: '冒泡排序', component: BubbleSortTab },
];

function App() {
  const [activeTab, setActiveTab] = useState('hello');

  const ActiveComponent = TABS.find((t) => t.key === activeTab).component;

  return (
    <div className="App">
      <h1>算法演示平台</h1>
      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 修改 App.css**

```css
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.tab-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 10px 24px;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  color: #666;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button:hover {
  color: #333;
}

.tab-button.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: 600;
}

.tab-content {
  padding: 10px 0;
}

table {
  margin: 10px 0;
}

code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}
```

- [ ] **Step 3: 验证前端构建**

```bash
cd /path/to/ykstest
npm run build
```

Expected: 无错误，`build/` 目录生成。

---

## Task 11: 端到端集成验证

**Files:**
- 无新建文件

**Interfaces:**
- Consumes: Task 4 的后端 + Task 10 的前端
- Produces: 前后端联调通过

- [ ] **Step 1: 启动后端**

```bash
cd /path/to/testDJnew
mvn spring-boot:run &
sleep 15
```

- [ ] **Step 2: 验证后端三个端点**

```bash
# HelloWorld
curl -s http://localhost:8080/api/hello | python3 -m json.tool

# Hash
curl -s -X POST http://localhost:8080/api/hash \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"SHA-256","input":"hello"}' | python3 -m json.tool

# Sort
curl -s -X POST http://localhost:8080/api/sort \
  -H "Content-Type: application/json" \
  -d '{"numbers":[5,3,8,1,2]}' | python3 -m json.tool
```

Expected: 三个端点均返回正确 JSON。

- [ ] **Step 3: 启动前端**

```bash
cd /path/to/ykstest
npm start &
sleep 15
```

- [ ] **Step 4: 验证前端可访问**

```bash
curl -s http://localhost:3000 | head -10
```

Expected: 返回 React HTML。

- [ ] **Step 5: 停止所有服务**

```bash
kill %1 %2 2>/dev/null
```

---

## Self-Review

### 1. Spec coverage

| 设计文档要求 | 覆盖任务 |
|-------------|---------|
| GET /api/hello — JSON 响应 | Task 2 |
| POST /api/hash — SHA-256/MD5/SHA-1 | Task 3 |
| POST /api/hash — 400 错误 | Task 3 (hash_unsupportedAlgorithm_shouldReturn400) |
| POST /api/sort — 排序 + steps | Task 4 |
| POST /api/sort — 空数组 400 | Task 4 (sort_emptyArray_shouldReturn400) |
| 前端三 Tab 页面 | Tasks 7-10 |
| HelloWorld Tab — 无输入，展示结果 | Task 7 |
| 哈希 Tab — 输入 + 下拉 + 结果 | Task 8 |
| 冒泡排序 Tab — 输入 + 步骤展示 | Task 9 |
| CORS 配置 | Task 1 (CorsConfig) |
| 错误格式 `{"error":"..."}` | Tasks 3, 4 (ErrorResponse) |
| 后端端口 8080 | Task 1 |
| 前端端口 3000 | Task 5 |

### 2. Placeholder scan

无 TBD、TODO 或模糊描述。所有代码步骤均包含完整实现。

### 3. Type consistency

- `AlgorithmController` 在 Task 2 创建，Task 3/4 追加方法 — 一致
- `AlgorithmControllerTest` 在 Task 2 创建，Task 3/4 追加测试 — 一致
- `api.js` 导出 `helloWorld`, `computeHash`, `bubbleSort` — 与 Task 7/8/9 使用一致
- React 组件名与 Tab key 对应 — 一致

---

## 执行顺序

```
Task 1 ──► Task 2 ──► Task 3 ──► Task 4 ──┐
                                           ├──► Task 11 (E2E)
Task 5 ──► Task 6 ──► Task 7 ──► Task 8 ──► Task 9 ──► Task 10 ──┘
```

后端 (Tasks 1-4) 与前端 (Tasks 5-10) 可并行开发，汇合于 Task 11 端到端验证。

---

## 执行交接

**Plan complete and saved to `docs/superpowers/plans/2026-08-25-helloworld-hash-bubblesort.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**