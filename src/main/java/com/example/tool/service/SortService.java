package com.example.tool.service;

import com.example.tool.service.impl.SortServiceImpl;

/**
 * 冒泡排序服务接口。
 *
 * @author DTCoder
 */
public interface SortService {

    /**
     * 对整数数组执行冒泡排序。
     *
     * @param array 待排序数组
     * @return 排序结果（包含原始数组、排序后数组、步数）
     */
    SortServiceImpl.SortResult bubbleSort(int[] array);
}