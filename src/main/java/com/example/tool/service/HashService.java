package com.example.tool.service;

import com.example.tool.constant.HashAlgorithmEnum;

/**
 * 哈希计算服务接口。
 *
 * @author DTCoder
 */
public interface HashService {

    /**
     * 计算字符串的哈希值。
     *
     * @param input     输入字符串
     * @param algorithm 哈希算法
     * @return 十六进制哈希字符串
     */
    String computeHash(String input, HashAlgorithmEnum algorithm);
}