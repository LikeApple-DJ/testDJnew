package com.example.tool.service.impl;

import com.example.tool.common.exception.BusinessException;
import com.example.tool.model.vo.SortResultVO;
import com.example.tool.service.SortService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 冒泡排序服务实现。
 *
 * @author DTCoder
 */
@Service
public class SortServiceImpl implements SortService {

    private static final Logger logger = LoggerFactory.getLogger(SortServiceImpl.class);
    private static final int MAX_ARRAY_LENGTH = 1000;

    @Override
    public SortResultVO bubbleSort(int[] array) {
        if (array == null || array.length == 0) {
            throw new BusinessException("TOOL_003", "数组不能为空");
        }
        if (array.length > MAX_ARRAY_LENGTH) {
            throw new BusinessException("TOOL_004", "数组元素过多（超过" + MAX_ARRAY_LENGTH + "）");
        }

        int[] original = array.clone();
        int[] sorted = array.clone();
        int steps = 0;
        int n = sorted.length;

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                steps++;
                if (sorted[j] > sorted[j + 1]) {
                    int temp = sorted[j];
                    sorted[j] = sorted[j + 1];
                    sorted[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }

        if (logger.isDebugEnabled()) {
            logger.debug("冒泡排序完成: array length={}, steps={}", original.length, steps);
        }

        SortResultVO result = new SortResultVO();
        result.setOriginal(original);
        result.setSorted(sorted);
        result.setSteps(steps);
        return result;
    }
}