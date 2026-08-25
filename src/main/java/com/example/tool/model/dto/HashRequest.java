package com.example.tool.model.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * 哈希计算请求 DTO。
 *
 * @author DTCoder
 */
public class HashRequest {

    @NotBlank(message = "输入不能为空")
    private String input;

    private String algorithm;

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
}