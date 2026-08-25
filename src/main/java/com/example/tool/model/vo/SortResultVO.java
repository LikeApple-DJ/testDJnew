package com.example.tool.model.vo;

/**
 * 冒泡排序结果 VO。
 *
 * @author DTCoder
 */
public class SortResultVO {

    private int[] original;
    private int[] sorted;
    private int steps;

    public int[] getOriginal() {
        return original;
    }

    public void setOriginal(int[] original) {
        this.original = original;
    }

    public int[] getSorted() {
        return sorted;
    }

    public void setSorted(int[] sorted) {
        this.sorted = sorted;
    }

    public int getSteps() {
        return steps;
    }

    public void setSteps(int steps) {
        this.steps = steps;
    }
}