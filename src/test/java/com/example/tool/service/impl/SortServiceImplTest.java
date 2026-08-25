package com.example.tool.service.impl;

import com.example.tool.common.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * {@link SortServiceImpl} 单元测试。
 *
 * @author DTCoder
 */
@DisplayName("SortServiceImpl 单元测试")
class SortServiceImplTest {

    private SortServiceImpl sortService;

    @BeforeEach
    void setUp() {
        sortService = new SortServiceImpl();
    }

    @Test
    @DisplayName("正常数组排序")
    void should_sortArray_when_validInput() {
        int[] input = {5, 2, 8, 1, 9};
        SortServiceImpl.SortResult result = sortService.bubbleSort(input);

        assertThat(result.getSorted()).containsExactly(1, 2, 5, 8, 9);
        assertThat(result.getOriginal()).containsExactly(5, 2, 8, 1, 9);
        assertThat(result.getSteps()).isPositive();
    }

    @Test
    @DisplayName("已排序数组")
    void should_returnSameArray_when_alreadySorted() {
        int[] input = {1, 2, 3, 4, 5};
        SortServiceImpl.SortResult result = sortService.bubbleSort(input);

        assertThat(result.getSorted()).containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    @DisplayName("单元素数组")
    void should_returnSameArray_when_singleElement() {
        int[] input = {42};
        SortServiceImpl.SortResult result = sortService.bubbleSort(input);

        assertThat(result.getSorted()).containsExactly(42);
        assertThat(result.getSteps()).isZero();
    }

    @Test
    @DisplayName("包含重复元素的数组")
    void should_sortArray_when_duplicateElements() {
        int[] input = {3, 1, 3, 2, 1};
        SortServiceImpl.SortResult result = sortService.bubbleSort(input);

        assertThat(result.getSorted()).containsExactly(1, 1, 2, 3, 3);
    }

    @Test
    @DisplayName("包含负数的数组")
    void should_sortArray_when_negativeNumbers() {
        int[] input = {-3, 0, 5, -1, 2};
        SortServiceImpl.SortResult result = sortService.bubbleSort(input);

        assertThat(result.getSorted()).containsExactly(-3, -1, 0, 2, 5);
    }

    @Test
    @DisplayName("null 数组抛出 BusinessException")
    void should_throwException_when_nullArray() {
        assertThatThrownBy(() -> sortService.bubbleSort(null))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("数组不能为空");
    }

    @Test
    @DisplayName("空数组抛出 BusinessException")
    void should_throwException_when_emptyArray() {
        assertThatThrownBy(() -> sortService.bubbleSort(new int[0]))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("数组不能为空");
    }

    @Test
    @DisplayName("超长数组抛出 BusinessException")
    void should_throwException_when_arrayTooLong() {
        int[] input = new int[1001];
        assertThatThrownBy(() -> sortService.bubbleSort(input))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("数组元素过多");
    }

    @Test
    @DisplayName("原始数组不被修改")
    void should_notModifyOriginalArray() {
        int[] input = {5, 2, 8, 1, 9};
        int[] originalCopy = input.clone();

        sortService.bubbleSort(input);

        assertThat(input).containsExactly(originalCopy);
    }
}