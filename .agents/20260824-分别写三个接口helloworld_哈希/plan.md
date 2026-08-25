# 三接口（Helloworld / 哈希 / 冒泡排序）+ 前端 Tab 页 + 可视化报表 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 testDJnew（前端 React）和 ranxitest（后端 Java Spring Boot）两个仓库中，实现三个后端接口（helloworld、哈希算法、冒泡排序）、前端三 Tab 页面、导出功能、埋点统计及可视化报表。

**Architecture:** 前后端分离架构。前端 React 应用通过 HTTP 调用后端 REST API。后端提供 5 个接口（3 业务 + 1 导出 + 1 统计），并在每次调用时记录埋点数据到内存存储。前端使用 ECharts 渲染折线图/饼图/柱状图。

**Tech Stack:** Java 17 + Spring Boot 3.x（后端），React 18 + TypeScript + ECharts（前端），CSV 导出格式，内存埋点存储

---

## Global Constraints

- 后端所有接口统一响应格式：`{ "code": 0, "data": { ... } }`
- 哈希算法使用 SHA-256
- 导出格式为 CSV
- 埋点存储为内存存储（应用重启重置）
- 调用人识别通过 HTTP Header 模拟：`X-User-Id`、`X-User-Name`、`X-User-Type`、`X-User-Level`、`X-User-Dept`
- 禁止使用 Git 写操作（commit/push/merge/reset/rebase/checkout）
- 两个仓库均为空仓，需从零搭建项目骨架

---

## File Structure

### 仓库 A: ranxitest-main（后端 Java Spring Boot）

| 文件路径 | 职责 |
|---------|------|
| `pom.xml` | Maven 项目配置，Spring Boot 3.x 依赖 |
| `src/main/java/com/example/ranxitest/RanxitestApplication.java` | Spring Boot 启动类 |
| `src/main/java/com/example/ranxitest/controller/HelloworldController.java` | `GET /api/helloworld` 接口 |
| `src/main/java/com/example/ranxitest/controller/HashController.java` | `GET /api/hash?input=xxx` 接口 |
| `src/main/java/com/example/ranxitest/controller/BubbleSortController.java` | `POST /api/bubblesort` 接口 |
| `src/main/java/com/example/ranxitest/controller/ExportController.java` | `GET /api/export?tab=xxx` 导出接口 |
| `src/main/java/com/example/ranxitest/controller/StatsController.java` | `GET /api/stats?dimension=xxx` 统计接口 |
| `src/main/java/com/example/ranxitest/model/TrackingRecord.java` | 埋点记录实体类 |
| `src/main/java/com/example/ranxitest/service/TrackingService.java` | 埋点存储与查询 Service |
| `src/main/java/com/example/ranxitest/config/WebConfig.java` | CORS 跨域配置 |
| `src/main/java/com/example/ranxitest/interceptor/TrackingInterceptor.java` | 埋点拦截器（自动记录调用） |
| `src/main/resources/application.yml` | 应用配置 |
| `src/test/java/com/example/ranxitest/RanxitestApplicationTests.java` | 应用启动测试 |

### 仓库 B: testDJnew-main（前端 React）

| 文件路径 | 职责 |
|---------|------|
| `package.json` | 项目依赖配置 |
| `public/index.html` | HTML 入口 |
| `src/index.tsx` | React 入口 |
| `src/App.tsx` | 主应用组件（路由/布局） |
| `src/pages/HomePage.tsx` | 首页：三 Tab 容器 |
| `src/pages/TabHelloworld.tsx` | Tab1：调用 helloworld 接口 |
| `src/pages/TabHash.tsx` | Tab2：调用哈希接口 |
| `src/pages/TabBubbleSort.tsx` | Tab3：调用冒泡排序接口 |
| `src/pages/ReportPage.tsx` | 可视化报表页面（折线图/饼图/柱状图） |
| `src/services/api.ts` | API 调用封装 |
| `src/components/ExportButton.tsx` | 导出按钮组件 |
| `src/App.css` | 全局样式 |

---

## Task 1: [ranxitest] 搭建 Spring Boot 项目骨架

