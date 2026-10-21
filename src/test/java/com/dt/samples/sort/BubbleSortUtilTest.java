package com.dt.samples.sort;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 冒泡排序工具类单元测试
 *
 * @author AiWork
 * @date 2026/10/21
 */
class BubbleSortUtilTest {

    // ==================== sortAscending 测试 ====================

    /**
     * 正常路径：标准整数数组升序排序
     */
    @Test
    void should_returnAscendingArray_when_inputIsUnsorted() {
        // Arrange
        int[] input = {5, 3, 8, 1, 2};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 5, 8);
    }

    /**
     * 正常路径：输入已是有序数组
     */
    @Test
    void should_returnSameArray_when_inputAlreadySorted() {
        // Arrange
        int[] input = {1, 2, 3, 4, 5};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 4, 5);
    }

    /**
     * 正常路径：输入逆序数组
     */
    @Test
    void should_returnAscendingArray_when_inputIsDescending() {
        // Arrange
        int[] input = {9, 7, 5, 3, 1};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).containsExactly(1, 3, 5, 7, 9);
    }

    /**
     * 边界值：单元素数组
     */
    @Test
    void should_returnSameArray_when_inputHasSingleElement() {
        // Arrange
        int[] input = {42};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).containsExactly(42);
    }

    /**
     * 边界值：空数组
     */
    @Test
    void should_returnEmptyArray_when_inputIsEmpty() {
        // Arrange
        int[] input = {};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).isEmpty();
    }

    /**
     * 异常路径：输入数组为null
     */
    @Test
    void should_throwException_when_inputIsNull() {
        // Arrange & Act & Assert
        assertThatThrownBy(() -> BubbleSortUtil.sortAscending(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Input array must not be null");
    }

    /**
     * 边界值：包含重复元素的数组
     */
    @Test
    void should_sortCorrectly_when_inputContainsDuplicates() {
        // Arrange
        int[] input = {4, 2, 4, 1, 2};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 2, 4, 4);
    }

    /**
     * 边界值：包含负数的数组
     */
    @Test
    void should_sortCorrectly_when_inputContainsNegativeNumbers() {
        // Arrange
        int[] input = {-3, 0, 5, -8, 2};

        // Act
        int[] result = BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(result).containsExactly(-8, -3, 0, 2, 5);
    }

    /**
     * 正常路径：输入数组不被修改（防御性拷贝验证）
     */
    @Test
    void should_notModifyOriginalArray_when_sorting() {
        // Arrange
        int[] input = {5, 3, 8, 1, 2};
        int[] original = input.clone();

        // Act
        BubbleSortUtil.sortAscending(input);

        // Assert
        assertThat(input).containsExactly(original);
    }
}