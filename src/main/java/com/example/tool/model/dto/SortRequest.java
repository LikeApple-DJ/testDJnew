package com.example.tool.model.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * 冒泡排序请求 DTO。
 *
 * @author DTCoder
 */
public class SortRequest {

    @NotEmpty(message = "数组不能为空")
    @Size(max = 1000, message = "数组元素过多（超过1000）")
    private int[] array;

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] array) {
        this.array = array;
    }
}