**Files:**
- Create: `ranxitest-main/pom.xml`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/RanxitestApplication.java`
- Create: `ranxitest-main/src/main/resources/application.yml`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/config/WebConfig.java`
- Create: `ranxitest-main/src/test/java/com/example/ranxitest/RanxitestApplicationTests.java`

**Interfaces:**
- Consumes: 无
- Produces: 可运行 Spring Boot 空应用，CORS 配置开放 `http://localhost:3000`

- [ ] **Step 1: 创建 pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>ranxitest</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>ranxitest</name>
    <description>Backend API for testDJnew</description>
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

- [ ] **Step 2: 创建启动类**

```java
package com.example.ranxitest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RanxitestApplication {
    public static void main(String[] args) {
        SpringApplication.run(RanxitestApplication.class, args);
    }
}
```

- [ ] **Step 3: 创建 application.yml**

```yaml
server:
  port: 8080
spring:
  application:
    name: ranxitest
```

- [ ] **Step 4: 创建 CORS 配置**

```java
package com.example.ranxitest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

- [ ] **Step 5: 创建启动测试**

```java
package com.example.ranxitest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RanxitestApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

- [ ] **Step 6: 验证编译**

```bash
cd /root/.agentix/agentic-dev/runs/DEV-9d10e310-7901-11f1-8a9f-59ecae612580-9584c0e2-bd64-464b-a178-65398e856eec/worktree/ranxitest-main
mvn compile -q
```
Expected: BUILD SUCCESS

---

## Task 2: [ranxitest] 实现埋点系统（TrackingService + Interceptor）

**Files:**
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/model/TrackingRecord.java`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/service/TrackingService.java`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/interceptor/TrackingInterceptor.java`
- Modify: `ranxitest-main/src/main/java/com/example/ranxitest/config/WebConfig.java`（注册拦截器）

**Interfaces:**
- Consumes: 无
- Produces: `TrackingService`（内存存储、增删查方法），`TrackingInterceptor`（自动从 HTTP Header 提取用户信息并记录埋点）

- [ ] **Step 1: 创建 TrackingRecord 实体**

```java
package com.example.ranxitest.model;

import java.time.LocalDateTime;

public class TrackingRecord {
    private String userId;
    private String userName;
    private String userType;      // 人员类型
    private String userLevel;     // 人员层级
    private String userDept;      // 人员部门
    private String apiPath;       // 调用的 API 路径
    private LocalDateTime callTime;

    public TrackingRecord() {}

