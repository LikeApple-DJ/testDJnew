# sort-sample 架构文档

## 项目概述

冒泡排序算法示例项目，演示数科 Java 编码规范下的算法实现。

## 模块列表

| 模块 | 职责 | 文档 |
|------|------|------|
| sort | 冒泡排序工具类 | [docs/modules/sort/README.md](docs/modules/sort/README.md) |

## 技术栈

- Java 21
- JUnit 5 + Mockito + AssertJ
- Maven

## 分层架构

```
com.dt.samples.sort
└── BubbleSortUtil        # 排序工具类
```

## 约束

- 无外部依赖，纯 Java SE
- 工具类必须 final + private 构造
- 遵循数科 Java 编码规范