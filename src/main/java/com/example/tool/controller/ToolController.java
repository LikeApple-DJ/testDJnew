package com.example.tool.controller;

import com.example.tool.common.ApiResponse;
import com.example.tool.constant.HashAlgorithmEnum;
import com.example.tool.model.dto.HashRequest;
import com.example.tool.model.dto.SortRequest;
import com.example.tool.model.vo.HashResultVO;
import com.example.tool.model.vo.SortResultVO;
import com.example.tool.service.HashService;
import com.example.tool.service.SortService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 工具控制器，提供三个工具接口。
 *
 * @author DTCoder
 */
@RestController
@RequestMapping("/api/tool")
public class ToolController {

    private static final Logger logger = LoggerFactory.getLogger(ToolController.class);

    private final HashService hashService;
    private final SortService sortService;

    public ToolController(HashService hashService, SortService sortService) {
        this.hashService = hashService;
        this.sortService = sortService;
    }

    /**
     * HelloWorld 接口，返回问候语。
     *
     * @return 问候语响应
     */
    @GetMapping("/helloworld")
    public ApiResponse<Map<String, String>> helloWorld() {
        logger.info("HelloWorld 接口调用");
        return ApiResponse.success(Map.of("message", "Hello, World!"));
    }

    /**
     * 哈希算法接口，对输入字符串计算哈希值。
     *
     * @param request 哈希请求
     * @return 哈希结果
     */
    @PostMapping("/hash")
    public ApiResponse<HashResultVO> hash(@Valid @RequestBody HashRequest request) {
        logger.info("哈希接口调用: algorithm={}", request.getAlgorithm());
        HashAlgorithmEnum algorithm = HashAlgorithmEnum.fromName(request.getAlgorithm());
        String hash = hashService.computeHash(request.getInput(), algorithm);
        HashResultVO result = new HashResultVO(request.getInput(), algorithm.getAlgorithm(), hash);
        return ApiResponse.success(result);
    }

    /**
     * 冒泡排序接口，对输入整数数组执行冒泡排序。
     *
     * @param request 排序请求
     * @return 排序结果
     */
    @PostMapping("/sort")
    public ApiResponse<SortResultVO> sort(@Valid @RequestBody SortRequest request) {
        logger.info("冒泡排序接口调用: array length={}", request.getArray().length);
        SortResultVO result = sortService.bubbleSort(request.getArray());
        return ApiResponse.success(result);
    }
}