    public TrackingRecord(String userId, String userName, String userType,
                          String userLevel, String userDept, String apiPath) {
        this.userId = userId;
        this.userName = userName;
        this.userType = userType;
        this.userLevel = userLevel;
        this.userDept = userDept;
        this.apiPath = apiPath;
        this.callTime = LocalDateTime.now();
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    public String getUserLevel() { return userLevel; }
    public void setUserLevel(String userLevel) { this.userLevel = userLevel; }
    public String getUserDept() { return userDept; }
    public void setUserDept(String userDept) { this.userDept = userDept; }
    public String getApiPath() { return apiPath; }
    public void setApiPath(String apiPath) { this.apiPath = apiPath; }
    public LocalDateTime getCallTime() { return callTime; }
    public void setCallTime(LocalDateTime callTime) { this.callTime = callTime; }
}
```

- [ ] **Step 2: 创建 TrackingService**

```java
package com.example.ranxitest.service;

import com.example.ranxitest.model.TrackingRecord;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class TrackingService {
    private final List<TrackingRecord> records = new CopyOnWriteArrayList<>();

    public void record(TrackingRecord record) {
        records.add(record);
    }

    public List<TrackingRecord> getAllRecords() {
        return new ArrayList<>(records);
    }

    /**
     * 按维度统计：userType / userLevel / userDept
     * 返回 [{ name: "维度值", value: 计数 }, ...]
     */
    public List<Map<String, Object>> getStatsByDimension(String dimension) {
        Map<String, Long> grouped = records.stream()
                .collect(Collectors.groupingBy(
                        r -> {
                            switch (dimension) {
                                case "userType": return r.getUserType();
                                case "userLevel": return r.getUserLevel();
                                case "userDept": return r.getUserDept();
                                default: return "unknown";
                            }
                        },
                        Collectors.counting()
                ));
        return grouped.entrySet().stream()
                .map(e -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", e.getKey());
                    item.put("value", e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
    }

    /**
     * 按时间维度统计（每小时调用次数）
     */
    public List<Map<String, Object>> getTimeSeriesStats() {
        Map<String, Long> grouped = records.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCallTime().toLocalDate().toString() + " " + r.getCallTime().getHour() + ":00",
                        Collectors.counting()
                ));
        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("time", e.getKey());
                    item.put("count", e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
    }
}
```

- [ ] **Step 3: 创建 TrackingInterceptor**

```java
package com.example.ranxitest.interceptor;

import com.example.ranxitest.model.TrackingRecord;
import com.example.ranxitest.service.TrackingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TrackingInterceptor implements HandlerInterceptor {
    private final TrackingService trackingService;

    public TrackingInterceptor(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        if (path.startsWith("/api/") && !path.equals("/api/stats") && !path.equals("/api/export")) {
            TrackingRecord record = new TrackingRecord(
                getHeader(request, "X-User-Id", "anonymous"),
                getHeader(request, "X-User-Name", "Anonymous"),
                getHeader(request, "X-User-Type", "unknown"),
                getHeader(request, "X-User-Level", "unknown"),
                getHeader(request, "X-User-Dept", "unknown"),
                path
            );
            trackingService.record(record);
        }
        return true;
    }

    private String getHeader(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getHeader(name);
        return value != null ? value : defaultValue;
    }
}
```

- [ ] **Step 4: 修改 WebConfig 注册拦截器**

```java
// 在 WebConfig 类中增加：
@Autowired
private TrackingInterceptor trackingInterceptor;

@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(trackingInterceptor).addPathPatterns("/api/**");
}
```

完整 WebConfig.java：

```java
package com.example.ranxitest.config;

import com.example.ranxitest.interceptor.TrackingInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private TrackingInterceptor trackingInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(trackingInterceptor).addPathPatterns("/api/**");
    }
}
```

- [ ] **Step 5: 验证编译**

```bash
cd /root/.agentix/agentic-dev/runs/DEV-9d10e310-7901-11f1-8a9f-59ecae612580-9584c0e2-bd64-464b-a178-65398e856eec/worktree/ranxitest-main
mvn compile -q
```
Expected: BUILD SUCCESS

---

## Task 3: [ranxitest] 实现三个业务接口（Helloworld / 哈希 / 冒泡排序）

**Files:**
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/controller/HelloworldController.java`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/controller/HashController.java`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/controller/BubbleSortController.java`

**Interfaces:**
- Consumes: 无（埋点由拦截器自动完成）
- Produces: 三个 REST 接口端点

- [ ] **Step 1: 创建 HelloworldController**

```java
package com.example.ranxitest.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloworldController {

    @GetMapping("/helloworld")
    public Map<String, Object> helloworld() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 0);
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Hello, World!");
        response.put("data", data);
        return response;
    }
}
```

- [ ] **Step 2: 创建 HashController**

```java
package com.example.ranxitest.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HashController {

    @GetMapping("/hash")
    public Map<String, Object> hash(@RequestParam(defaultValue = "hello") String input) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 0);
        Map<String, Object> data = new HashMap<>();
        data.put("algorithm", "sha256");
        data.put("input", input);
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }
            data.put("output", hexString.toString());
        } catch (NoSuchAlgorithmException e) {
            data.put("output", "error: SHA-256 not available");
        }
        response.put("data", data);
        return response;
    }
}
```

- [ ] **Step 3: 创建 BubbleSortController**

