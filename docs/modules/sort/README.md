# sort 模块

## 模块职责

提供冒泡排序算法实现，对整数数组进行升序排序。

## 关键类说明

| 类名 | 类型 | 职责 |
|------|------|------|
| `BubbleSortUtil` | 工具类 | 冒泡排序核心算法，提供 `sortAscending(int[])` 静态方法 |

## 依赖关系

无外部模块依赖，纯 Java SE 实现。

## API 接口

### sortAscending

```java
public static int[] sortAscending(int[] array)
```

- **参数**：`array` - 待排序的整数数组（不可为 null）
- **返回**：升序排序后的新数组（防御性拷贝）
- **异常**：`IllegalArgumentException` - 输入为 null 时抛出
- **时间复杂度**：O(n²)，最优 O(n)（已有序时提前终止）
- **空间复杂度**：O(n)

## 测试

| 测试类 | 测试方法数 | 覆盖场景 |
|--------|:--------:|----------|
| `BubbleSortUtilTest` | 9 | 正常路径、边界值、异常、防御性拷贝 |