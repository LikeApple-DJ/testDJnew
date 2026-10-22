package com.dt.samples.sort;

/**
 * 冒泡排序工具类
 *
 * <p>提供基于冒泡排序算法的升序排序功能。
 * 冒泡排序的基本思想是：重复地遍历要排序的数组，依次比较相邻的两个元素，
 * 如果它们的顺序错误就把它们交换过来，直到没有任何一对元素需要交换为止。
 *
 * <p>时间复杂度：O(n²)，空间复杂度：O(n)（防御性拷贝）。
 *
 * @author AiWork
 * @date 2026/10/21
 */
public final class BubbleSortUtil {

    private BubbleSortUtil() {
        throw new UnsupportedOperationException("Utility class should not be instantiated");
    }

    /**
     * 对输入的整数数组进行升序冒泡排序
     *
     * <p>该方法会先对输入数组进行防御性拷贝，然后对副本进行原地排序并返回。
     * 原始输入数组不会被修改。
     *
     * @param array 待排序的整数数组，不能为null
     * @return 升序排列后的新数组
     * @throws IllegalArgumentException 当输入数组为null时抛出
     */
    public static int[] sortAscending(int[] array) {
        if (array == null) {
            throw new IllegalArgumentException("Input array must not be null");
        }

        // 防御性拷贝，避免修改原始数组
        int[] result = array.clone();
        int n = result.length;

        // 外层循环：每一轮将当前未排序区间的最大值冒泡到末尾
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;

            // 内层循环：对未排序区间进行相邻比较与交换
            for (int j = 0; j < n - 1 - i; j++) {
                if (result[j] > result[j + 1]) {
                    swap(result, j, j + 1);
                    swapped = true;
                }
            }

            // 如果本轮没有发生交换，说明数组已经有序，可以提前终止
            if (!swapped) {
                break;
            }
        }

        return result;
    }

    /**
     * 交换数组中两个位置的元素
     *
     * @param array 目标数组
     * @param i     第一个位置索引
     * @param j     第二个位置索引
     */
    private static void swap(int[] array, int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}