```java
package com.example.ranxitest.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class BubbleSortController {

    @PostMapping("/bubblesort")
    public Map<String, Object> bubbleSort(@RequestBody Map<String, Object> body) {
        List<Integer> array = new ArrayList<>();
        if (body.containsKey("array") && body.get("array") instanceof List) {
            @SuppressWarnings("unchecked")
            List<Object> rawList = (List<Object>) body.get("array");
            for (Object item : rawList) {
                if (item instanceof Number) {
                    array.add(((Number) item).intValue());
                }
            }
        }

        List<Integer> original = new ArrayList<>(array);
        int steps = 0;
        int n = array.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (array.get(j) > array.get(j + 1)) {
                    int temp = array.get(j);
                    array.set(j, array.get(j + 1));
                    array.set(j + 1, temp);
                    steps++;
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("code", 0);
        Map<String, Object> data = new HashMap<>();
        data.put("original", original);
        data.put("sorted", array);
        data.put("steps", steps);
        response.put("data", data);
        return response;
    }
}
```

- [ ] **Step 4: 验证编译**

```bash
cd /root/.agentix/agentic-dev/runs/DEV-9d10e310-7901-11f1-8a9f-59ecae612580-9584c0e2-bd64-464b-a178-65398e856eec/worktree/ranxitest-main
mvn compile -q
```
Expected: BUILD SUCCESS

---

## Task 4: [ranxitest] 实现导出接口 + 统计接口

**Files:**
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/controller/ExportController.java`
- Create: `ranxitest-main/src/main/java/com/example/ranxitest/controller/StatsController.java`

**Interfaces:**
- Consumes: `TrackingService`（获取埋点数据）
- Produces: `GET /api/export?tab=xxx` 导出 CSV，`GET /api/stats?dimension=xxx` 返回 JSON 统计

- [ ] **Step 1: 创建 ExportController**

```java
package com.example.ranxitest.controller;

import com.example.ranxitest.model.TrackingRecord;
import com.example.ranxitest.service.TrackingService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ExportController {
    private final TrackingService trackingService;

    public ExportController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue = "helloworld") String tab) {
        StringBuilder csv = new StringBuilder();
        csv.append("userId,userName,userType,userLevel,userDept,apiPath,callTime\n");

        List<TrackingRecord> records = trackingService.getAllRecords();
        List<TrackingRecord> filtered = records.stream()
                .filter(r -> {
                    String path = r.getApiPath();
                    switch (tab) {
                        case "helloworld": return path.equals("/api/helloworld");
                        case "hash": return path.equals("/api/hash");
                        case "bubblesort": return path.equals("/api/bubblesort");
                        default: return true;
                    }
                })
                .collect(Collectors.toList());

        for (TrackingRecord r : filtered) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s\n",
                    r.getUserId(), r.getUserName(), r.getUserType(),
                    r.getUserLevel(), r.getUserDept(), r.getApiPath(), r.getCallTime()));
        }

        byte[] csvBytes = csv.toString().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", tab + "_data.csv");

        return ResponseEntity.ok().headers(headers).body(csvBytes);
    }
}
```

- [ ] **Step 2: 创建 StatsController**

```java
package com.example.ranxitest.controller;

import com.example.ranxitest.service.TrackingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StatsController {
    private final TrackingService trackingService;

    public StatsController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestParam(defaultValue = "userType") String dimension) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 0);

        Map<String, Object> data = new HashMap<>();
        data.put("dimension", dimension);

        List<Map<String, Object>> series = trackingService.getStatsByDimension(dimension);
        data.put("series", series);

        List<Map<String, Object>> timeSeries = trackingService.getTimeSeriesStats();
        data.put("timeSeries", timeSeries);

        response.put("data", data);
        return response;
    }
}
```

- [ ] **Step 3: 验证编译**

```bash
cd /root/.agentix/agentic-dev/runs/DEV-9d10e310-7901-11f1-8a9f-59ecae612580-9584c0e2-bd64-464b-a178-65398e856eec/worktree/ranxitest-main
mvn compile -q
```
Expected: BUILD SUCCESS

---

## Task 5: [testDJnew] 搭建 React 前端项目骨架

**Files:**
- Create: `testDJnew-main/package.json`
- Create: `testDJnew-main/public/index.html`
- Create: `testDJnew-main/src/index.tsx`
- Create: `testDJnew-main/src/App.tsx`
- Create: `testDJnew-main/src/App.css`
- Create: `testDJnew-main/tsconfig.json`

**Interfaces:**
- Consumes: 无
- Produces: 可运行的 React 应用骨架，包含三个 Tab 页面占位

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "testdjnew-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "echarts": "^5.4.3",
    "echarts-for-react": "^3.0.2",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

- [ ] **Step 2: 创建 public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TestDJNew - 接口演示</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 创建 src/index.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
```

- [ ] **Step 5: 创建 src/App.tsx**

```tsx
import React from 'react';
import HomePage from './pages/HomePage';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1 className="app-title">API 接口演示平台</h1>
      <HomePage />
    </div>
  );
};

export default App;
```

- [ ] **Step 6: 创建 src/App.css**

```css
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.tab-container {
  margin-bottom: 20px;
}

.tab-buttons {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 10px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
}

.tab-button.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.tab-button:hover {
  color: #1890ff;
}

.tab-content {
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
  min-height: 200px;
}

.result-box {
  background: white;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin: 10px 0;
  white-space: pre-wrap;
  font-family: monospace;
}

input, textarea {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
}

button {
  padding: 8px 20px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

button:hover {
  background: #40a9ff;
}
```

- [ ] **Step 7: 验证安装依赖**

```bash
cd /root/.agentix/agentic-dev/runs/DEV-9d10e310-7901-11f1-8a9f-59ecae612580-9584c0e2-bd64-464b-a178-65398e856eec/worktree/testDJnew-main
npm install --silent 2>&1 | tail -5
```
Expected: `npm install` 完成无错误

---

## Task 6: [testDJnew] 实现 API 调用服务层 + 三个 Tab 页面

**Files:**
- Create: `testDJnew-main/src/services/api.ts`
- Create: `testDJnew-main/src/pages/TabHelloworld.tsx`
- Create: `testDJnew-main/src/pages/TabHash.tsx`
- Create: `testDJnew-main/src/pages/TabBubbleSort.tsx`
- Create: `testDJnew-main/src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: 后端接口 `GET /api/helloworld`、`GET /api/hash?input=xxx`、`POST /api/bubblesort`
- Produces: 三个独立 Tab 组件 + 首页容器

- [ ] **Step 1: 创建 src/services/api.ts**

```tsx
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'X-User-Id': 'user001',
    'X-User-Name': 'TestUser',
    'X-User-Type': 'developer',
    'X-User-Level': 'senior',
    'X-User-Dept': 'engineering',
  },
});

export const callHelloworld = async () => {
  const res = await apiClient.get('/helloworld');
  return res.data;
};

export const callHash = async (input: string) => {
  const res = await apiClient.get('/hash', { params: { input } });
  return res.data;
};

export const callBubbleSort = async (array: number[]) => {
  const res = await apiClient.post('/bubblesort', { array });
  return res.data;
};

export const callExport = async (tab: string) => {
  const res = await apiClient.get('/export', {
    params: { tab },
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${tab}_data.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const callStats = async (dimension: string) => {
  const res = await apiClient.get('/stats', { params: { dimension } });
  return res.data;
};
```

- [ ] **Step 2: 创建 TabHelloworld.tsx**

```tsx
import React, { useState } from 'react';
import { callHelloworld } from '../services/api';

const TabHelloworld: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const handleCall = async () => {
    try {
      const data = await callHelloworld();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Helloworld 接口</h2>
      <p>调用后端接口，返回问候语。</p>
      <button onClick={handleCall}>调用 Helloworld</button>
      {result && (
        <div className="result-box">
          <strong>结果：</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TabHelloworld;
```

- [ ] **Step 3: 创建 TabHash.tsx**

```tsx
import React, { useState } from 'react';
import { callHash } from '../services/api';

const TabHash: React.FC = () => {
  const [input, setInput] = useState('hello');
  const [result, setResult] = useState('');

  const handleCall = async () => {
    try {
      const data = await callHash(input);
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>哈希算法接口</h2>
      <p>输入字符串，返回 SHA-256 哈希值。</p>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要哈希的字符串"
        />
        <button onClick={handleCall}>计算哈希</button>
      </div>
      {result && (
        <div className="result-box">
          <strong>结果：</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TabHash;
```

- [ ] **Step 4: 创建 TabBubbleSort.tsx**

```tsx
import React, { useState } from 'react';
import { callBubbleSort } from '../services/api';

const TabBubbleSort: React.FC = () => {
  const [inputArr, setInputArr] = useState('5,3,8,1,2');
  const [result, setResult] = useState('');

  const handleCall = async () => {
    try {
      const arr = inputArr.split(',').map((s) => parseInt(s.trim(), 10));
      const data = await callBubbleSort(arr);
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>冒泡排序接口</h2>
      <p>输入数字数组（逗号分隔），返回排序结果。</p>
      <div>
        <input
          type="text"
          value={inputArr}
          onChange={(e) => setInputArr(e.target.value)}
          placeholder="例如: 5,3,8,1,2"
        />
        <button onClick={handleCall}>排序</button>
      </div>
      {result && (
        <div className="result-box">
          <strong>结果：</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TabBubbleSort;
```

- [ ] **Step 5: 创建 HomePage.tsx（三 Tab 容器）**

```tsx
import React, { useState } from 'react';
import TabHelloworld from './TabHelloworld';
import TabHash from './TabHash';
import TabBubbleSort from './TabBubbleSort';
import ReportPage from './ReportPage';
import { callExport } from '../services/api';

const TABS = ['helloworld', 'hash', 'bubblesort', '报表'] as const;
type TabKey = (typeof TABS)[number];

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('helloworld');

  const handleExport = async () => {
    if (activeTab === '报表') {
      alert('报表页暂不支持导出');
      return;
    }
    try {
      await callExport(activeTab);
    } catch (err: any) {
      alert(`导出失败: ${err.message}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'helloworld': return <TabHelloworld />;
      case 'hash': return <TabHash />;
      case 'bubblesort': return <TabBubbleSort />;
      case '报表': return <ReportPage />;
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-buttons">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'helloworld' ? 'Helloworld' :
             tab === 'hash' ? '哈希算法' :
             tab === 'bubblesort' ? '冒泡排序' : '📊 报表'}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button onClick={handleExport}>📥 导出当前页数据</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HomePage;
```

---

## Task 7: [testDJnew] 实现可视化报表页面（ReportPage）

**Files:**
- Create: `testDJnew-main/src/pages/ReportPage.tsx`

**Interfaces:**
- Consumes: `GET /api/stats?dimension=xxx` 统计接口
- Produces: 折线图（时间趋势）、饼图（人员类型）、柱状图（人员部门/层级）

- [ ] **Step 1: 创建 ReportPage.tsx**

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import { callStats } from '../services/api';

interface StatsData {
  dimension: string;
  series: { name: string; value: number }[];
  timeSeries: { time: string; count: number }[];
}

const ReportPage: React.FC = () => {
  const [dimension, setDimension] = useState('userType');
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await callStats(dimension);
      if (res.code === 0) {
        setStatsData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, [dimension]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 饼图配置（按选中维度展示）
  const pieOption = statsData ? {
    title: { text: `${dimension === 'userType' ? '人员类型' : dimension === 'userLevel' ? '人员层级' : '人员部门'}分布`, left: 'center' },
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: statsData.series.map((s) => ({ name: s.name, value: s.value })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
    }],
  } : {};

  // 柱状图配置（按选中维度展示）
  const barOption = statsData ? {
    title: { text: `${dimension === 'userType' ? '人员类型' : dimension === 'userLevel' ? '人员层级' : '人员部门'}调用次数`, left: 'center' },
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: statsData.series.map((s) => s.name) },
    yAxis: { type: 'value' as const },
    series: [{
      type: 'bar',
      data: statsData.series.map((s) => s.value),
      itemStyle: { color: '#1890ff' },
    }],
  } : {};

  // 折线图配置（时间趋势）
  const lineOption = statsData ? {
    title: { text: '调用时间趋势', left: 'center' },
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: statsData.timeSeries.map((t) => t.time) },
    yAxis: { type: 'value' as const },
    series: [{
      type: 'line',
      data: statsData.timeSeries.map((t) => t.count),
      smooth: true,
      lineStyle: { color: '#52c41a' },
      areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
    }],
  } : {};

  return (
    <div>
      <h2>调用统计报表</h2>
      <div style={{ marginBottom: 20 }}>
        <label>统计维度：</label>
        <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
          <option value="userType">人员类型</option>
          <option value="userLevel">人员层级</option>
          <option value="userDept">人员部门</option>
        </select>
        <button onClick={fetchStats} style={{ marginLeft: 10 }}>刷新数据</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', padding: 10, borderRadius: 4 }}>
          {statsData ? <ReactEChartsCore option={lineOption} style={{ height: 300 }} /> : <p>加载中...</p>}
        </div>
        <div style={{ background: 'white', padding: 10, borderRadius: 4 }}>
          {statsData ? <ReactEChartsCore option={pieOption} style={{ height: 300 }} /> : <p>加载中...</p>}
        </div>
        <div style={{ background: 'white', padding: 10, borderRadius: 4, gridColumn: '1 / 3' }}>
          {statsData ? <ReactEChartsCore option={barOption} style={{ height: 300 }} /> : <p>加载中...</p>}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
```

---

## 跨仓对齐点检查

### 接口契约矩阵

| 接口 | 方法 | 路径 | 请求 | 响应 | 前端调用方 |
|------|------|------|------|------|-----------|
| helloworld | GET | `/api/helloworld` | 无 | `{ code:0, data:{ message } }` | `TabHelloworld.tsx` → `api.ts::callHelloworld()` |
| 哈希 | GET | `/api/hash?input=xxx` | query param | `{ code:0, data:{ algorithm, input, output } }` | `TabHash.tsx` → `api.ts::callHash()` |
| 冒泡排序 | POST | `/api/bubblesort` | `{ array:[] }` | `{ code:0, data:{ original, sorted, steps } }` | `TabBubbleSort.tsx` → `api.ts::callBubbleSort()` |
| 导出 | GET | `/api/export?tab=xxx` | query param | CSV 文件下载 | `HomePage.tsx` → `api.ts::callExport()` |
| 统计 | GET | `/api/stats?dimension=xxx` | query param | `{ code:0, data:{ dimension, series[], timeSeries[] } }` | `ReportPage.tsx` → `api.ts::callStats()` |

### 埋点数据流

```
前端请求 (带 X-User-* headers)
  → 后端 TrackingInterceptor 拦截 /api/** 路径（排除 /stats 和 /export）
  → 创建 TrackingRecord 存入 TrackingService 内存列表
  → StatsController 从 TrackingService 读取并聚合统计
  → 前端 ReportPage 渲染 ECharts 图表
```

### 维度枚举

| 维度 | HTTP Header | 可选值示例 |
|------|------------|-----------|
| 人员类型 | `X-User-Type` | developer, manager, admin, tester |
| 人员层级 | `X-User-Level` | junior, mid, senior, lead |
| 人员部门 | `X-User-Dept` | engineering, product, design, marketing |

---

## Self-Review

### 1. 需求覆盖检查
- ✅ 三个后端接口（helloworld/哈希/冒泡排序）→ Task 3
- ✅ 前端三 Tab 页面 → Task 6
- ✅ 导出按钮 + 后台导出接口 → Task 4 + Task 6
- ✅ 后端埋点（调用次数/调用人）→ Task 2
- ✅ 前端可视化报表（折线图/饼图/柱状图，按维度）→ Task 7
- ✅ 跨域配置 → Task 1

### 2. 占位符检查
- 无 TBD/TODO/implement later 等占位符
- 所有代码块包含完整实现

### 3. 类型一致性检查
- 所有接口响应格式统一为 `{ code: 0, data: {...} }`
- 埋点维度名称在前后端一致：`userType` / `userLevel` / `userDept`
- API 调用路径在 frontend `api.ts` 与 backend Controller 中完全匹配